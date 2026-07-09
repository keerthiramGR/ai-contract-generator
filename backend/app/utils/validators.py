from fastapi import HTTPException, status
from typing import List

ALLOWED_LOGO_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}
ALLOWED_DOCUMENT_EXTENSIONS = {"pdf", "docx", "doc"}
ALLOWED_SIGNATURE_EXTENSIONS = {"png", "jpg", "jpeg"}

def validate_file_extension(filename: str, allowed_extensions: List[str]):
    """Validates that a uploaded file belongs to a list of allowed extensions."""
    parts = filename.split(".")
    ext = parts[-1].lower() if len(parts) > 1 else ""
    if ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file format. Allowed types: {', '.join(allowed_extensions)}"
        )
    return ext
