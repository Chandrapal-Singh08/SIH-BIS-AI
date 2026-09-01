from sqlalchemy.orm import Session
from app.config import UPLOAD_DIR
from database.connection import SessionLocal
from database.models import Standard

PRODUCT_KEYWORDS = {
    "LED Street Lights": ["led", "street light", "ip66", "surge protection"],
    "Solar PV Module": ["solar", "photovoltaic"],
    "Ceiling Fan": ["ceiling fan"],
}


def identify_product(text):
    text = text.lower()
    for category, words in PRODUCT_KEYWORDS.items():
        if any(w in text for w in words):
            return category
    return "Unknown Product"


def recommend_standards(filename):

    txt_path = UPLOAD_DIR / filename.replace(".pdf", ".txt")

    if not txt_path.exists():
        return {
            "product_category": "Unknown Product",
            "recommended_standards": [],
        }

    tender_text = txt_path.read_text(encoding="utf-8", errors="ignore")

    category = identify_product(tender_text)

    db: Session = SessionLocal()

    try:
        standards = db.query(Standard).limit(5).all()

        recommendations = []

        for s in standards:
            recommendations.append({
                "standard": s.standard_number,
                "title": s.title,
                "reason": f"Recommended for {category}",
                "confidence": 95,
            })

        return {
            "product_category": category,
            "recommended_standards": recommendations,
        }

    finally:
        db.close()