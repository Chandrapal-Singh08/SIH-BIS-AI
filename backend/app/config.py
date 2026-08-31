# backend/app/config.py

import os
from dotenv import load_dotenv

# Load .env when running locally
load_dotenv()

# PostgreSQL Database URL
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://chandrapalsingh@localhost:5432/bis_database"
)

# Gemini API Key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Hugging Face Token
HF_TOKEN = os.getenv("HF_TOKEN", "")

print("Loaded Database URL:", DATABASE_URL)