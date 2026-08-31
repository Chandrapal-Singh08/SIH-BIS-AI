from pydantic import BaseModel
from typing import Optional

# ------------------------------------------------------
# BIS Standard Response Schema
# ------------------------------------------------------
class StandardResponse(BaseModel):
    id: int
    standard_number: str
    title: str
    scope: str
    product_category: Optional[str]
    keywords: Optional[str]
    revision_year: Optional[str]
    status: Optional[str]

    class Config:
        from_attributes = True


# ------------------------------------------------------
# BIS Standard Create Schema
# ------------------------------------------------------
class StandardCreate(BaseModel):
    standard_number: str
    title: str
    scope: str
    product_category: Optional[str] = None
    keywords: Optional[str] = None
    revision_year: Optional[str] = None


# ------------------------------------------------------
# Update Log Response
# ------------------------------------------------------
class UpdateLogResponse(BaseModel):
    id: int
    standard_number: str
    update_type: str
    description: Optional[str]
    update_date: Optional[str]

    class Config:
        from_attributes = True