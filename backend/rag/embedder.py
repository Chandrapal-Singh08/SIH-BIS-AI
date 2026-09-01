"""
Lightweight embedder for Render Free Tier.

No SentenceTransformer model is loaded.
Uses simple keyword matching instead.
"""

def get_embedding(text: str):
    """Return lowercase text as a lightweight embedding placeholder."""
    return text.lower()


def cosine_similarity(text1: str, text2: str):
    """
    Lightweight similarity score based on keyword overlap.
    Returns value between 0 and 1.
    """
    words1 = set(text1.lower().split())
    words2 = set(text2.lower().split())

    if not words1 or not words2:
        return 0.0

    common = len(words1 & words2)
    total = len(words1 | words2)

    return common / total