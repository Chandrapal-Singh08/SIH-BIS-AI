import json

from pipeline.product_identifier import identify_product
from rag.recommender import recommend_standards
from pipeline.clause_detector import detect_missing_clauses

# --------------------------------------------------
# Expected BIS Specification Rules
# --------------------------------------------------

EXPECTED_RULES = {
    "IS16102": {
        "ip_rating": "IP66",
        "wattage": "36W",
        "voltage": "140-270 VAC",
        "color_temperature": "6500K",
        "warranty": "2 Years"
    }
}


# --------------------------------------------------
# Tender Validator
# --------------------------------------------------

def validate_tender(tender_text: str):
    """
    Complete BIS Tender Validation Pipeline
    """

    # Step 1 — Identify Product
    product = identify_product(tender_text)

    # Step 2 — Recommend BIS Standards
    recommendations = recommend_standards(product)

    report = {
        "product": product.get("product_name"),
        "category": product.get("category"),
        "recommended_standard": None,
        "confidence": None,
        "checks": [],
        "passed_clauses": 0,
        "failed_clauses": 0,
        "missing_clauses": [],
        "summary": "",
        "score": 0
    }

    # No BIS recommendation found
    if not recommendations:
        report["summary"] = "No suitable BIS standard found for this tender."
        return report

    # Best Recommended Standard
    best = recommendations[0]
    report["recommended_standard"] = best["is_number"]
    report["confidence"] = best["confidence"]

    expected_specs = EXPECTED_RULES.get(best["is_number"], {})
    found_specs = product.get("specifications", {})

    passed = 0
    failed = 0

    # --------------------------------------------------
    # Specification Validation
    # --------------------------------------------------

    for field, expected_value in expected_specs.items():

        actual_value = found_specs.get(field)

        status = "PASS" if actual_value == expected_value else "FAIL"

        report["checks"].append({
            "field": field,
            "expected": expected_value,
            "found": actual_value if actual_value else "Not Found",
            "status": status
        })

        if status == "PASS":
            passed += 1
        else:
            failed += 1

    # --------------------------------------------------
    # Missing Clause Detection
    # --------------------------------------------------

    clause_results = detect_missing_clauses(tender_text)

    missing = []

    for clause in clause_results:
        if clause["status"] == "MISSING":
            missing.append({
                "label": clause["label"],
                "expected": clause["expected"]
            })
            
    report["missing_clauses"] = missing

    # --------------------------------------------------
    # Compliance Score
    # --------------------------------------------------

    total_checks = passed + failed

    report["passed_clauses"] = passed
    report["failed_clauses"] = failed

    report["score"] = (
        round((passed / total_checks) * 100, 2)
        if total_checks > 0 else 0
    )

    # --------------------------------------------------
    # Summary
    # --------------------------------------------------

    report["summary"] = (
        f"{passed} mandatory BIS specifications passed, "
        f"{failed} specification mismatches found, "
        f"{len(missing)} BIS clauses missing."
    )

    return report


# --------------------------------------------------
# Standalone Testing
# --------------------------------------------------

if __name__ == "__main__":

    with open("data/extracted/tender_text.txt", "r", encoding="utf-8") as file:
        tender_text = file.read()

    validation_report = validate_tender(tender_text)

    print("\n========== BIS COMPLIANCE REPORT ==========\n")
    print(json.dumps(validation_report, indent=4))