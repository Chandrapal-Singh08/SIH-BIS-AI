from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
from dotenv import load_dotenv
import os

# ======================================================
# Load Environment Variables
# ======================================================

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

# ======================================================
# Upload & Report Directories
# ======================================================

UPLOAD_DIR = BASE_DIR / "uploads"
REPORT_DIR = BASE_DIR / "reports"

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
# CORS Configuration
# ======================================================

allowed_origins = [
    # Local Development
    "http://localhost:5173",
    "http://127.0.0.1:5173",

    # Vercel Frontend
    "https://sih-bis-ai.vercel.app",

    # Render Frontend
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
# Root Endpoint
# ======================================================

@app.get("/", tags=["Health"])
def root():
    return {
        "status": "online",
        "project": "AI Powered BIS Tender Compliance Engine",
        "version": "1.0.0",
        "deployment": "Render",
        "frontend": "https://sih-bis-ai-frontend.onrender.com",
        "message": "Backend API is running successfully 🚀",
    }

# ======================================================
# Health Check Endpoint (Render)
# ======================================================

@app.get("/health", tags=["Health"])
def health():
    return {
        "status": "healthy",
        "service": "AI Powered BIS Tender Compliance Engine",
    }

# ======================================================
# HEAD Endpoints (Prevents Render 405 Restart Issue)
# ======================================================

@app.head("/", include_in_schema=False)
def head_root():
    return {}

@app.head("/health", include_in_schema=False)
def head_health():
    return {}

# ======================================================
# Serve Uploaded Tender PDF
# Used by React Review Page
# ======================================================

@app.get("/pdf/{filename}", tags=["PDF"])
def serve_pdf(filename: str):
    pdf_path = UPLOAD_DIR / filename

    print(f"[PDF] Requested: {pdf_path}")

    if not pdf_path.exists():
        raise HTTPException(
            status_code=404,
            detail="PDF not found."
        )

    return FileResponse(
        path=str(pdf_path),
        media_type="application/pdf",
        filename=filename,
    )