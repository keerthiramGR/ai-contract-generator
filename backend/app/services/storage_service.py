import os
import httpx
from app.core.config import settings
from app.core.logger import logger

class StorageService:
    @staticmethod
    async def upload_file(bucket: str, file_name: str, file_content: bytes) -> str:
        """Uploads file content to Supabase Storage, falling back to local files if keys are missing."""
        # Check if we should use local storage fallback
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY or "mock" in settings.SUPABASE_URL:
            local_path = os.path.join(settings.LOCAL_STORAGE_DIR, bucket, file_name)
            os.makedirs(os.path.dirname(local_path), exist_ok=True)
            with open(local_path, "wb") as f:
                f.write(file_content)
            logger.info(f"[LOCAL STORAGE] Uploaded file to: {local_path}")
            return f"/static/{bucket}/{file_name}"
            
        url = f"{settings.SUPABASE_URL}/storage/v1/object/{bucket}/{file_name}"
        headers = {
            "Authorization": f"Bearer {settings.SUPABASE_KEY}",
            "ApiKey": settings.SUPABASE_KEY,
            "Content-Type": "application/octet-stream"
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(url, content=file_content, headers=headers)
                if response.status_code in [200, 201]:
                    # Return public URL pattern
                    return f"{settings.SUPABASE_URL}/storage/v1/object/public/{bucket}/{file_name}"
                else:
                    logger.warning(f"Supabase upload returned {response.status_code}. Saving locally as fallback.")
            except Exception as e:
                logger.error(f"Error communicating with Supabase Storage: {str(e)}")
                
            # Secondary local fallback
            local_path = os.path.join(settings.LOCAL_STORAGE_DIR, bucket, file_name)
            os.makedirs(os.path.dirname(local_path), exist_ok=True)
            with open(local_path, "wb") as f:
                f.write(file_content)
            return f"/static/{bucket}/{file_name}"

    @staticmethod
    async def delete_file(bucket: str, file_name: str) -> bool:
        """Deletes a file from storage."""
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY or "mock" in settings.SUPABASE_URL:
            local_path = os.path.join(settings.LOCAL_STORAGE_DIR, bucket, file_name)
            if os.path.exists(local_path):
                os.remove(local_path)
                logger.info(f"[LOCAL STORAGE] Deleted file from: {local_path}")
                return True
            return False
            
        url = f"{settings.SUPABASE_URL}/storage/v1/object/{bucket}/{file_name}"
        headers = {
            "Authorization": f"Bearer {settings.SUPABASE_KEY}",
            "ApiKey": settings.SUPABASE_KEY
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.delete(url, headers=headers)
                return response.status_code == 200
            except Exception as e:
                logger.error(f"Failed to delete file from Supabase: {str(e)}")
                return False
