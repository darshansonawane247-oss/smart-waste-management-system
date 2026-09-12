from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr

class WorkerBase(BaseModel):
    employee_id: str
    name: str
    phone: Optional[str] = None
    email: EmailStr
    ward: str
    status: Optional[str] = "AVAILABLE"

class WorkerCreate(WorkerBase):
    user_id: Optional[int] = None

class WorkerUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    ward: Optional[str] = None
    status: Optional[str] = None

class WorkerResponse(WorkerBase):
    id: int
    user_id: Optional[int] = None
    created_at: datetime
    active_assignments_count: Optional[int] = 0

    class Config:
        from_attributes = True
