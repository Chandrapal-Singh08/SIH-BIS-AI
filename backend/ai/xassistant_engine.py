from google import genai
from app.config import GEMINI_API_KEY

# ======================================================
# Gemini Client
# ======================================================

client = genai.Client(api_key=GEMINI_API_KEY)

MODEL_NAME = "gemini-2.5-flash"


# ======================================================
# Tender Summary
# ======================================================

def generate_tender_summary(tender_text: str):
    """Generate AI summary of uploaded tender."""

    if not GEMINI_API_KEY:
        return "Gemini API key not configured."

    if not tender_text.strip():
        return "Tender text is empty."

    prompt = f"""
You are a BIS Procurement Compliance Expert.

Analyze the following Indian Government Tender.

Provide:
1. Tender Summary
2. Product Category
3. Important BIS Clauses
4. Missing Compliance Points
5. Risk Level (LOW / MEDIUM / HIGH)

Tender:
{tender_text}
"""

    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
        )
        return response.text

    except Exception as e:
        return f"Gemini Error: {str(e)}"


# ======================================================
# Tender Question Answering
# ======================================================

def ask_tender_question(question: str, tender_text: str):
    """
    AI Assistant for answering questions about the uploaded tender.
    """

    if not GEMINI_API_KEY:
        return "Gemini API key not configured."

    if not tender_text.strip():
        return "Tender text is empty."

    prompt = f"""
You are an AI Compliance Assistant for the Bureau of Indian Standards (BIS).

Context:
The following text is extracted from an uploaded government tender.

---------------- TENDER TEXT ----------------
{tender_text}
--------------------------------------------

Answer ONLY using the tender content.

If the information is missing, reply exactly:
'This information is not present in the uploaded tender.'

Question:
{question}

Give a concise and professional answer.
"""

    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
        )
        return response.text

    except Exception as e:
        return f"Gemini Error: {str(e)}"