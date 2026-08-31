import pymupdf as fitz
import os

def extract_text_from_pdf(pdf_path):
    """
    Extract text from a digital PDF.
    """

    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"{pdf_path} not found")

    document = fitz.open(pdf_path)

    text = ""

    for page_number, page in enumerate(document, start=1):
        page_text = page.get_text()

        text += f"\n\n----- PAGE {page_number} -----\n"
        text += page_text

    document.close()

    return text


if __name__ == "__main__":

    import os

    pdf_file = "data/pdfs/LEDS_56819387-c569-470c-9dc21760098477633_tdo-kadi1.pdf"

    extracted_text = extract_text_from_pdf(pdf_file)

    # Create folder if it doesn't exist
    os.makedirs("data/extracted", exist_ok=True)

    output_path = "data/extracted/tender_text.txt"

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(extracted_text)

    print(f"✅ Tender text saved to {output_path}")
    print("\nPreview:\n")
    print(extracted_text[:500])