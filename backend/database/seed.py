import json
from pathlib import Path

from database.connection import SessionLocal
from database.models import Standard

BASE_DIR = Path(__file__).resolve().parent
JSON_FILE = BASE_DIR / "bis_standards.json"


def seed_database():
    db = SessionLocal()

    try:
        with open(JSON_FILE, "r", encoding="utf-8") as file:
            standards = json.load(file)

        inserted = 0

        for item in standards:

            exists = (
                db.query(Standard)
                .filter(Standard.standard_number == item["standard_number"])
                .first()
            )

            if exists:
                continue

            standard = Standard(
                standard_number=item["standard_number"],
                title=item["title"],
                scope=item["scope"],
                product_category=item["product_category"],
                keywords=item["keywords"],
                revision_year=item["revision_year"],
                status="ACTIVE",
            )

            db.add(standard)
            inserted += 1

        db.commit()

        print(f"✅ Inserted {inserted} BIS standards.")

    except Exception as e:
        db.rollback()
        print("❌ Error:", e)

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()