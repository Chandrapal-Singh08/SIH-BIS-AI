from fastapi import FastAPI
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
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# ======================================================
# Static Files
# ======================================================

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
app.mount("/reports", StaticFiles(directory=REPORT_DIR), name="reports")

# ======================================================
# Routers
# ======================================================

from api.standards import router as standards_router
from api.upload import router as upload_router
from api.ocr import router as ocr_router
from api.validator import router as validator_router
from api.recommend import router as recommend_router
from api.assistant import router as assistant_router
from reporting.report_api import router as report_router

app.include_router(standards_router)
app.include_router(upload_router)
app.include_router(ocr_router)
app.include_router(validator_router)
app.include_router(recommend_router)
app.include_router(assistant_router)
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
        "frontend": "https://sih-bis-ai-frontend.onrender.com"
    }


@app.get("/health", tags=["Health"])
def health():
    return {
        "status": "healthy"
    }


@app.head("/", include_in_schema=False)
def head_root():
    return {}


@app.head("/health", include_in_schema=False)
def head_health():
    return {}

# ======================================================
# PDF Serving (PDF Review Page)
# ======================================================

@app.get("/pdf/{filename}")
def serve_pdf(filename: str):
    file_path = UPLOAD_DIR / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="PDF not found")

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename=filename,
    )