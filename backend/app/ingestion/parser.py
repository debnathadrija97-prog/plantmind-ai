import pdfplumber

def parse_pdf(filepath: str) -> list[dict]:
    """Returns list of {page_number, text}"""
    pages = []
    with pdfplumber.open(filepath) as pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text() or ""
            pages.append({"page_number": i + 1, "text": text})
    return pages