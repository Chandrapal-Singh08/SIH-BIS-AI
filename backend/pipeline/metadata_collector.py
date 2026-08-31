import pandas as pd
import os

SOURCE_FILE = "data/metadata/bis_standards.csv"
OUTPUT_FILE = "data/extracted/latest_metadata.csv"

def collect_metadata():
    df = pd.read_csv(SOURCE_FILE)

    os.makedirs("data/extracted", exist_ok=True)

    df.to_csv(OUTPUT_FILE, index=False)

    print(f"Collected {len(df)} BIS standards.")
    print(f"Saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    collect_metadata()