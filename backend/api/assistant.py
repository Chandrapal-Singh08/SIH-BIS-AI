from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pathlib import Path

from ai.xassistant_engine import ask_ai

router = APIRouter(
    prefix="/assistant",
    tags=["AI Assistant"]
)

# ----------------------------------------------------
# Project Root → uploads/
# ----------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"


# ----------------------------------------------------
# Request Body Model
# ----------------------------------------------------
class AssistantRequest(BaseModel):
    filename: str
    question: str


# ----------------------------------------------------
# GET → AI Summary of Tender
# ----------------------------------------------------
@router.get("/")
def get_ai_summary(filename: str):
    """
    Returns a concise AI-generated summary of the uploaded tender.
    """

    txt_path = UPLOAD_DIR / filename.replace(".pdf", ".txt")

    if not txt_path.exists():
        raise HTTPException(
            status_code=404,
            detail="OCR text not found. Please extract OCR first."
        )

    tender_text = txt_path.read_text(encoding="utf-8")

    summary_question = (
        "Summarize this government tender in 6-8 bullet points. "
        "Include product category, quantity, important BIS requirements, "
        "eligibility criteria, warranty, voltage, IP rating, and key technical specifications."
    )

    answer = ask_ai(summary_question, tender_text)

    return {
        "status": "success",
        "filename": filename,
        "summary": answer
    }


# ----------------------------------------------------
# POST → Ask Questions About Tender
# ----------------------------------------------------
@router.post("/")
def ask_assistant(request: AssistantRequest):
    """
    Answers questions related to the uploaded tender using Gemini AI.
    """

    txt_path = UPLOAD_DIR / request.filename.replace(".pdf", ".txt")

    if not txt_path.exists():
        raise HTTPException(
            status_code=404,
            detail="OCR text not found. Please extract OCR first."
        )

    tender_text = txt_path.read_text(encoding="utf-8")

    answer = ask_ai(request.question, tender_text)

    return {
        "status": "success",
        "filename": request.filename,
        "question": request.question,
        "answer": answer
    }