from pathlib import Path
import json
import numpy as np

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# ---------------------------------------------------
# Load Sentence Transformer Model (Loads only once)
# ---------------------------------------------------

MODEL_NAME = "all-MiniLM-L6-v2"

model = SentenceTransformer(MODEL_NAME)

# ---------------------------------------------------
# Load BIS Knowledge Base
# ---------------------------------------------------

CLAUSE_FILE = Path("backend/ai/bis_clauses.json")

with open(CLAUSE_FILE, "r", encoding="utf-8") as file:
    BIS_CLAUSES = json.load(file)

# ---------------------------------------------------
# Generate Embeddings for BIS Clauses
# ---------------------------------------------------

CLAUSE_TEXT = [clause["description"] for clause in BIS_CLAUSES]

CLAUSE_EMBEDDINGS = model.encode(
    CLAUSE_TEXT,
    normalize_embeddings=True
)

# Similarity Threshold
SIMILARITY_THRESHOLD = 0.60


# ---------------------------------------------------
# Split OCR Text into Meaningful Sentences
# ---------------------------------------------------

def split_sentences(text: str):
    """
    Converts OCR text into meaningful sentences for AI matching.
    """

    cleaned = (
        text.replace("\n", ". ")
        .replace("  ", " ")
        .replace("•", ". ")
    )

    sentences = [
        sentence.strip()
        for sentence in cleaned.split(".")
        if len(sentence.strip()) > 10
    ]

    return sentences


# ---------------------------------------------------
# Semantic Clause Matching
# ---------------------------------------------------

def semantic_match(tender_text: str):
    """
    Compare Tender OCR text against BIS clauses using semantic similarity.
    """

    sentences = split_sentences(tender_text)

    if not sentences:
        return []

    sentence_embeddings = model.encode(
        sentences,
        normalize_embeddings=True
    )

    results = []

    for index, clause in enumerate(BIS_CLAUSES):

        similarity_scores = cosine_similarity(
            [CLAUSE_EMBEDDINGS[index]],
            sentence_embeddings
        )[0]

        best_index = int(np.argmax(similarity_scores))
        best_score = float(similarity_scores[best_index])

        status = (
            "COMPLIANT"
            if best_score >= SIMILARITY_THRESHOLD
            else "NON-COMPLIANT"
        )

        results.append({
            "label": clause["label"],
            "expected": clause["expected"],
            "bis_standard": clause["bis_standard"],
            "status": status,
            "similarity": round(best_score * 100, 2),
            "matched_sentence": sentences[best_index]
        })

    return results


# ---------------------------------------------------
# Compliance Score Helper
# ---------------------------------------------------

def calculate_compliance(results):
    """
    Calculate compliance score and risk level.
    """

    matched = [r for r in results if r["status"] == "COMPLIANT"]
    missing = [r for r in results if r["status"] == "NON-COMPLIANT"]

    score = round((len(matched) / len(results)) * 100)

    if score >= 90:
        risk = "LOW"
    elif score >= 70:
        risk = "MEDIUM"
    else:
        risk = "HIGH"

    return {
        "score": score,
        "risk_level": risk,
        "matched_clauses": len(matched),
        "total_clauses": len(results),
        "matched_details": matched,
        "missing_clauses": missing,
        "summary": (
            f"Tender satisfies {len(matched)} out of {len(results)} "
            f"mandatory BIS clauses. {len(missing)} clauses require attention."
        )
    }