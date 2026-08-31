from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from dotenv import load_dotenv
import os

# ======================================================
# Load Environment Variables
# ======================================================

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

# ======================================================
# FastAPI Application
# ======================================================

app = FastAPI(
    title="AI Powered BIS Tender Compliance Engine",
    version="1.0.0",
    description="Smart India Hackathon 2026 - AI Powered BIS Tender Compliance Engine",
)

# ======================================================
# CORS Configuration (Local + Vercel)
# ======================================================

FRONTEND_URL = os.getenv("FRONTEND_URL")

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",

    # Production Frontend
    "https://sih-bis-ai.vercel.app",
]

# Add Render environment variable if present
if FRONTEND_URL and FRONTEND_URL not in allowed_origins:
    allowed_origins.append(FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================================================
# Static File Directories
# ======================================================

UPLOAD_DIR = BASE_DIR / "uploads"
REPORT_DIR = BASE_DIR / "reports"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
REPORT_DIR.mkdir(parents=True, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")
app.mount("/reports", StaticFiles(directory=str(REPORT_DIR)), name="reports")

# ======================================================
# Import Routers
# ======================================================

from api.standards import router as standards_router
from api.upload import router as upload_router
from api.ocr import router as ocr_router
from api.validator import router as validator_router
from api.recommend import router as recommend_router
from api.assistant import router as assistant_router
from reporting.report_api import router as report_router

# ======================================================
# Register Routers
# ======================================================

app.include_router(standards_router, tags=["BIS Standards"])
app.include_router(upload_router, tags=["Upload"])
app.include_router(ocr_router, tags=["OCR"])
app.include_router(validator_router, tags=["Validation"])
app.include_router(recommend_router, tags=["AI Recommendation"])
app.include_router(assistant_router, tags=["AI Assistant"])
app.include_router(report_router, tags=["Compliance Report"])

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
        "frontend": "https://sih-bis-ai.vercel.app",
        "message": "Backend API is running successfully 🚀",
        "modules": [
            "Upload PDF",
            "OCR Extraction",
            "BIS Validator",
            "AI Recommendation Engine",
            "Compliance Report Generator",
            "Gemini AI Assistant",
        ],
    }

# ======================================================
# Health Endpoint (Render Health Check)
# ======================================================

@app.get("/health", tags=["Health"])
def health():
    return {
        "status": "healthy",
        "service": "AI Powered BIS Tender Compliance Engine"
    }