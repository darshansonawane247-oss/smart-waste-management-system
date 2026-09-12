from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class NotificationResponse(BaseModel):
    id: int
    user_id: int
    role: Optional[str] = None
    title: str
    message: str
    report_id: Optional[int] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
