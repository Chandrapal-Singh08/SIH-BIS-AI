from google import genai
from app.config import GEMINI_API_KEY

# ======================================================
# Gemini Client
# ======================================================

client = genai.Client(api_key=GEMINI_API_KEY)


# ======================================================
# AI Tender Summary
# ======================================================

def generate_tender_summary(tender_text: str):
    """
    Generate a structured AI summary of the uploaded tender.
    """

    try:
        prompt = f"""
You are an AI BIS Procurement Assistant for Smart India Hackathon 2026.

Analyze the following government tender and generate a professional summary.

Include these sections:

1. Product Category
2. Purpose of Tender
3. Mandatory BIS Standards Mentioned
4. Important Technical Specifications
5. Warranty Requirements
6. Compliance Risks
7. Overall Recommendation

Tender Text:
{tender_text[:12000]}
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return response.text

    except Exception as e:
        print("Gemini Summary Error:", e)
        return f"Gemini Error: {str(e)}"


# ======================================================
# AI Procurement Chat Assistant
# ======================================================

def ask_tender_question(tender_text: str, question: str):
    """
    Answer procurement questions only from uploaded tender.
    """

    try:
        prompt = f"""
You are an expert BIS Procurement Assistant.

Rules:
- Answer ONLY from the uploaded tender.
- If information is not present, say "Not mentioned in the tender."
- Keep answers concise and professional.

Tender:
{tender_text[:12000]}

Question:
{question}
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return response.text

    except Exception as e:
        print("Gemini Chat Error:", e)
        return f"Gemini Error: {str(e)}"