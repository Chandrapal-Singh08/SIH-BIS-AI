import re
import json

# Product rules (can be expanded with hundreds of BIS products later)
PRODUCT_RULES = {
    "led luminaire": {
        "product_name": "LED Luminaire for Road and Street Lights",
        "category": "Street Lighting",
    },
    "pvc pipe": {
        "product_name": "PVC Pipe",
        "category": "Water Supply",
    },
    "cement": {
        "product_name": "Ordinary Portland Cement",
        "category": "Construction",
    },
}


def identify_product(text: str):
    result = {
        "product_name": None,
        "category": None,
        "specifications": {},
        "keywords": [],
    }

    lower = text.lower()

    # ---------------- Product Detection ----------------
    product_found = False

    for keyword, info in PRODUCT_RULES.items():
        if keyword in lower and not product_found:
            result["product_name"] = info["product_name"]
            result["category"] = info["category"]
            result["keywords"].append(keyword.upper())
            product_found = True

    # ---------------- Specifications Extraction ----------------

    # Wattage (36W, 120 W etc.)
    watt = re.search(r"(\d+)\s*W", text, re.IGNORECASE)
    if watt:
        result["specifications"]["wattage"] = f"{watt.group(1)}W"

    # IP Rating (IP66)
    ip = re.search(r"IP\s*(\d{2})", text, re.IGNORECASE)
    if ip:
        result["specifications"]["ip_rating"] = f"IP{ip.group(1)}"

    # Voltage Range (140 to 270 Volts)
    voltage = re.search(
        r"(\d+)\s*to\s*(\d+)\s*Volts",
        text,
        re.IGNORECASE | re.MULTILINE,
    )
    if voltage:
        result["specifications"]["voltage"] = (
            f"{voltage.group(1)}-{voltage.group(2)} VAC"
        )

    # Color Temperature (6500K)
    color = re.search(r"(\d{4})\s*K", text, re.IGNORECASE)
    if color:
        result["specifications"]["color_temperature"] = f"{color.group(1)}K"

    # Warranty (2 Year or More)
    warranty = re.search(r"(\d+)\s*Year", text, re.IGNORECASE)
    if warranty:
        result["specifications"]["warranty"] = f"{warranty.group(1)} Years"

    # Quantity (425 Nos.)
    qty = re.search(r"(\d+)\s*Nos", text, re.IGNORECASE)
    if qty:
        result["specifications"]["quantity"] = qty.group(1)

    # ---------------- Smart Keyword Extraction ----------------
    important_keywords = [
        "LED",
        "Luminaire",
        "Street",
        "Light",
        "IP66",
        "Voltage",
        "Warranty",
    ]

    for word in important_keywords:
        if word.lower() in lower and word not in result["keywords"]:
            result["keywords"].append(word)

    return result


if __name__ == "__main__":
    with open("data/extracted/tender_text.txt", "r", encoding="utf-8") as f:
        tender = f.read()

    output = identify_product(tender)

    print(json.dumps(output, indent=4))