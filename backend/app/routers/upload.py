import os
import uuid
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.config import settings

router = APIRouter(prefix="/upload", tags=["File Upload"])

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

@router.post("")
async def upload_file(file: UploadFile = File(...), folder: str = "reports"):
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type {file.content_type}. Only JPG, PNG, and WEBP are allowed."
        )

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
        ext = ".jpg"

    safe_folder = "completions" if folder == "completions" else "reports"
    target_dir = os.path.join(settings.UPLOAD_DIR, safe_folder)
    os.makedirs(target_dir, exist_ok=True)

    unique_name = f"{uuid.uuid4().hex}{ext}"
    target_path = os.path.join(target_dir, unique_name)

    # Read and validate size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds 10MB limit."
        )

    with open(target_path, "wb") as f:
        f.write(contents)

    relative_url = f"/uploads/{safe_folder}/{unique_name}"
    return {
        "url": relative_url,
        "filename": unique_name,
        "content_type": file.content_type,
        "size": len(contents)
    }
