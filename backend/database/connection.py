from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
from pathlib import Path
import os

# ------------------------------------------------------
# Load Environment Variables
# ------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL not found in backend/.env")

print("Loaded Database URL:", DATABASE_URL)

# ------------------------------------------------------
# SQLAlchemy Engine
# ------------------------------------------------------
engine = create_engine(
    DATABASE_URL,
    echo=False,
    future=True
)

# ------------------------------------------------------
# Session Factory
# ------------------------------------------------------
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# ------------------------------------------------------
# Base Model
# ------------------------------------------------------
Base = declarative_base()

# ------------------------------------------------------
# Dependency for FastAPI
# ------------------------------------------------------
def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()