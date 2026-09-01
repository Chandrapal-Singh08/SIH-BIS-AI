from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
import shutil
import uuid
import re

router = APIRouter(prefix="/upload", tags=["Upload"])

BASE_DIR = Path(__file__).resolve().parent.parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def clean_filename(filename: str):
    filename = filename.strip()
    filename = filename.replace(" ", "_")
    filename = filename.replace("(", "")
    filename = filename.replace(")", "")
    filename = re.sub(r"[^A-Za-z0-9._-]", "_", filename)
    return filename


@router.post("/")
async def upload_pdf(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(400, "Only PDF files are allowed.")

    cleaned = clean_filename(file.filename)
    unique_filename = f"{uuid.uuid4()}_{cleaned}"

    file_path = UPLOAD_DIR / unique_filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "status": "success",
        "filename": unique_filename,
        "original_filename": cleaned,
        "size_bytes": file_path.stat().st_size
    }