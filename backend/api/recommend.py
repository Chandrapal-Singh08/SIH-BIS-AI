from fastapi import APIRouter, HTTPException
from app.config import UPLOAD_DIR
from rag.recommender import recommend_standards
from api.validator import validate_document
import traceback

router = APIRouter(
    prefix="/recommend",
    tags=["AI Recommendation Engine"]
)

# ======================================================
# AI Recommendation Endpoint
# ======================================================

@router.get("/")
def get_recommendations(filename: str):
    """
    Generate AI-powered BIS recommendations.

    Workflow
    --------
    1. Verify uploaded PDF exists.
    2. Verify OCR text exists.
    3. Generate BIS recommendations using RAG.
    4. Merge compliance score from validator.
    """

    pdf_path = UPLOAD_DIR / filename
    txt_path = UPLOAD_DIR / filename.replace(".pdf", ".txt")

    print("\n========== AI RECOMMENDATION ==========")
    print("Filename :", filename)
    print("PDF Path :", pdf_path)
    print("PDF Exists:", pdf_path.exists())
    print("TXT Path :", txt_path)
    print("TXT Exists:", txt_path.exists())

    try:
        # --------------------------------------------------
        # Check uploaded PDF
        # --------------------------------------------------
        if not pdf_path.exists():
            raise HTTPException(
                status_code=404,
                detail="Uploaded tender PDF not found."
            )

        # --------------------------------------------------
        # Check OCR text
        # --------------------------------------------------
        if not txt_path.exists():
            raise HTTPException(
                status_code=404,
                detail="OCR text not found. Please extract OCR first."
            )

        # --------------------------------------------------
        # AI Recommendation Engine
        # --------------------------------------------------
        recommendation = recommend_standards(filename)

        # --------------------------------------------------
        # Validator Output
        # --------------------------------------------------
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
            "summary": validation.get("summary", ""),
        }

        print("Recommendations :", response["total_recommendations"])
        print("Compliance Score :", response["compliance_score"])
        print("======================================\n")

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