from fastapi import APIRouter, HTTPException
from pathlib import Path
import traceback

from rag.recommender import recommend_standards
from api.validator import validate_document

router = APIRouter(
    prefix="/recommend",
    tags=["AI Recommendation Engine"]
)

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"


@router.get("/")
def get_recommendations(filename: str):
    pdf_path = UPLOAD_DIR / filename
    txt_path = UPLOAD_DIR / filename.replace(".pdf", ".txt")

    print("\n========== AI RECOMMENDATION ==========")
    print("PDF:", pdf_path)
    print("TXT:", txt_path)

    if not pdf_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Uploaded tender PDF not found."
        )

    if not txt_path.exists():
        raise HTTPException(
            status_code=404,
            detail="OCR text not found."
        )

    try:
        recommendation = recommend_standards(filename)
        validation = validate_document(filename)

        return {
            "status": "success",
            "filename": filename,
            "product_category": recommendation["product_category"],
            "recommended_standards": recommendation["recommended_standards"],
            "total_recommendations": len(recommendation["recommended_standards"]),
            "compliance_score": validation["score"],
            "risk_level": validation["risk_level"],
            "summary": validation["summary"],
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(500, f"Recommendation Engine Error: {e}")