from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_

from database.connection import get_db
from database.models import Standard
from database.schema import StandardResponse

router = APIRouter(
    prefix="/standards",
    tags=["BIS Standards"]
)


# Get all BIS standards
@router.get("/", response_model=list[StandardResponse])
def get_all_standards(db: Session = Depends(get_db)):
    return db.query(Standard).all()


# Search BIS standards
@router.get("/search", response_model=list[StandardResponse])
def search_standards(query: str, db: Session = Depends(get_db)):
    results = db.query(Standard).filter(
        or_(
            Standard.is_number.ilike(f"%{query}%"),
            Standard.title.ilike(f"%{query}%"),
            Standard.department.ilike(f"%{query}%"),
            Standard.sector.ilike(f"%{query}%")
        )
    ).all()

    return results