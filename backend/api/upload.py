from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
import shutil
import uuid
import re

router = APIRouter(
    prefix="/upload",
    tags=["Tender Upload"]
)

# -------------------------------------------------------
# backend/uploads
# -------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def sanitize_filename(filename: str):
    """Remove spaces and special characters."""
    name = Path(filename).stem
    ext = Path(filename).suffix.lower()

    name = name.replace(" ", "_")
    name = re.sub(r"[()]", "", name)
    name = re.sub(r"[^a-zA-Z0-9_.-]", "", name)

    return f"{name}{ext}"


@router.post("/")
async def upload_pdf(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(400, "Only PDF files are allowed.")

    safe_name = sanitize_filename(file.filename)
    unique_filename = f"{uuid.uuid4()}_{safe_name}"

    file_path = UPLOAD_DIR / unique_filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    print(f"[UPLOAD] Saved PDF: {file_path}")

    return {
        "status": "success",
        "filename": unique_filename,
        "original_filename": file.filename,
        "size_bytes": file_path.stat().st_size,
    }