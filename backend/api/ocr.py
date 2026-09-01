from fastapi import APIRouter, HTTPException
import fitz
import pytesseract
from pdf2image import convert_from_path

from app.config import UPLOAD_DIR

router = APIRouter(
    prefix="/ocr",
    tags=["OCR Engine"]
)


def extract_text_pymupdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""

    for page in doc:
        text += page.get_text()

    doc.close()
    return text.strip()


def extract_text_tesseract(pdf_path):
    pages = convert_from_path(pdf_path)
    text = ""

    for page in pages:
        text += pytesseract.image_to_string(page, lang="eng") + "\n"

    return text.strip()


@router.get("/")
def extract_ocr(filename: str):

    pdf_path = UPLOAD_DIR / filename

    if not pdf_path.exists():
        raise HTTPException(404, "Tender PDF not found.")

    print(f"[OCR] Reading PDF -> {pdf_path}")

    text = extract_text_pymupdf(pdf_path)
    method = "PyMuPDF"

    if len(text) < 50:
        text = extract_text_tesseract(pdf_path)
        method = "Tesseract OCR"

    txt_path = UPLOAD_DIR / filename.replace(".pdf", ".txt")
    txt_path.write_text(text, encoding="utf-8")

    print(f"[OCR] Saved TXT -> {txt_path}")

    return {
        "status": "success",
        "filename": filename,
        "ocr_file": txt_path.name,
        "method": method,
        "characters_extracted": len(text),
        "preview": text[:2000],
    }


@router.get("/download/")
def download_ocr(filename: str):

    txt_path = UPLOAD_DIR / filename.replace(".pdf", ".txt")

    if not txt_path.exists():
        raise HTTPException(404, "OCR file not found.")

    return {
        "filename": txt_path.name,
        "ocr_text": txt_path.read_text(encoding="utf-8"),
    }