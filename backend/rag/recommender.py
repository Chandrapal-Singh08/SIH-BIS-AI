from fastapi import HTTPException
from app.config import UPLOAD_DIR

# =====================================================
# BIS Standards Knowledge Base
# =====================================================

BIS_STANDARDS = {
    "LED Street Lights": [
        {
            "standard": "IS 10322 (Part 5/Sec 3)",
            "title": "Lighting for Roads and Public Spaces",
            "reason": "Applicable to LED street lighting installations.",
            "confidence": 98.5,
        },
        {
            "standard": "IS 16107",
            "title": "LED Modules for General Lighting",
            "reason": "Specifies safety and performance of LED modules.",
            "confidence": 95.2,
        },
        {
            "standard": "IS 16108",
            "title": "LED Luminaires Performance Requirements",
            "reason": "Performance requirements for LED luminaires.",
            "confidence": 93.4,
        },
        {
            "standard": "IS 15885",
            "title": "Safety of LED Control Gear",
            "reason": "Safety requirements for LED drivers/control gear.",
            "confidence": 90.8,
        },
        {
            "standard": "IS 10322",
            "title": "General Lighting Installation Guidelines",
            "reason": "BIS lighting installation practices.",
            "confidence": 89.1,
        },
    ],
    "Ceiling Fan": [
        {
            "standard": "IS 374",
            "title": "Ceiling Fan Specification",
            "reason": "Applicable BIS standard for ceiling fans.",
            "confidence": 97.0,
        }
    ],
    "Solar PV Module": [
        {
            "standard": "IS 14286",
            "title": "Crystalline Silicon PV Modules",
            "reason": "Applicable BIS standard for PV modules.",
            "confidence": 96.0,
        }
    ],
    "Helmet": [
        {
            "standard": "IS 4151",
            "title": "Protective Helmets for Two Wheeler Riders",
            "reason": "Applicable BIS helmet standard.",
            "confidence": 95.0,
        }
    ],
    "Fire Extinguisher": [
        {
            "standard": "IS 15683",
            "title": "Portable Fire Extinguishers",
            "reason": "Applicable BIS fire extinguisher standard.",
            "confidence": 96.0,
        }
    ],
}

# =====================================================
# Product Detection
# =====================================================

PRODUCT_KEYWORDS = {
    "LED Street Lights": [
        "led street light",
        "street light",
        "road light",
        "led luminaire",
        "ip66",
        "surge protection",
        "lumen efficacy",
    ],
    "Ceiling Fan": ["ceiling fan", "blade sweep"],
    "Solar PV Module": ["solar panel", "photovoltaic", "pv module"],
    "Helmet": ["helmet"],
    "Fire Extinguisher": ["fire extinguisher"],
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
    txt_path = UPLOAD_DIR / filename.replace(".pdf", ".txt")

    print("\n========== RECOMMENDER ==========")
    print("OCR File :", txt_path)
    print("Exists   :", txt_path.exists())

    if not txt_path.exists():
        raise HTTPException(
            status_code=404,
            detail="OCR text not found. Run OCR first."
        )

    tender_text = txt_path.read_text(
        encoding="utf-8",
        errors="ignore"
    )

    product = identify_product(tender_text)

    recommendations = BIS_STANDARDS.get(product, [])

    print("Product :", product)
    print("Recommendations :", len(recommendations))
    print("================================\n")

    return {
        "product_category": product,
        "recommended_standards": recommendations,
    }