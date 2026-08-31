from pipeline.validator import validate_tender


def generate_compliance_report(tender_text: str):
    """
    Generates structured compliance report.
    """

    report = validate_tender(tender_text)

    passed = report["passed_clauses"]
    failed = report["failed_clauses"]

    report["total_clauses"] = passed + failed

    report["risk_level"] = (
        "LOW"
        if len(report["missing_clauses"]) == 0
        else "MEDIUM"
        if len(report["missing_clauses"]) <= 2
        else "HIGH"
    )

    return report


if __name__ == "__main__":

    with open("data/extracted/tender_text.txt", encoding="utf-8") as f:
        tender = f.read()

    report = generate_compliance_report(tender)

    import json
    print(json.dumps(report, indent=4))
     