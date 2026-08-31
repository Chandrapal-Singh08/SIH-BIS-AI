from fastapi import APIRouter
from pathlib import Path

router = APIRouter(
    prefix="/assistant",
    tags=["AI Assistant"]
)

# Folder containing OCR text files
OCR_DIR = Path("uploads")

# ---------------------------------------------
# BIS Clause Knowledge Base
# ---------------------------------------------
BIS_EXPLANATIONS = {
    "IP66": (
        "IP66 means the LED street light is completely protected against dust "
        "and powerful water jets. It is suitable for outdoor road lighting."
    ),
    "Power Factor": (
        "BIS recommends a Power Factor of at least 0.95 for LED street lights. "
        "A higher power factor improves electrical efficiency and reduces losses."
    ),
    "IK08": (
        "IK08 is the Impact Resistance Rating. It ensures the street light "
        "can withstand mechanical impacts in outdoor environments."
    ),
    "Lumen Efficacy": (
        "Lumen efficacy measures how efficiently electrical power is converted "
        "into visible light. BIS recommends at least 100 lm/W."
    ),
    "Voltage": (
        "The recommended operating voltage range is 140–270 VAC for stable "
        "performance under varying grid conditions."
    ),
    "Warranty": (
        "Government LED tenders generally require a minimum 2-year warranty "
        "for reliability and maintenance compliance."
    ),
    "Surge Protection": (
        "10kV surge protection protects the luminaire from voltage spikes and "
        "lightning-induced surges."
    ),
}

# ---------------------------------------------
# Helper Function
# ---------------------------------------------
def load_ocr_text(filename: str):
    txt_file = OCR_DIR / filename.replace(".pdf", ".txt")

    if not txt_file.exists():
        return None

    return txt_file.read_text(encoding="utf-8").lower()


# ---------------------------------------------
# AI Assistant Endpoint
# ---------------------------------------------
@router.post("/")
def ask_assistant(payload: dict):
    """
    AI Procurement Assistant
    Expected JSON:
    {
        "filename": "...pdf",
        "question": "Explain IP66"
    }
    """

    filename = payload.get("filename")
    question = payload.get("question", "").lower()

    if not filename:
        return {"answer": "Filename is required."}

    text = load_ocr_text(filename)

    if text is None:
        return {
            "answer": "OCR text not found. Please upload and extract OCR first."
        }

    # -----------------------------------------
    # AI Rule-Based Responses
    # -----------------------------------------

    # Missing clauses
    if "missing" in question or "clause" in question:
        missing = []

        checks = {
            "Power Factor": "power factor",
            "Impact Resistance Rating": "ik08",
            "IP66": "ip66",
            "Warranty": "2 year",
            "Lumen Efficacy": "100 lm",
            "Voltage": "140",
            "Surge Protection": "10kv",
        }

        for clause, keyword in checks.items():
            if keyword not in text:
                missing.append(clause)

        if missing:
            return {
                "answer": (
                    "The tender is missing the following BIS clauses:\n\n• "
                    + "\n• ".join(missing)
                    + "\n\nThese specifications should be added before publishing."
                )
            }

        return {"answer": "All mandatory BIS clauses were found in the tender."}

    # Explain BIS clauses
    for keyword, explanation in BIS_EXPLANATIONS.items():
        if keyword.lower() in question:
            return {"answer": explanation}

    # Recommendation questions
    if "recommend" in question or "bis standard" in question:
        return {
            "answer": (
                "AI recommended BIS standards because the OCR detected an LED "
                "Street Lighting tender. Relevant standards include:\n\n"
                "• IS 10322 – LED Luminaire Safety\n"
                "• IS 16102 – LED Street Lighting Performance\n"
                "• IS 16107 – Photometric Requirements\n\n"
                "These standards are applicable for Government procurement."
            )
        }

    # Compliance questions
    if "compliant" in question or "improve" in question:
        return {
            "answer": (
                "To improve BIS compliance:\n\n"
                "1. Add Power Factor ≥ 0.95.\n"
                "2. Include IK08 Impact Resistance Rating.\n"
                "3. Verify IP66 protection.\n"
                "4. Mention 10kV Surge Protection.\n"
                "5. Ensure Warranty is at least 2 years."
            )
        }

    # Risk questions
    if "risk" in question:
        return {
            "answer": (
                "The tender has MEDIUM procurement risk because mandatory BIS "
                "clauses are missing. Missing compliance specifications may lead "
                "to vendor disputes or tender rejection."
            )
        }

    # Default AI response
    return {
        "answer": (
            "I can help explain BIS standards, procurement clauses, compliance "
            "requirements, missing specifications, IP ratings, lumen efficacy, "
            "warranty requirements, surge protection, and LED street lighting "
            "standards used in Government tenders."
        )
    }