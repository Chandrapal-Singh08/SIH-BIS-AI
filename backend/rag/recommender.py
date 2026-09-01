from sqlalchemy.orm import Session

from database.connection import SessionLocal
from database.models import Standard
from app.config import UPLOAD_DIR

# =====================================================
# Product Detection
# =====================================================

PRODUCT_KEYWORDS = {
    "LED Street Lights": [
        "led",
        "street light",
        "luminaire",
        "ip66",
        "surge protection",
        "lumen efficacy",
        "road lighting",
    ],
    "Ceiling Fan": [
        "ceiling fan",
        "blade sweep",
        "fan motor",
    ],
    "Solar PV Module": [
        "solar",
        "pv module",
        "photovoltaic",
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
        if any(k in text for k in keywords):
            return category

    return "Unknown Product"


# =====================================================
# Recommendation Engine
# =====================================================

def recommend_standards(filename: str):
    txt_path = UPLOAD_DIR / filename.replace(".pdf", ".txt")

    if not txt_path.exists():
        return {
            "product_category": "Unknown Product",
            "recommended_standards": [],
        }

    tender_text = txt_path.read_text(
        encoding="utf-8",
        errors="ignore",
    ).lower()

    product_category = identify_product(tender_text)

    db: Session = SessionLocal()

    try:
        standards = db.query(Standard).all()

        recommendations = []

        for standard in standards:
            searchable = (
                f"{standard.standard_number} "
                f"{standard.title} "
                f"{standard.scope}"
            ).lower()

            score = 0

            for keyword in PRODUCT_KEYWORDS.get(product_category, []):
                if keyword in searchable or keyword in tender_text:
                    score += 20

            if standard.standard_number.lower() in tender_text:
                score += 40

            if score > 0:
                recommendations.append(
                    {
                        "standard": standard.standard_number,
                        "title": standard.title,
                        "reason": f"Relevant for {product_category}.",
                        "confidence": min(score, 100),
                    }
                )

        recommendations.sort(
            key=lambda x: x["confidence"],
            reverse=True,
        )

        return {
            "product_category": product_category,
            "recommended_standards": recommendations[:5],
        }

    finally:
        db.close()