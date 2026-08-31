from pathlib import Path
from sentence_transformers import SentenceTransformer, util
from sqlalchemy.orm import Session

from database.connection import SessionLocal
from database.models import Standard

# ------------------------------------------------------
# Load Embedding Model (Loads once when server starts)
# ------------------------------------------------------
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# ------------------------------------------------------
# Project Root → uploads/
# ------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"


# ------------------------------------------------------
# Identify Product Category (Simple Keyword Detection)
# ------------------------------------------------------
def identify_product(text: str):
    """
    Identify product category from OCR text.
    """

    text = text.lower()

    PRODUCT_KEYWORDS = {
        "LED Street Lights": [
            "led luminaire",
            "street light",
            "road light",
            "ip66",
            "36w",
        ],
        "Ceiling Fan": [
            "ceiling fan",
            "fan motor",
            "blade sweep",
        ],
        "Solar PV Module": [
            "solar",
            "photovoltaic",
            "pv module",
            "solar panel",
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

    for category, keywords in PRODUCT_KEYWORDS.items():
        if any(keyword in text for keyword in keywords):
            return category

    return "Unknown Product"


# ------------------------------------------------------
# Semantic BIS Recommendation Engine
# ------------------------------------------------------
def recommend_standards(filename: str):
    """
    Recommend BIS standards using OCR text + semantic similarity.

    Returns:
        {
            product_category,
            recommended_standards
        }
    """

    txt_path = UPLOAD_DIR / filename.replace(".pdf", ".txt")

    if not txt_path.exists():
        return {
            "product_category": "Unknown Product",
            "recommended_standards": [],
        }

    tender_text = txt_path.read_text(
        encoding="utf-8",
        errors="ignore"
    )

    product_category = identify_product(tender_text)

    # Create embedding for tender
    tender_embedding = embedding_model.encode(
        tender_text,
        convert_to_tensor=True,
    )

    db: Session = SessionLocal()

    try:
        standards = db.query(Standard).all()

        recommendations = []

        for standard in standards:

            # Combine searchable text
            searchable_text = (
                f"{standard.standard_number} "
                f"{standard.title} "
                f"{standard.scope}"
            )

            standard_embedding = embedding_model.encode(
                searchable_text,
                convert_to_tensor=True,
            )

            similarity = util.cos_sim(
                tender_embedding,
                standard_embedding,
            ).item()

            # Threshold for recommendation
            if similarity >= 0.35:
                recommendations.append(
                    {
                        "standard": standard.standard_number,
                        "title": standard.title,
                        "reason": (
                            f"Relevant for {product_category}. "
                            f"Semantic similarity score: {similarity:.2f}"
                        ),
                        "confidence": round(similarity * 100, 1),
                    }
                )

        # Highest confidence first
        recommendations.sort(
            key=lambda item: item["confidence"],
            reverse=True,
        )

        return {
            "product_category": product_category,
            "recommended_standards": recommendations[:5],
        }

    finally:
        db.close()