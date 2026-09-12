from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.schemas.worker import WorkerResponse
from app.schemas.report import ReportResponse

class AssignmentCreate(BaseModel):
    report_id: int
    worker_id: int

class AssignmentStatusUpdate(BaseModel):
    status: str
    completion_photo_url: Optional[str] = None
    completion_notes: Optional[str] = None

class AssignmentResponse(BaseModel):
    id: int
    report_id: int
    worker_id: int
    assigned_by: Optional[int] = None
    status: str
    assigned_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    worker: Optional[WorkerResponse] = None
    report: Optional[ReportResponse] = None

    class Config:
        from_attributes = True
