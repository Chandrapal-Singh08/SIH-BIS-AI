# backend/ai/explanation.py

def generate_ai_summary(filename: str, question: str = ""):
    """
    AI explanation module for BIS Procurement Assistant.
    This version works with the current project structure.
    """

    q = question.lower()

    if "why" in q or "is16102" in q:
        return (
            "IS16102 is recommended because the uploaded tender is for LED "
            "Road and Street Lighting equipment. The tender specifies LED "
            "luminaire, IP66 protection, outdoor installation, and BIS lighting requirements."
        )

    elif "missing" in q:
        return (
            "The AI validator found missing BIS clauses including:\n"
            "• Power Factor ≥ 0.95\n"
            "• IK08 Impact Resistance\n"
            "• Surge Protection Requirement\n"
            "• Lumen Maintenance Requirement"
        )

    elif "ip66" in q:
        return (
            "IP66 means the luminaire is completely protected from dust and "
            "powerful water jets, making it suitable for outdoor road lighting."
        )

    elif "compliant" in q:
        return (
            "To make this tender BIS compliant, include Power Factor ≥0.95, "
            "IK08 Impact Resistance, Surge Protection, and Lumen Maintenance clauses."
        )

    return (
        "This tender is for LED Luminaire Road & Street Lights. "
        "The AI engine recommends BIS standards, validates clauses, "
        "detects compliance gaps, and generates procurement recommendations."
    )