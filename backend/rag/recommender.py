from pathlib import Path
import traceback

from sentence_transformers import SentenceTransformer, util
from sqlalchemy.orm import Session

from database.connection import SessionLocal
from database.models import Standard

# =====================================================
# Lazy Load Embedding Model (Render Optimized)
# =====================================================

_embedding_model = None


def get_embedding_model():
    """
    Loads embedding model only when first requested.
    Saves Render memory during startup.
    """
    global _embedding_model

    if _embedding_model is None:
        print("Loading SentenceTransformer...")
        _embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

    return _embedding_model


# =====================================================
# Upload Directory
# =====================================================

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"

# =====================================================
# Product Identification
# =====================================================

PRODUCT_KEYWORDS = {
    "LED Street Lights": [
        "led luminaire",
        "led street light",
        "street light",
        "road light",
        "luminaire",
        "ip66",
        "surge protection",
        "36w",
        "60w",
        "90w"
    ],
    "Ceiling Fan": [
        "ceiling fan",
        "fan motor",
        "blade sweep",
        "fan regulator"
    ],
    "Solar PV Module": [
        "solar",
        "pv module",
        "solar panel",
        "photovoltaic"
    ],
    "Helmet": [
        "helmet",
        "protective helmet"
    ],
    "Fire Extinguisher": [
        "fire extinguisher",
        "abc extinguisher"
    ]
}


def identify_product(text: str):
    text = text.lower()

    for category, keywords in PRODUCT_KEYWORDS.items():
        if any(word in text for word in keywords):
            return category

    return "Unknown Product"


# =====================================================
# Recommendation Engine
# =====================================================

def recommend_standards(filename: str):
    """
    Uses OCR text + PostgreSQL BIS database
    to recommend the most relevant BIS standards.
    """

    txt_path = UPLOAD_DIR / filename.replace(".pdf", ".txt")

    if not txt_path.exists():
        print("OCR text missing:", txt_path)

        return {
            "product_category": "Unknown Product",
            "recommended_standards": []
        }

    try:
        tender_text = txt_path.read_text(
            encoding="utf-8",
            errors="ignore"
        )

        if len(tender_text.strip()) == 0:
            return {
                "product_category": "Unknown Product",
                "recommended_standards": []
            }

        product_category = identify_product(tender_text)

        print("Detected Product:", product_category)

        model = get_embedding_model()

        tender_embedding = model.encode(
            tender_text[:6000],          # Limit OCR size
            convert_to_tensor=True,
            normalize_embeddings=True
        )

        db: Session = SessionLocal()

        try:
            standards = db.query(Standard).all()

            if not standards:
                print("No standards found in PostgreSQL.")

                return {
                    "product_category": product_category,
                    "recommended_standards": []
                }

            searchable_texts = [
                f"{s.standard_number}. {s.title}. {s.scope}"
                for s in standards
            ]

            standard_embeddings = model.encode(
                searchable_texts,
                convert_to_tensor=True,
                normalize_embeddings=True
            )

            similarities = util.cos_sim(
                tender_embedding,
                standard_embeddings
            )[0]

            recommendations = []

            for standard, similarity in zip(standards, similarities):

                score = float(similarity)

                # Boost if detected category appears in title
                boost = (
                    0.15
                    if product_category.lower()
                    in standard.title.lower()
                    else 0
                )

                confidence = score + boost

                if confidence >= 0.30:
                    recommendations.append({
                        "standard": standard.standard_number,
                        "title": standard.title,
                        "reason": (
                            f"Relevant for {product_category}. "
                            f"Semantic similarity score {confidence:.2f}"
                        ),
                        "confidence": round(confidence * 100, 2)
                    })

            recommendations.sort(
                key=lambda item: item["confidence"],
                reverse=True
            )

            print("Recommended Standards:", len(recommendations))

            return {
                "product_category": product_category,
                "recommended_standards": recommendations[:5]
            }

        finally:
            db.close()

    except Exception:
        print("\n========== RAG ERROR ==========")
        traceback.print_exc()
        print("================================\n")

        return {
            "product_category": "Unknown Product",
            "recommended_standards": []
        }