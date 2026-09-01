from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
import shutil
import uuid
import re

from app.config import UPLOAD_DIR

router = APIRouter(
    prefix="/upload",
    tags=["Tender Upload"]
)


def sanitize_filename(filename: str) -> str:
    """
    Remove spaces and special characters from uploaded filename.
    Example:
    tender (1).pdf -> tender_1.pdf
    """
    filename = filename.replace(" ", "_")
    filename = re.sub(r"[()]", "", filename)
    filename = re.sub(r"[^a-zA-Z0-9._-]", "_", filename)
    return filename


@router.post("/")
async def upload_pdf(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    clean_name = sanitize_filename(file.filename)
    unique_filename = f"{uuid.uuid4()}_{clean_name}"

    file_path = UPLOAD_DIR / unique_filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    print(f"[UPLOAD] Saved PDF -> {file_path}")

    return {
        "status": "success",
        "message": "Tender uploaded successfully.",
        "filename": unique_filename,
        "original_filename": file.filename,
        "size_bytes": file_path.stat().st_size,
    }