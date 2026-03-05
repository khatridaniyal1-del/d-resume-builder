"""Parser service — extract text from uploaded PDF/DOCX files."""

from io import BytesIO


async def parse_pdf(file_bytes: bytes) -> str:
    """Extract text content from a PDF file.

    Args:
        file_bytes: Raw bytes of the uploaded PDF.

    Returns:
        Extracted plain text.
    """
    # TODO: Implement with pdfplumber
    # import pdfplumber
    # with pdfplumber.open(BytesIO(file_bytes)) as pdf:
    #     return "\n".join(page.extract_text() or "" for page in pdf.pages)
    return "[PDF parsing not yet implemented]"


async def parse_docx(file_bytes: bytes) -> str:
    """Extract text content from a DOCX file.

    Args:
        file_bytes: Raw bytes of the uploaded DOCX.

    Returns:
        Extracted plain text.
    """
    # TODO: Implement with python-docx
    # from docx import Document
    # doc = Document(BytesIO(file_bytes))
    # return "\n".join(p.text for p in doc.paragraphs)
    return "[DOCX parsing not yet implemented]"
