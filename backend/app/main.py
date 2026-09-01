from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
from dotenv import load_dotenv
import os

# ======================================================
# Project Root Configuration
# backend/app/main.py
# ======================================================

# backend/
BACKEND_DIR = Path(__file__).resolve().parent.parent

# SIH-BIS-AI/
PROJECT_ROOT = BACKEND_DIR.parent

# Load .env from backend/
load_dotenv(BACKEND_DIR / ".env")

# Shared folders (used by Upload, OCR, Validator, Recommendation, Report)
UPLOAD_DIR = PROJECT_ROOT / "uploads"
REPORT_DIR = PROJECT_ROOT / "reports"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
REPORT_DIR.mkdir(parents=True, exist_ok=True)

# ======================================================
# FastAPI Application
# ======================================================

app = FastAPI(
    title="AI Powered BIS Tender Compliance Engine",
    version="1.0.0",
    description="Smart India Hackathon 2026 - AI Powered BIS Tender Compliance Engine",
)

# ======================================================
# CORS Configuration (Render + Vercel + Localhost)
# ======================================================

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://sih-bis-ai.vercel.app",
    "https://sih-bis-ai-frontend.onrender.com",
]

FRONTEND_URL = os.getenv("FRONTEND_URL")
if FRONTEND_URL and FRONTEND_URL not in allowed_origins:
    allowed_origins.append(FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(set(allowed_origins)),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# ======================================================
# Static Files
# ======================================================

app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")
app.mount("/reports", StaticFiles(directory=str(REPORT_DIR)), name="reports")

# ======================================================
# Import Routers
# ======================================================

from api.upload import router as upload_router
from api.ocr import router as ocr_router
from api.validator import router as validator_router
from api.recommend import router as recommend_router
from api.assistant import router as assistant_router
from api.standards import router as standards_router
from reporting.report_api import router as report_router

# ======================================================
# Register Routers
# ======================================================

app.include_router(upload_router)
app.include_router(ocr_router)
app.include_router(validator_router)
app.include_router(recommend_router)
app.include_router(assistant_router)
app.include_router(standards_router)
app.include_router(report_router)

# ======================================================
# Health Endpoints
# ======================================================

@app.get("/", tags=["Health"])
def root():
    return {
        "status": "online",
        "project": "AI Powered BIS Tender Compliance Engine",
        "version": "1.0.0",
        "deployment": "Render",
        "frontend": "https://sih-bis-ai-frontend.onrender.com",
        "uploads_directory": str(UPLOAD_DIR),
        "reports_directory": str(REPORT_DIR),
        "uploads_exists": UPLOAD_DIR.exists(),
        "reports_exists": REPORT_DIR.exists(),
    }


@app.get("/health", tags=["Health"])
def health():
    return {
        "status": "healthy",
        "service": "AI Powered BIS Tender Compliance Engine",
    }


# Render sends HEAD requests for health checks
@app.head("/", include_in_schema=False)
def head_root():
    return {}


@app.head("/health", include_in_schema=False)
def head_health():
    return {}

# ======================================================
# PDF Preview Endpoint
# Used by React PDF Review Page
# ======================================================

@app.get("/pdf/{filename:path}", tags=["PDF Preview"])
def serve_pdf(filename: str):
    file_path = UPLOAD_DIR / filename

    print("\n========== PDF PREVIEW ==========")
    print("Filename :", filename)
    print("Path     :", file_path)
    print("Exists   :", file_path.exists())
    print("================================\n")

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="PDF not found."
        )

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=filename,
    )