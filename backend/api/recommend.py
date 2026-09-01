from fastapi import APIRouter, HTTPException
from app.config import UPLOAD_DIR
from rag.recommender import recommend_standards
from api.validator import validate_document
import traceback

router = APIRouter(
    prefix="/recommend",
    tags=["AI Recommendation Engine"],
)


@router.get("/")
def get_recommendations(filename: str):
    pdf_path = UPLOAD_DIR / filename
    txt_path = UPLOAD_DIR / filename.replace(".pdf", ".txt")

    print("\n========== RECOMMEND ==========")
    print("Filename :", filename)
    print("PDF Exists:", pdf_path.exists())
    print("TXT Exists:", txt_path.exists())

    try:
        if not pdf_path.exists():
            raise HTTPException(
                status_code=404,
                detail="Uploaded tender PDF not found.",
            )

        if not txt_path.exists():
            raise HTTPException(
                status_code=404,
                detail="OCR text not found.",
            )

        recommendation = recommend_standards(filename)
        validation = validate_document(filename)

        return {
            "status": "success",
            "filename": filename,
            "product_category": recommendation["product_category"],
            "recommended_standards": recommendation[
                "recommended_standards"
            ],
            "total_recommendations": len(
                recommendation["recommended_standards"]
            ),
            "compliance_score": validation["score"],
            "risk_level": validation["risk_level"],
            "summary": validation["summary"],
        }

    except HTTPException:
        raise

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )