from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
import shutil
import uuid
import re

router = APIRouter(
    prefix="/upload",
    tags=["Tender Upload"]
)

# ======================================================
# Upload Directory
# backend/uploads
# ======================================================

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# ======================================================
# Safe Filename Generator
# Removes spaces, brackets, special characters.
# ======================================================

def sanitize_filename(filename: str) -> str:
    name = Path(filename).stem
    extension = Path(filename).suffix.lower()

    # Replace spaces with underscore
    name = name.replace(" ", "_")

    # Remove brackets like (1)
    name = re.sub(r"[()]", "", name)

    # Keep only letters, numbers, _, -, .
    name = re.sub(r"[^a-zA-Z0-9_.-]", "", name)

    return f"{name}{extension}"

# ======================================================
# Upload Endpoint
# ======================================================

@router.post("/")
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload Government Tender PDF.
    Saves file with UUID + sanitized filename.
    """

    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    safe_name = sanitize_filename(file.filename)

    unique_filename = f"{uuid.uuid4()}_{safe_name}"

    file_path = UPLOAD_DIR / unique_filename

    try:
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

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Upload failed: {str(e)}"
        )