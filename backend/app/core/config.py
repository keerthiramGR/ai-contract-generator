import os
from typing import Optional
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8", 
        extra="ignore"
    )

    PROJECT_NAME: str = "ContractAI Backend"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "your-super-secret-random-key-change-this-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 11520 # 8 days

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./sql_app.db"

    # OpenAI API Settings
    OPENAI_API_KEY: Optional[str] = None

    # Supabase Storage Configurations
    SUPABASE_URL: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None
    SUPABASE_BUCKET_LOGOS: str = "company-logos"
    SUPABASE_BUCKET_TEMPLATES: str = "contract-templates"
    SUPABASE_BUCKET_CONTRACTS: str = "generated-contracts"
    SUPABASE_BUCKET_DOCUMENTS: str = "uploaded-documents"
    SUPABASE_BUCKET_SIGNATURES: str = "digital-signatures"
    SUPABASE_BUCKET_AVATARS: str = "avatars"

    # SMTP / FastAPI-Mail Settings
    MAIL_USERNAME: Optional[str] = None
    MAIL_PASSWORD: Optional[str] = None
    MAIL_FROM: str = "noreply@contractai.com"
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    USE_MOCK_EMAIL: bool = True

    # Local Storage Settings
    LOCAL_STORAGE_DIR: str = "./local_storage"

settings = Settings()

# Ensure local storage directories exist
os.makedirs(settings.LOCAL_STORAGE_DIR, exist_ok=True)
for bucket in [
    settings.SUPABASE_BUCKET_LOGOS,
    settings.SUPABASE_BUCKET_TEMPLATES,
    settings.SUPABASE_BUCKET_CONTRACTS,
    settings.SUPABASE_BUCKET_DOCUMENTS,
    settings.SUPABASE_BUCKET_SIGNATURES,
    settings.SUPABASE_BUCKET_AVATARS
]:
    os.makedirs(os.path.join(settings.LOCAL_STORAGE_DIR, bucket), exist_ok=True)
