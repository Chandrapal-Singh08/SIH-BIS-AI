"""
Lightweight BIS clause matcher.
No SentenceTransformer required.
"""

def match_clause(text: str, keywords: list[str]):
    text = text.lower()
    return any(keyword.lower() in text for keyword in keywords)


def match_all_clauses(text: str, clauses: list[dict]):
    matched = []
    missing = []

    text = text.lower()

    for clause in clauses:
        if match_clause(text, clause["keywords"]):
            matched.append(clause)
        else:
            missing.append(clause)

    return matched, missing