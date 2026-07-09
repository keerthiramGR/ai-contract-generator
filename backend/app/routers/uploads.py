from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from app.services.storage_service import StorageService
from app.core.auth import get_current_user
from app.models.profile import Profile
import uuid

router = APIRouter(prefix="/uploads", tags=["Uploads"])

@router.post("")
async def upload_file(
    bucket: str = Form(..., description="Target storage bucket (e.g. company-logos, digital-signatures)"),
    file: UploadFile = File(...),
    current_user: Profile = Depends(get_current_user)
):
    """Uploads file content to storage buckets, returning the accessible URL path."""
    content = await file.read()
    
    # Extract extension and assign unique identifier filename
    filename = file.filename or "file"
    parts = filename.split(".")
    ext = parts[-1] if len(parts) > 1 else "bin"
    unique_filename = f"{uuid.uuid4()}.{ext}"
    
    url = await StorageService.upload_file(bucket, unique_filename, content)
    return {
        "file_name": filename,
        "unique_name": unique_filename,
        "url": url,
        "bucket": bucket
    }
