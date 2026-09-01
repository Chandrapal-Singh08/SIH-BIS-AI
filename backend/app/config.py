from pathlib import Path
from dotenv import load_dotenv
import os

# ======================================================
# Project Paths
# backend/app/config.py
# ======================================================

# backend/
BACKEND_DIR = Path(__file__).resolve().parent.parent

# SIH-BIS-AI/
PROJECT_ROOT = BACKEND_DIR.parent

# Load backend/.env
load_dotenv(BACKEND_DIR / ".env")

# ======================================================
# Environment Variables
# ======================================================

DATABASE_URL = os.getenv("DATABASE_URL")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL")

# ======================================================
# Shared Directories
# Every API imports these paths.
# ======================================================

UPLOAD_DIR = PROJECT_ROOT / "uploads"
REPORT_DIR = PROJECT_ROOT / "reports"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
REPORT_DIR.mkdir(parents=True, exist_ok=True)

# ======================================================
# CORS Origins
# ======================================================

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://sih-bis-ai.vercel.app",
    "https://sih-bis-ai-frontend.onrender.com",
]

if FRONTEND_URL and FRONTEND_URL not in ALLOWED_ORIGINS:
    ALLOWED_ORIGINS.append(FRONTEND_URL)