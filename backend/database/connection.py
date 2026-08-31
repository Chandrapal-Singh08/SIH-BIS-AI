from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
from pathlib import Path
import os

# ======================================================
# Load Environment Variables (.env for local development)
# ======================================================
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

# ======================================================
# Database URL
# Local  -> backend/.env
# Render -> Environment Variable (DATABASE_URL)
# ======================================================
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://chandrapalsingh@localhost:5432/bis_database"
)

# Render PostgreSQL URLs sometimes start with postgres://
# SQLAlchemy requires postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace(
        "postgres://",
        "postgresql://",
        1
    )

print("Loaded Database URL:", DATABASE_URL)

# ======================================================
# SQLAlchemy Engine
# ======================================================
engine = create_engine(
    DATABASE_URL,
    echo=False,
    future=True,
    pool_pre_ping=True
)

# ======================================================
# Session Factory
# ======================================================
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# ======================================================
# Base Model
# ======================================================
Base = declarative_base()

# ======================================================
# FastAPI Dependency
# ======================================================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()