from fastapi import APIRouter, HTTPException
from app.config import UPLOAD_DIR

router = APIRouter(
    prefix="/validate",
    tags=["BIS Validator"]
)

# ======================================================
# Mandatory BIS Clauses (LED Street Light - IS 10322)
# ======================================================

MANDATORY_CLAUSES = [
    {
        "label": "IP Rating",
        "expected": "IP66",
        "keywords": ["ip66", "ip rating", "ingress protection"],
        "page": 1,
        "top": 28,
        "left": 18,
    },
    {
        "label": "Warranty",
        "expected": "2 Years",
        "keywords": ["2 year", "2 years", "warranty"],
        "page": 1,
        "top": 36,
        "left": 18,
    },
    {
        "label": "Lumen Efficacy",
        "expected": "≥100 lm/W",
        "keywords": [
            "100 lm",
            "100 lm/w",
            "lm/w",
            "lumen efficacy",
            "100 lumen",
        ],
        "page": 1,
        "top": 44,
        "left": 18,
    },
    {
        "label": "Voltage Range",
        "expected": "140–270 VAC",
        "keywords": [
            "140 to 270",
            "140-270",
            "140 270",
            "voltage range",
            "270 vac",
        ],
        "page": 1,
        "top": 48,
        "left": 18,
    },
    {
        "label": "Power Factor",
        "expected": "≥0.95",
        "keywords": [
            "power factor",
            "0.95",
        ],
        "page": 1,
        "top": 52,
        "left": 18,
    },
    {
        "label": "Impact Resistance Rating",
        "expected": "IK08",
        "keywords": [
            "ik08",
            "impact resistance",
        ],
        "page": 1,
        "top": 67,
        "left": 22,
    },
    {
        "label": "Surge Protection",
        "expected": "10 kV",
        "keywords": [
            "surge protection",
            "10kv",
            "10 kv",
        ],
        "page": 1,
        "top": 73,
        "left": 18,
    },
]

# ======================================================
# Validator Endpoint
# ======================================================

@router.get("/")
def validate_document(filename: str):
    """
    Validate OCR extracted tender against mandatory BIS clauses.
    """

    txt_path = UPLOAD_DIR / filename.replace(".pdf", ".txt")

    print("\n========== VALIDATOR ==========")
    print("Filename :", filename)
    print("OCR Path :", txt_path)
    print("Exists   :", txt_path.exists())

    # -----------------------------
    # OCR File Check
    # -----------------------------
    if not txt_path.exists():
        raise HTTPException(
            status_code=404,
            detail="OCR text not found. Please run OCR first."
        )

    # -----------------------------
    # Read OCR Text
    # -----------------------------
    text = txt_path.read_text(
        encoding="utf-8",
        errors="ignore"
    ).lower()

    matched = []
    missing = []

    # -----------------------------
    # Keyword Matching
    # -----------------------------
    for clause in MANDATORY_CLAUSES:

        found = any(
            keyword in text
            for keyword in clause["keywords"]
        )

        clause_result = {
            "label": clause["label"],
            "expected": clause["expected"],
            "page": clause["page"],
            "top": clause["top"],
            "left": clause["left"],
        }

        if found:
            clause_result["status"] = "COMPLIANT"
            clause_result["recommendation"] = "No changes required."
            matched.append(clause_result)

        else:
            clause_result["status"] = "NON-COMPLIANT"
            clause_result["recommendation"] = (
                f"Add or update the tender with "
                f"{clause['label']} ({clause['expected']}) "
                f"as per BIS IS 10322."
            )
            missing.append(clause_result)

    # -----------------------------
    # Compliance Score
    # -----------------------------
    total = len(MANDATORY_CLAUSES)
    score = round((len(matched) / total) * 100)

    if score >= 90:
        risk_level = "LOW"
    elif score >= 70:
        risk_level = "MEDIUM"
    else:
        risk_level = "HIGH"

    summary = (
        f"Tender satisfies {len(matched)} out of {total} "
        f"mandatory BIS clauses. "
        f"{len(missing)} clause(s) require correction."
    )

    print("Matched :", len(matched))
    print("Missing :", len(missing))
    print("Score   :", score)
    print("===============================\n")

    # -----------------------------
    # Response
    # -----------------------------
    return {
        "status": "success",
        "filename": filename,
        "score": score,
        "risk_level": risk_level,
        "matched_clauses": len(matched),
        "total_clauses": total,
        "matched_details": matched,
        "missing_clauses": missing,
        "summary": summary,
    }