import pandas as pd

from database.connection import SessionLocal
from database.models import Standard, UpdateLog
from pipeline.validator import compare_metadata

db = SessionLocal()

# Existing database records
old_df = pd.read_sql(db.query(Standard).statement, db.bind)

# Latest metadata collected
new_df = pd.read_csv("data/extracted/latest_metadata.csv")

report = compare_metadata(old_df, new_df)

print("\nBIS Synchronization Report")
print(report)

# Save synchronization history
log = UpdateLog(
    new_records=len(report["new"]),
    updated_records=len(report["updated"]),
    withdrawn_records=len(report["withdrawn"])
)

db.add(log)
db.commit()

print("\nSynchronization log saved.")