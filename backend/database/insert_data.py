import pandas as pd
from sqlalchemy.orm import Session
from database.connection import SessionLocal
from database.models import Standard

# Read CSV
df = pd.read_csv("data/metadata/bis_standards.csv")

db: Session = SessionLocal()

inserted = 0
skipped = 0

for _, row in df.iterrows():

    existing = db.query(Standard).filter(
        Standard.is_number == row["is_number"]
    ).first()

    if existing:
        skipped += 1
        continue

    standard = Standard(
        is_number=row["is_number"],
        title=row["title"],
        department=row["department"],
        sector=row["sector"],
        status=row["status"],
        latest_revision=int(row["latest_revision"]),
        published_year=int(row["published_year"]),
        description=row["description"],
    )

    db.add(standard)
    inserted += 1

db.commit()
db.close()

print(f"Inserted: {inserted}")
print(f"Skipped (duplicates): {skipped}")