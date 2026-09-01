from pathlib import Path
from sqlalchemy.orm import Session
from sentence_transformers import SentenceTransformer, util

from database.connection import SessionLocal
from database.models import Standard

# ======================================================
# Lazy Load Embedding Model (Render Memory Optimized)
# ======================================================

embedding_model = None

def get_embedding_model():
    global embedding_model

    if embedding_model is None:
        print("[RAG] Loading SentenceTransformer...")
        embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

    return embedding_model


# ======================================================
# Upload Directory (backend/uploads)
# ======================================================

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"

# ======================================================
# Product Detection
# ======================================================

PRODUCT_KEYWORDS = {
    "LED Street Lights": [
        "led luminaire",
        "street light",
        "road light",
        "ip66",
        "surge protection",
        "lumen efficacy",
    ],
    "Ceiling Fan": [
        "ceiling fan",
        "blade sweep",
    ],
    "Solar PV Module": [
        "solar panel",
        "photovoltaic",
        "pv module",
    ],
    "Helmet": [
        "helmet",
    ],
    "Fire Extinguisher": [
        "fire extinguisher",
    ],
}


def identify_product(text: str):
    text = text.lower()

    for category, keywords in PRODUCT_KEYWORDS.items():
        if any(keyword in text for keyword in keywords):
            return category

    return "Unknown Product"


# ======================================================
# Recommendation Engine
# ======================================================

def recommend_standards(filename: str):

    txt_path = UPLOAD_DIR / filename.replace(".pdf", ".txt")

    print(f"[RAG] OCR TXT: {txt_path}")

    if not txt_path.exists():
        return {
            "product_category": "Unknown Product",
            "recommended_standards": [],
        }

    tender_text = txt_path.read_text(
        encoding="utf-8",
        errors="ignore",
    )

    product_category = identify_product(tender_text)

    model = get_embedding_model()

    tender_embedding = model.encode(
        tender_text,
        convert_to_tensor=True,
        normalize_embeddings=True,
    )

    db: Session = SessionLocal()

    try:
        standards = db.query(Standard).all()

        if not standards:
            return {
                "product_category": product_category,
                "recommended_standards": [],
            }

        searchable_texts = [
            f"{s.standard_number} {s.title} {s.scope}"
            for s in standards
        ]

        standard_embeddings = model.encode(
            searchable_texts,
            convert_to_tensor=True,
            normalize_embeddings=True,
        )

        similarities = util.cos_sim(
            tender_embedding,
            standard_embeddings,
        )[0]

        recommendations = []

        for standard, similarity in zip(standards, similarities):

            score = similarity.item()

            if score >= 0.35:
                recommendations.append({
                    "standard": standard.standard_number,
                    "title": standard.title,
                    "reason": (
                        f"Relevant for {product_category}. "
                        f"Similarity score: {score:.2f}"
                    ),
                    "confidence": round(score * 100, 1),
                })

        recommendations.sort(
            key=lambda x: x["confidence"],
            reverse=True,
        )

        return {
            "product_category": product_category,
            "recommended_standards": recommendations[:5],
        }

    except Exception as e:
        print("[RAG ERROR]", e)

        return {
            "product_category": product_category,
            "recommended_standards": [],
        }

    finally:
        db.close()