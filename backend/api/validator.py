from fastapi import APIRouter
from pathlib import Path

router = APIRouter(
    prefix="/validate",
    tags=["Validator"]
)

# ======================================================
# Upload Directory (backend/uploads)
# ======================================================

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"

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
        "expected": ">=100 lm/W",
        "keywords": ["100 lm", "lumen efficacy", "lm/w", "100 lumen"],
        "page": 1,
        "top": 44,
        "left": 18,
    },
    {
        "label": "Voltage Range",
        "expected": "140–270 VAC",
        "keywords": ["140 to 270", "140-270", "140 270", "voltage range"],
        "page": 1,
        "top": 48,
        "left": 18,
    },
    {
        "label": "Power Factor",
        "expected": ">=0.95",
        "keywords": ["power factor", "0.95"],
        "page": 1,
        "top": 52,
        "left": 18,
    },
    {
        "label": "Impact Resistance Rating",
        "expected": "IK08",
        "keywords": ["ik08", "impact resistance"],
        "page": 1,
        "top": 67,
        "left": 22,
    },
    {
        "label": "Surge Protection",
        "expected": "10kV",
        "keywords": ["surge protection", "10kv", "10 kv"],
        "page": 1,
        "top": 73,
        "left": 18,
    },
]

# ======================================================
# Validation Endpoint
# ======================================================

@router.get("/")
def validate_document(filename: str):
    """
    Validate OCR extracted tender against BIS mandatory clauses.
    """

    txt_path = UPLOAD_DIR / filename.replace(".pdf", ".txt")

    print(f"[Validator] OCR File: {txt_path}")

    if not txt_path.exists():
        return {
            "score": 0,
            "risk_level": "HIGH",
            "matched_clauses": 0,
            "total_clauses": len(MANDATORY_CLAUSES),
            "matched_details": [],
            "missing_clauses": [],
            "summary": "OCR file not found. Please extract OCR first.",
        }

    text = txt_path.read_text(
        encoding="utf-8",
        errors="ignore"
    ).lower()

    matched = []
    missing = []

    for clause in MANDATORY_CLAUSES:

        found = any(keyword in text for keyword in clause["keywords"])

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
                f"Include {clause['label']} = {clause['expected']} "
                "as per BIS IS 10322."
            )
            missing.append(clause_result)

    total = len(MANDATORY_CLAUSES)
    score = round((len(matched) / total) * 100)

    if score >= 90:
        risk_level = "LOW"
    elif score >= 70:
        risk_level = "MEDIUM"
    else:
        risk_level = "HIGH"

    summary = (
        f"Tender satisfies {len(matched)} of {total} mandatory BIS clauses. "
        f"{len(missing)} clause(s) need correction."
    )

    return {
        "score": score,
        "risk_level": risk_level,
        "matched_clauses": len(matched),
        "total_clauses": total,
        "matched_details": matched,
        "missing_clauses": missing,
        "summary": summary,
    }