from fastapi import APIRouter, HTTPException
import traceback

from app.config import UPLOAD_DIR
from rag.recommender import recommend_standards
from api.validator import validate_document

router = APIRouter(
    prefix="/recommend",
    tags=["AI Recommendation Engine"]
)


@router.get("/")
def get_recommendations(filename: str):
    """
    AI-powered BIS Recommendation Endpoint.
    """

    pdf_path = UPLOAD_DIR / filename
    txt_path = UPLOAD_DIR / filename.replace(".pdf", ".txt")

    print("\n========== AI RECOMMENDATION ==========")
    print("Filename :", filename)
    print("PDF Path :", pdf_path)
    print("TXT Path :", txt_path)
    print("PDF Exists:", pdf_path.exists())
    print("TXT Exists:", txt_path.exists())

    try:
        # -------------------------------
        # Check Files
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
        print("[STEP 1] Running recommendation engine...")
        recommendation = recommend_standards(filename)
        print("[STEP 1] Success")

        # -------------------------------
        # Validator
        # -------------------------------
        print("[STEP 2] Fetching validation...")
        validation = validate_document(filename)
        print("[STEP 2] Success")

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

        print("[SUCCESS] Recommendation API Completed")
        return response

    except HTTPException:
        raise

    except Exception as e:
        print("\n========== RECOMMENDATION ERROR ==========")
        traceback.print_exc()
        print("=========================================\n")

        raise HTTPException(
            status_code=500,
            detail=f"Recommendation Engine Error: {str(e)}"
        )