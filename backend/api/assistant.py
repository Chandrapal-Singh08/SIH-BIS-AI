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


class QuestionRequest(BaseModel):
    filename: str
    question: str


@router.get("/summary")
def get_summary(filename: str):

    txt_path = UPLOAD_DIR / filename.replace(".pdf", ".txt")

    if not txt_path.exists():
        raise HTTPException(
            status_code=404,
            detail="OCR text not found."
        )

    tender_text = txt_path.read_text(
        encoding="utf-8",
        errors="ignore"
    )

    summary = generate_tender_summary(tender_text)

    return {
        "status": "success",
        "summary": summary,
    }


@router.post("/ask")
def ask_question(request: QuestionRequest):

    txt_path = UPLOAD_DIR / request.filename.replace(".pdf", ".txt")

    if not txt_path.exists():
        raise HTTPException(
            status_code=404,
            detail="OCR text not found."
        )

    tender_text = txt_path.read_text(
        encoding="utf-8",
        errors="ignore"
    )

    answer = ask_tender_question(
        tender_text,
        request.question,
    )

    return {
        "status": "success",
        "answer": answer,
    }