import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:Amruta%40123@localhost:5432/swm_db")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "swm_secret_super_secure_key_nashik_2026_x991823")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30  # 30 days
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads")
    API_V1_STR: str = "/api"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
