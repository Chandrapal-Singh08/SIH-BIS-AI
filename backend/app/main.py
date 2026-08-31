from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from api.standards import router as standards_router
from api.upload import router as upload_router
from api.ocr import router as ocr_router
from api.recommend import router as recommend_router
from api.validator import router as validator_router
from api.assistant import router as assistant_router
from reporting.report_api import router as report_router

app = FastAPI(
    title="AI-Powered BIS Recommendation System",
    version="1.0.0",
    description="Smart India Hackathon 2026 - AI Powered BIS Tender Compliance Engine",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Project Root
BASE_DIR = Path(__file__).resolve().parent.parent.parent

UPLOAD_DIR = BASE_DIR / "uploads"
REPORT_DIR = BASE_DIR / "reports"

UPLOAD_DIR.mkdir(exist_ok=True)
REPORT_DIR.mkdir(exist_ok=True)

app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")
app.mount("/reports", StaticFiles(directory=str(REPORT_DIR)), name="reports")

# Routers
app.include_router(standards_router)
app.include_router(upload_router)
app.include_router(ocr_router)
app.include_router(validator_router)
app.include_router(recommend_router)
app.include_router(report_router)
app.include_router(assistant_router)


@app.get("/", tags=["Root"])
def root():
    return {
        "status": "online",
        "project": "AI Powered BIS Tender Compliance Engine",
        "version": "1.0.0",
        "modules": [
            "Upload PDF",
            "OCR Extraction",
            "BIS Validator",
            "AI Recommendation",
            "Compliance Report Generator",
            "AI Assistant",
        ],
        "message": "Backend API is running successfully 🚀",
    }