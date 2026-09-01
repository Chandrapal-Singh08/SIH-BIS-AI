from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.config import UPLOAD_DIR
from ai.xassistant_engine import (
    generate_tender_summary,
    ask_tender_question,
)

router = APIRouter(
    prefix="/assistant",
    tags=["Gemini AI Assistant"],
)

# ======================================================
# Request Model
# ======================================================

class QuestionRequest(BaseModel):
    filename: str
    question: str


# ======================================================
# AI Tender Summary
# ======================================================

@router.get("/summary")
def get_summary(filename: str):
    """
    Generate AI summary from OCR extracted tender text.
    """

    txt_path = UPLOAD_DIR / filename.replace(".pdf", ".txt")

    print("\n========== GEMINI SUMMARY ==========")
    print("Filename :", filename)
    print("OCR File :", txt_path)
    print("Exists   :", txt_path.exists())

    if not txt_path.exists():
        raise HTTPException(
            status_code=404,
            detail="OCR text not found. Please run OCR first."
        )

    tender_text = txt_path.read_text(
        encoding="utf-8",
        errors="ignore"
    )

    summary = generate_tender_summary(tender_text)

    return {
        "status": "success",
        "filename": filename,
        "summary": summary,
    }


# ======================================================
# Procurement AI Chat
# ======================================================

@router.post("/ask")
def ask_question(request: QuestionRequest):
    """
    Ask procurement-related questions about uploaded tender.
    """

    txt_path = UPLOAD_DIR / request.filename.replace(".pdf", ".txt")

    print("\n========== GEMINI CHAT ==========")
    print("Filename :", request.filename)
    print("Question :", request.question)
    print("OCR File :", txt_path)

    if not txt_path.exists():
        raise HTTPException(
            status_code=404,
            detail="OCR text not found. Please run OCR first."
        )

    tender_text = txt_path.read_text(
        encoding="utf-8",
        errors="ignore"
    )

    answer = ask_tender_question(
        tender_text,
        request.question
    )

    return {
        "status": "success",
        "filename": request.filename,
        "question": request.question,
        "answer": answer,
    }