from fastapi import APIRouter, HTTPException
from pathlib import Path
import fitz
import pytesseract
from pdf2image import convert_from_path

router = APIRouter(prefix="/ocr", tags=["OCR"])

BASE_DIR = Path(__file__).resolve().parent.parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"


def extract_pdf_text(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""

    for page in doc:
        text += page.get_text()

    doc.close()
    return text.strip()


def extract_scan_text(pdf_path):
    pages = convert_from_path(pdf_path)
    text = ""

    for image in pages:
        text += pytesseract.image_to_string(image)

    return text.strip()


@router.get("/")
def extract_ocr(filename: str):

    pdf_path = UPLOAD_DIR / filename

    if not pdf_path.exists():
        raise HTTPException(404, "Uploaded PDF not found.")

    text = extract_pdf_text(pdf_path)
    method = "PyMuPDF"

    if len(text) < 50:
        text = extract_scan_text(pdf_path)
        method = "Tesseract OCR"

    txt_path = UPLOAD_DIR / filename.replace(".pdf", ".txt")
    txt_path.write_text(text, encoding="utf-8")

    return {
        "status": "success",
        "filename": filename,
        "ocr_file": txt_path.name,
        "method": method,
        "preview": text[:2000]
    }


@router.get("/download/")
def download_ocr(filename: str):
    txt_path = UPLOAD_DIR / filename.replace(".pdf", ".txt")

    if not txt_path.exists():
        raise HTTPException(404, "OCR text not found.")

    return {
        "filename": txt_path.name,
        "ocr_text": txt_path.read_text(encoding="utf-8")
    }