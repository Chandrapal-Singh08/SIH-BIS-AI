import re

# ------------------------------------
# BIS Clause Knowledge Base (IS16102)
# ------------------------------------

LED_BIS_CLAUSES = [
    {
        "field": "ip_rating",
        "label": "Ingress Protection",
        "expected": "IP66",
        "patterns": [r"IP\s*66"]
    },
    {
        "field": "voltage",
        "label": "Operating Voltage",
        "expected": "140-270 VAC",
        "patterns": [
            r"140\s*to\s*270\s*Volts",
            r"140-270"
        ]
    },
    {
        "field": "wattage",
        "label": "Rated Wattage",
        "expected": "36W",
        "patterns": [r"36\s*W"]
    },
    {
        "field": "color_temperature",
        "label": "Color Temperature",
        "expected": "6500K",
        "patterns": [r"6500\s*K"]
    },
    {
        "field": "warranty",
        "label": "Warranty",
        "expected": "2 Years",
        "patterns": [r"2\s*Year"]
    },

    # Missing Clause Detection

    {
        "field": "power_factor",
        "label": "Power Factor",
        "expected": ">=0.95",
        "patterns": [
            r"Power\s*Factor",
            r"PF\s*0\.95"
        ]
    },
    {
        "field": "surge_protection",
        "label": "Surge Protection",
        "expected": "10kV",
        "patterns": [
            r"10\s*kV",
            r"Surge\s*Protection"
        ]
    },
    {
        "field": "cri",
        "label": "Color Rendering Index",
        "expected": ">=70",
        "patterns": [
            r"CRI",
            r"Color Rendering Index"
        ]
    },
    {
        "field": "thd",
        "label": "Total Harmonic Distortion",
        "expected": "<=10%",
        "patterns": [
            r"THD",
            r"Harmonic Distortion"
        ]
    },
    {
        "field": "ik_rating",
        "label": "Impact Resistance Rating",
        "expected": "IK08",
        "patterns": [
            r"IK08",
            r"IK\s*08"
        ]
    }
]


def detect_missing_clauses(tender_text: str):

    report = []

    for clause in LED_BIS_CLAUSES:

        found = False

        for pattern in clause["patterns"]:
            if re.search(pattern, tender_text, re.IGNORECASE):
                found = True
                break

        report.append({
            "field": clause["field"],
            "label": clause["label"],
            "expected": clause["expected"],
            "status": "PASS" if found else "MISSING"
        })

    return report


# ------------------------------
# Standalone Testing
# ------------------------------

if __name__ == "__main__":

    with open("data/extracted/tender_text.txt", encoding="utf-8") as f:
        tender = f.read()

    results = detect_missing_clauses(tender)

    print("\n===== Missing Clause Detector =====\n")

    for item in results:
        emoji = "✅" if item["status"] == "PASS" else "❌"

        print(
            f"{emoji} {item['label']} "
            f"({item['expected']}) --> {item['status']}"
        )