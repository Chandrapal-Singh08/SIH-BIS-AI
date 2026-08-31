from sqlalchemy import Column, Integer, String, Text
from database.connection import Base

# ------------------------------------------------------
# BIS Standards Table
# ------------------------------------------------------
class Standard(Base):
    __tablename__ = "standards"

    id = Column(Integer, primary_key=True, index=True)

    standard_number = Column(String(100), unique=True, nullable=False)

    title = Column(String(500), nullable=False)

    scope = Column(Text, nullable=False)

    product_category = Column(String(200), nullable=True)

    keywords = Column(Text, nullable=True)

    revision_year = Column(String(20), nullable=True)

    status = Column(String(50), default="ACTIVE")


# ------------------------------------------------------
# BIS Update Log Table
# ------------------------------------------------------
class UpdateLog(Base):
    __tablename__ = "update_logs"

    id = Column(Integer, primary_key=True, index=True)

    standard_number = Column(String(100), nullable=False)

    update_type = Column(String(100), nullable=False)

    description = Column(Text)

    update_date = Column(String(50))