from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path

from reporting.pdf_report import generate_pdf

router = APIRouter(
    prefix="/report",
    tags=["Compliance Report"]
)

# Absolute path to project root
BASE_DIR = Path(__file__).resolve().parent.parent.parent

UPLOAD_DIR = BASE_DIR / "uploads"
REPORT_DIR = BASE_DIR / "reports"

UPLOAD_DIR.mkdir(exist_ok=True)
REPORT_DIR.mkdir(exist_ok=True)


@router.get("/")
def download_report(filename: str):
    """
    Generate BIS Compliance PDF report and return it.
    """

    pdf_path = UPLOAD_DIR / filename
    txt_path = UPLOAD_DIR / filename.replace(".pdf", ".txt")

    print(f"[REPORT] PDF : {pdf_path}")
    print(f"[REPORT] TXT : {txt_path}")

    if not pdf_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Tender PDF not found at {pdf_path}"
        )

    if not txt_path.exists():
        raise HTTPException(
            status_code=404,
            detail="OCR text not found. Run OCR first."
        )

    report_path = generate_pdf(filename)

    if not Path(report_path).exists():
        raise HTTPException(
            status_code=500,
            detail="Failed to generate report."
        )

    return FileResponse(
        path=report_path,
        media_type="application/pdf",
        filename=Path(report_path).name,
    )