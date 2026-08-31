import os
from pathlib import Path
from dotenv import load_dotenv
import google.generativeai as genai

# ======================================================
# Load Environment Variables
# ======================================================

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is missing in Render environment.")

# ======================================================
# Lazy Gemini Initialization
# ======================================================

_model = None

def get_model():
    global _model

    if _model is None:
        genai.configure(api_key=GEMINI_API_KEY)

        # Stable production model
        _model = genai.GenerativeModel("gemini-1.5-flash")

    return _model

# ======================================================
# AI Assistant Function
# ======================================================

def ask_ai(question: str, tender_text: str) -> str:
    prompt = f"""
You are an AI compliance assistant for the Bureau of Indian Standards (BIS).

Context:
The following text is extracted from a government tender document.

---------------- TENDER TEXT ----------------
{tender_text}
--------------------------------------------

Answer ONLY using the tender content.

If information is missing, reply:
"This information is not present in the uploaded tender."

Question:
{question}

Keep the answer concise, professional, and BIS-focused.
"""

    try:
        model = get_model()
        response = model.generate_content(prompt)

        if response.text:
            return response.text.strip()

        return "No response generated."

    except Exception as e:
        print(f"[Gemini Error] {e}")
        return f"Gemini Error: {str(e)}"