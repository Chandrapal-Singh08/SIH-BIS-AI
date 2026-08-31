from ai.prompt_builder import build_prompt


def generate_ai_summary(report):
    """
    Generates an AI-style explanation from the compliance report.
    (Mock version for now. Later we'll replace with OpenAI/Gemini.)
    """

    # Prompt generated for future LLM use
    _ = build_prompt(report)

    missing_analysis = []

    for clause in report["missing_clauses"]:
        missing_analysis.append(
            f"{clause['label']} should specify {clause['expected']}."
        )

    return {
        "executive_summary": (
            f"The tender is for {report['product']} "
            f"under the {report['category']} category."
        ),
        "why_selected": (
            f"{report['recommended_standard']} was recommended because its "
            "technical specifications closely match the tender requirements."
        ),
        "compliance_status": report["summary"],
        "missing_clause_analysis": missing_analysis,
        "risk_assessment": report["risk_level"],
        "recommendation": (
            "Include the missing BIS clauses before publishing the tender "
            "to improve compliance and reduce procurement risk."
        ),
    }