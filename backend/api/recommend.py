from fastapi import APIRouter, HTTPException
from pathlib import Path

from rag.recommender import recommend_standards
from api.validator import validate_document

router = APIRouter(
    prefix="/recommend",
    tags=["AI Recommendation Engine"]
)

# Project Root -> uploads/
BASE_DIR = Path(__file__).resolve().parent.parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"


@router.get("/")
def get_recommendations(filename: str):
    """
    Generate AI-powered BIS recommendations.
    """

    pdf_path = UPLOAD_DIR / filename
    txt_path = UPLOAD_DIR / filename.replace(".pdf", ".txt")

    print(f"[Recommendation] PDF: {pdf_path}")
    print(f"[Recommendation] TXT: {txt_path}")

    if not pdf_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Tender PDF not found: {pdf_path}"
        )

    if not txt_path.exists():
        raise HTTPException(
            status_code=404,
            detail="OCR text not found. Please extract OCR first."
        )

    recommendation = recommend_standards(filename)
    validation = validate_document(filename)

    return {
        "status": "success",
        "filename": filename,
        "product_category": recommendation.get(
            "product_category", "Unknown Product"
        ),
        "recommended_standards": recommendation.get(
            "recommended_standards", []
        ),
        "total_recommendations": len(
            recommendation.get("recommended_standards", [])
        ),
        "compliance_score": validation["score"],
        "risk_level": validation["risk_level"],
        "summary": validation["summary"],
    }