from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class DustbinBase(BaseModel):
    id: str
    name: str
    latitude: float
    longitude: float
    ward: str
    address: Optional[str] = None
    capacity: Optional[int] = 500
    status: Optional[str] = "ACTIVE"

class DustbinCreate(DustbinBase):
    pass

class DustbinResponse(DustbinBase):
    created_at: datetime

    class Config:
        from_attributes = True
