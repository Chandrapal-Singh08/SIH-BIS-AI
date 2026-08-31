def build_prompt(report):
    """Builds a prompt for the AI compliance assistant."""

    checks = "\n".join(
        [f"- {c['field']}: {c['status']}" for c in report["checks"]]
    )

    if report["missing_clauses"]:
        missing = "\n".join(
            [
                f"- {c['label']} (Expected: {c['expected']})"
                for c in report["missing_clauses"]
            ]
        )
    else:
        missing = "None"

    prompt = f"""
You are an AI BIS Procurement Compliance Assistant.

Tender Product:
{report['product']}

Category:
{report['category']}

Recommended BIS Standard:
{report['recommended_standard']}

Compliance Score:
{report['score']}%

AI Confidence:
{report['confidence']}%

Validated Specifications:
{checks}

Missing BIS Clauses:
{missing}

Generate:
1. Executive Summary
2. Why this BIS standard was selected.
3. Compliance Status.
4. Missing Clauses and their impact.
5. Procurement Recommendation.
6. Risk Assessment.
"""

    return prompt