import os
import pickle
import faiss
import numpy as np

from sqlalchemy.orm import Session

from database.connection import SessionLocal
from database.models import Standard
from rag.embedder import create_embedding

# Paths where FAISS index will be stored
INDEX_PATH = "data/extracted/bis_index.faiss"
METADATA_PATH = "data/extracted/bis_metadata.pkl"


def build_vector_store():
    db: Session = SessionLocal()

    standards = db.query(Standard).all()

    embeddings = []
    metadata = []

    print(f"Found {len(standards)} BIS standards.")

    for std in standards:

        text = f"""
        {std.is_number}
        {std.title}
        {std.department}
        {std.sector}
        {std.description}
        """

        vector = create_embedding(text)

        embeddings.append(vector.astype("float32"))

        metadata.append({
            "is_number": std.is_number,
            "title": std.title,
            "department": std.department,
            "sector": std.sector,
            "description": std.description,
        })

    embeddings = np.array(embeddings)

    dimension = embeddings.shape[1]

    index = faiss.IndexFlatL2(dimension)

    index.add(embeddings)

    os.makedirs("data/extracted", exist_ok=True)

    faiss.write_index(index, INDEX_PATH)

    with open(METADATA_PATH, "wb") as f:
        pickle.dump(metadata, f)

    print("Vector store created successfully.")
    print("Vectors stored:", index.ntotal)

    db.close()


if __name__ == "__main__":
    build_vector_store()