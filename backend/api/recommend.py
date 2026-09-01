from fastapi import APIRouter, HTTPException
from pathlib import Path
import traceback

from rag.recommender import recommend_standards
from api.validator import validate_document

router = APIRouter(
    prefix="/recommend",
    tags=["AI Recommendation Engine"]
)

# -------------------------------------------------------
# Project Root -> backend/uploads
# -------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"


@router.get("/")
def get_recommendations(filename: str):
    """
    AI-powered BIS Recommendation Endpoint

    Workflow:
    1. Check uploaded PDF exists.
    2. Check OCR text exists.
    3. Generate BIS recommendations.
    4. Merge compliance validation score.
    """

    pdf_path = UPLOAD_DIR / filename
    txt_path = UPLOAD_DIR / filename.replace(".pdf", ".txt")

    print("\n========== AI RECOMMENDATION ==========")
    print("Filename :", filename)
    print("PDF Path :", pdf_path)
    print("TXT Path :", txt_path)

    try:
        # -------------------------------
        # File Checks
        # -------------------------------
        if not pdf_path.exists():
            raise HTTPException(
                status_code=404,
                detail="Uploaded tender PDF not found."
            )

        if not txt_path.exists():
            raise HTTPException(
                status_code=404,
                detail="OCR text not found. Please run OCR first."
            )

        # -------------------------------
        # Recommendation Engine
        # -------------------------------
        recommendation = recommend_standards(filename)

        # -------------------------------
        # Validator Output
        # -------------------------------
        validation = validate_document(filename)

        response = {
            "status": "success",
            "filename": filename,
            "product_category": recommendation.get(
                "product_category",
                "Unknown Product"
            ),
            "recommended_standards": recommendation.get(
                "recommended_standards",
                []
            ),
            "total_recommendations": len(
                recommendation.get("recommended_standards", [])
            ),
            "compliance_score": validation.get("score", 0),
            "risk_level": validation.get("risk_level", "UNKNOWN"),
            "summary": validation.get("summary", "")
        }

        print("Recommendations:", response["total_recommendations"])
        print("Compliance Score:", response["compliance_score"])
        print("=======================================\n")

        return response

    except HTTPException:
        raise

    except Exception as e:
        print("\n========== RECOMMENDATION ERROR ==========")
        traceback.print_exc()
        print("==========================================\n")

        raise HTTPException(
            status_code=500,
            detail=f"Recommendation Engine Error: {str(e)}"
        )