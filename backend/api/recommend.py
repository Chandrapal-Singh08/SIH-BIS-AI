from fastapi import APIRouter, HTTPException
from pathlib import Path
import traceback

from rag.recommender import recommend_standards
from api.validator import validate_document

router = APIRouter(
    prefix="/recommend",
    tags=["AI Recommendation Engine"]
)

BASE_DIR = Path(__file__).resolve().parent.parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"


@router.get("/")
def get_recommendations(filename: str):
    """
    AI-powered BIS recommendation endpoint.
    """

    try:
        pdf_path = UPLOAD_DIR / filename
        txt_path = UPLOAD_DIR / filename.replace(".pdf", ".txt")

        print(f"[Recommendation] PDF: {pdf_path}")
        print(f"[Recommendation] TXT: {txt_path}")

        if not pdf_path.exists():
            raise HTTPException(
                status_code=404,
                detail="Tender PDF not found."
            )

        if not txt_path.exists():
            raise HTTPException(
                status_code=404,
                detail="OCR text not found. Run OCR first."
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
            "compliance_score": validation.get("score", 0),
            "risk_level": validation.get("risk_level", "UNKNOWN"),
            "summary": validation.get("summary", ""),
        }

    except HTTPException:
        raise

    except Exception as e:
        print("=" * 60)
        print("[Recommendation Error]")
        print(traceback.format_exc())
        print("=" * 60)

        raise HTTPException(
            status_code=500,
            detail=f"Recommendation Engine Error: {str(e)}"
        )