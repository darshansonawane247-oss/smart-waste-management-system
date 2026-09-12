from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel
from app.schemas.user import UserResponse
from app.schemas.dustbin import DustbinResponse

class ReportBase(BaseModel):
    category: str
    description: str
    location: Optional[str] = None
    ward: Optional[str] = "Panchavati"
    latitude: float
    longitude: float

class ReportCreate(ReportBase):
    photo_url: Optional[str] = None

class ReportStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None

class ReportResponse(ReportBase):
    id: int
    report_number: str
    user_id: int
    photo_url: Optional[str] = None
    nearest_dustbin_id: Optional[str] = None
    nearest_dustbin_distance: Optional[float] = None
    status: str
    completion_photo_url: Optional[str] = None
    completion_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime] = None

    user: Optional[UserResponse] = None
    nearest_dustbin: Optional[DustbinResponse] = None

    class Config:
        from_attributes = True
