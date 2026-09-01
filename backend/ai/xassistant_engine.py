import google.generativeai as genai
from app.config import GEMINI_API_KEY

# ======================================================
# Configure Gemini
# ======================================================

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Use the current supported model
MODEL_NAME = "gemini-2.5-flash"


def generate_tender_summary(tender_text: str):
    """
    Generate AI summary of uploaded tender.
    """

    if not GEMINI_API_KEY:
        return "Gemini API key is not configured."

    if not tender_text.strip():
        return "Tender text is empty."

    prompt = f"""
You are a BIS Procurement Expert.

Analyze the following Indian Government Tender.

Provide:
1. Tender Summary.
2. Product Category.
3. Important BIS Clauses.
4. Missing Compliance Points.
5. Risk Level (LOW / MEDIUM / HIGH).

Tender:
{tender_text}
"""

    try:
        model = genai.GenerativeModel(MODEL_NAME)
        response = model.generate_content(prompt)

        if response.text:
            return response.text

        return "No response generated."

    except Exception as e:
        return f"Gemini Error: {str(e)}"


def procurement_chat(question: str, tender_text: str):
    """
    Chat with uploaded tender.
    """

    if not GEMINI_API_KEY:
        return "Gemini API key is not configured."

    prompt = f"""
You are an AI BIS Procurement Assistant.

Tender Context:
{tender_text}

User Question:
{question}

Answer in simple English with BIS compliance guidance.
"""

    try:
        model = genai.GenerativeModel(MODEL_NAME)
        response = model.generate_content(prompt)

        if response.text:
            return response.text

        return "No answer generated."

    except Exception as e:
        return f"Gemini Error: {str(e)}"