from pathlib import Path
from datetime import datetime

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.lib.units import inch

# ---------------------------------------------------
# Internal Modules
# ---------------------------------------------------
from rag.recommender import recommend_standards
from api.validator import validate_document

# ---------------------------------------------------
# Reports Folder
# ---------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
REPORT_DIR = BASE_DIR / "reports"
REPORT_DIR.mkdir(exist_ok=True)


# ---------------------------------------------------
# Generate BIS Compliance PDF Report
# ---------------------------------------------------
def generate_pdf(filename: str):
    """
    Generates a BIS Compliance Report PDF.

    Returns:
        str -> Path of generated PDF report.
    """

    # Fetch validator and recommendation results
    validation = validate_document(filename)
    recommendation = recommend_standards(filename)

    # Output file path
    output_path = REPORT_DIR / (
        filename.replace(".pdf", "") + "_Compliance_Report.pdf"
    )

    # PDF Document
    doc = SimpleDocTemplate(str(output_path))
    styles = getSampleStyleSheet()
    story = []

    # ---------------------------------------------------
    # Title
    # ---------------------------------------------------
    story.append(
        Paragraph(
            "<font size=20 color='green'><b>AI Powered BIS Compliance Report</b></font>",
            styles["Title"],
        )
    )

    story.append(
        Paragraph(
            "Smart India Hackathon 2026 — BIS AI Recommendation Engine",
            styles["Normal"],
        )
    )

    story.append(Spacer(1, 0.3 * inch))

    # ---------------------------------------------------
    # Tender Information
    # ---------------------------------------------------
    story.append(Paragraph("<b>Tender Information</b>", styles["Heading2"]))

    info_table = Table(
        [
            ["Tender File", filename],
            [
                "Generated On",
                datetime.now().strftime("%d-%m-%Y %H:%M:%S"),
            ],
        ],
        colWidths=[2.2 * inch, 4.3 * inch],
    )

    info_table.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 1, colors.grey),
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#E8F5E9")),
                ("FONTNAME", (0, 0), (-1, -1), "Helvetica-Bold"),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )

    story.append(info_table)
    story.append(Spacer(1, 0.3 * inch))

    # ---------------------------------------------------
    # Compliance Summary
    # ---------------------------------------------------
    story.append(Paragraph("<b>Compliance Summary</b>", styles["Heading2"]))

    summary_table = Table(
        [
            ["Compliance Score", f"{validation['score']} %"],
            ["Risk Level", validation["risk_level"]],
            [
                "Matched Clauses",
                f"{validation['matched_clauses']} / {validation['total_clauses']}",
            ],
        ],
        colWidths=[2.5 * inch, 3.5 * inch],
    )

    summary_table.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 1, colors.grey),
                ("BACKGROUND", (0, 0), (-1, 0), colors.lightgreen),
                ("FONTNAME", (0, 0), (-1, -1), "Helvetica-Bold"),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )

    story.append(summary_table)
    story.append(Spacer(1, 0.3 * inch))

    # ---------------------------------------------------
    # Missing BIS Clauses
    # ---------------------------------------------------
    story.append(Paragraph("<b>Missing BIS Clauses</b>", styles["Heading2"]))

    if validation["missing_clauses"]:

        missing_table = [["Clause", "Expected Value"]]

        for clause in validation["missing_clauses"]:
            missing_table.append(
                [clause["label"], clause["expected"]]
            )

        table = Table(
            missing_table,
            colWidths=[2.8 * inch, 3.2 * inch],
        )

        table.setStyle(
            TableStyle(
                [
                    ("GRID", (0, 0), (-1, -1), 1, colors.grey),
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#F44336")),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ]
            )
        )

        story.append(table)

    else:
        story.append(
            Paragraph(
                "<font color='green'><b>✓ All mandatory BIS clauses found.</b></font>",
                styles["Normal"],
            )
        )

    story.append(Spacer(1, 0.3 * inch))

    # ---------------------------------------------------
    # AI Recommended Standards
    # ---------------------------------------------------
    story.append(
        Paragraph(
            "<b>AI Recommended BIS Standards</b>",
            styles["Heading2"],
        )
    )

    standards = recommendation.get("recommended_standards", [])

    if standards:

        rec_table = [["BIS Standard", "Reason"]]

        for item in standards:
            rec_table.append(
                [
                    item.get("standard", "N/A"),
                    item.get("reason", "Relevant BIS recommendation"),
                ]
            )

        table = Table(
            rec_table,
            colWidths=[2.3 * inch, 3.7 * inch],
        )

        table.setStyle(
            TableStyle(
                [
                    ("GRID", (0, 0), (-1, -1), 1, colors.grey),
                    ("BACKGROUND", (0, 0), (-1, 0), colors.darkgreen),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ]
            )
        )

        story.append(table)

    else:
        story.append(
            Paragraph(
                "No additional BIS recommendations generated.",
                styles["Normal"],
            )
        )

    story.append(Spacer(1, 0.3 * inch))

    # ---------------------------------------------------
    # AI Summary
    # ---------------------------------------------------
    story.append(Paragraph("<b>AI Summary</b>", styles["Heading2"]))

    story.append(
        Paragraph(validation["summary"], styles["Normal"])
    )

    story.append(Spacer(1, 0.3 * inch))

    # ---------------------------------------------------
    # Footer
    # ---------------------------------------------------
    story.append(
        Paragraph(
            "<font color='grey'>"
            "Generated automatically by the AI Powered BIS Tender Compliance "
            "Engine (Smart India Hackathon 2026). This report identifies "
            "mandatory BIS compliance gaps and recommended BIS standards."
            "</font>",
            styles["Italic"],
        )
    )

    # ---------------------------------------------------
    # Build PDF
    # ---------------------------------------------------
    doc.build(story)

    # Return generated PDF path
    return str(output_path)