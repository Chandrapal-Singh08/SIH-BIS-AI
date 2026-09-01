from google import genai
from app.config import GEMINI_API_KEY

# ======================================================
# Gemini Client
# ======================================================

client = genai.Client(api_key=GEMINI_API_KEY)


def generate_tender_summary(tender_text: str):
    """
    Generate AI summary for uploaded tender.
    """

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
            model="gemini-2.5-flash",
            contents=prompt,
        )

        return response.text

    except Exception as e:
        return f"Gemini Error: {str(e)}"


def procurement_chat(question: str, tender_text: str):
    """
    AI chat over uploaded tender.
    """

    if not GEMINI_API_KEY:
        return "Gemini API key not configured."

    prompt = f"""
You are an AI BIS Procurement Assistant.

Tender Context:
{tender_text}

User Question:
{question}

Answer using ONLY the tender context.
If information is missing, clearly say:
'This information is not present in the uploaded tender.'
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        return response.text

    except Exception as e:
        return f"Gemini Error: {str(e)}"