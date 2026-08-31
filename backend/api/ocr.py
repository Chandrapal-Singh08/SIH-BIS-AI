from fastapi import APIRouter
from pathlib import Path
import fitz                      # PyMuPDF
import pytesseract
from pdf2image import convert_from_path

router = APIRouter(
    prefix="/ocr",
    tags=["OCR Engine"]
)

BASE_DIR = Path(__file__).resolve().parent.parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# -------------------------------------------------------
# Extract text from Digital PDF
# -------------------------------------------------------
def extract_text_pymupdf(pdf_path: Path):
    document = fitz.open(pdf_path)

    text = ""

    for page in document:
        text += page.get_text()

    document.close()

    return text.strip()

# -------------------------------------------------------
# OCR for Scanned PDF
# -------------------------------------------------------
def extract_text_tesseract(pdf_path: Path):
    pages = convert_from_path(pdf_path)

    full_text = ""

    for image in pages:
        text = pytesseract.image_to_string(image, lang="eng")
        full_text += text + "\n"

    return full_text.strip()

# -------------------------------------------------------
# OCR Endpoint
# -------------------------------------------------------
@router.get("/")
def extract_ocr(filename: str):
    """
    Extract OCR text from uploaded PDF.

    Saves OCR text as uploads/<filename>.txt
    """

    pdf_path = UPLOAD_DIR / filename

    if not pdf_path.exists():
        return {
            "status": "error",
            "message": "PDF not found."
        }

    print(f"[OCR] Processing {filename}")

    # ---------- Try Digital Extraction ----------
    text = extract_text_pymupdf(pdf_path)

    method = "PyMuPDF"

    # ---------- Fallback to OCR ----------
    if len(text.strip()) < 50:
        print("[OCR] No embedded text found. Running OCR...")

        text = extract_text_tesseract(pdf_path)
        method = "Tesseract OCR"

    # ---------- Save OCR Text ----------
    txt_filename = filename.replace(".pdf", ".txt")
    txt_path = UPLOAD_DIR / txt_filename

    txt_path.write_text(text, encoding="utf-8")

    preview = text[:2000]

    return {
        "status": "success",
        "filename": filename,
        "ocr_file": txt_filename,
        "method": method,
        "characters_extracted": len(text),
        "preview": preview
    }

# -------------------------------------------------------
# Download OCR Text
# -------------------------------------------------------
@router.get("/download/")
def download_ocr_text(filename: str):
    txt_path = UPLOAD_DIR / filename.replace(".pdf", ".txt")

    if not txt_path.exists():
        return {
            "status": "error",
            "message": "OCR file not found."
        }

    return {
        "filename": txt_path.name,
        "ocr_text": txt_path.read_text(encoding="utf-8")
    }