from sqlalchemy.orm import Session
from sentence_transformers import SentenceTransformer, util

from app.config import UPLOAD_DIR
from database.connection import SessionLocal
from database.models import Standard

# ======================================================
# Lazy Load Embedding Model (Render Memory Optimized)
# ======================================================

embedding_model = None


def get_embedding_model():
    """
    Load embedding model only when recommendation endpoint is called.
    Saves memory on Render free instance.
    """
    global embedding_model

    if embedding_model is None:
        print("[RAG] Loading SentenceTransformer model...")
        embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

    return embedding_model


# ======================================================
# Product Category Detection
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
        "fan motor",
    ],
    "Solar PV Module": [
        "solar panel",
        "photovoltaic",
        "pv module",
        "solar module",
    ],
    "Helmet": [
        "helmet",
        "protective helmet",
    ],
    "Fire Extinguisher": [
        "fire extinguisher",
        "abc extinguisher",
    ],
}


def identify_product(text: str):
    """
    Identify tender product category using keywords.
    """
    text = text.lower()

    for category, keywords in PRODUCT_KEYWORDS.items():
        if any(keyword in text for keyword in keywords):
            return category

    return "Unknown Product"


# ======================================================
# Recommendation Engine
# ======================================================

def recommend_standards(filename: str):
    """
    Recommend BIS standards based on OCR text using semantic similarity.
    """

    txt_path = UPLOAD_DIR / filename.replace(".pdf", ".txt")

    print("\n========== RAG RECOMMENDER ==========")
    print("TXT Path :", txt_path)
    print("Exists   :", txt_path.exists())

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

    try:
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
                print("[RAG] No standards found in database.")
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
                score = float(similarity)

                if score >= 0.35:
                    recommendations.append({
                        "standard": standard.standard_number,
                        "title": standard.title,
                        "reason": (
                            f"Relevant for {product_category}. "
                            f"Semantic similarity score: {score:.2f}"
                        ),
                        "confidence": round(score * 100, 1),
                    })

            recommendations.sort(
                key=lambda item: item["confidence"],
                reverse=True,
            )

            print(f"[RAG] Found {len(recommendations)} recommendations.")

            return {
                "product_category": product_category,
                "recommended_standards": recommendations[:5],
            }

        finally:
            db.close()

    except Exception as e:
        print("[RAG ERROR]", e)

        return {
            "product_category": product_category,
            "recommended_standards": [],
        }