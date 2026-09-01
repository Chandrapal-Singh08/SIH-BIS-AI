from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path
import fitz
import pytesseract
from pdf2image import convert_from_path

router = APIRouter(
    prefix="/ocr",
    tags=["OCR Engine"]
)

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def extract_text_pymupdf(pdf_path: Path):
    doc = fitz.open(pdf_path)
    text = ""

    for page in doc:
        text += page.get_text()

    doc.close()
    return text.strip()


def extract_text_tesseract(pdf_path: Path):
    images = convert_from_path(pdf_path)

    text = ""
    for img in images:
        text += pytesseract.image_to_string(img, lang="eng") + "\n"

    return text.strip()


@router.get("/")
def extract_ocr(filename: str):
    pdf_path = UPLOAD_DIR / filename

    if not pdf_path.exists():
        raise HTTPException(404, "Uploaded PDF not found.")

    print(f"[OCR] Processing: {pdf_path}")

    text = extract_text_pymupdf(pdf_path)
    method = "PyMuPDF"

    if len(text.strip()) < 50:
        print("[OCR] Using Tesseract OCR...")
        text = extract_text_tesseract(pdf_path)
        method = "Tesseract OCR"

    txt_name = pdf_path.stem + ".txt"
    txt_path = UPLOAD_DIR / txt_name

    txt_path.write_text(text, encoding="utf-8")

    return {
        "status": "success",
        "filename": filename,
        "ocr_file": txt_name,
        "method": method,
        "characters_extracted": len(text),
        "preview": text[:2000],
    }


@router.get("/download/")
def download_ocr(filename: str):
    txt_path = UPLOAD_DIR / filename.replace(".pdf", ".txt")

    if not txt_path.exists():
        raise HTTPException(404, "OCR file not found.")

    return FileResponse(
        txt_path,
        media_type="text/plain",
        filename=txt_path.name
    )