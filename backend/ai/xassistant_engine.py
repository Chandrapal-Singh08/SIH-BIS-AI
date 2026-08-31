import os
from pathlib import Path
from dotenv import load_dotenv
import google.generativeai as genai

# -----------------------------------------------------
# Load Environment Variables
# -----------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in backend/.env")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

# Gemini 3.6 Flash
model = genai.GenerativeModel("gemini-3.6-flash")


# -----------------------------------------------------
# AI Assistant Function
# -----------------------------------------------------
def ask_ai(question: str, tender_text: str):
    """
    Answers user questions using the uploaded tender text.

    Args:
        question (str): User's question.
        tender_text (str): OCR extracted tender text.

    Returns:
        str: Gemini response.
    """

    prompt = f"""
You are an AI compliance assistant for the Bureau of Indian Standards (BIS).

Context:
The following text is extracted from a government tender document.

---------------- TENDER TEXT ----------------
{tender_text}
--------------------------------------------

Answer the user's question ONLY using the tender content.

If information is missing, clearly say:
'This information is not present in the uploaded tender.'

Question:
{question}

Provide a concise and professional answer.
"""

    try:
        response = model.generate_content(prompt)
        return response.text.strip()

    except Exception as e:
        return f"Gemini Error: {str(e)}"