from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.worker import Worker
from app.models.assignment import Assignment
from app.schemas.worker import WorkerCreate, WorkerUpdate, WorkerResponse

router = APIRouter(prefix="/workers", tags=["Workers"])

@router.get("", response_model=List[WorkerResponse])
def get_workers(ward: str = None, status_filter: str = None, db: Session = Depends(get_db)):
    query = db.query(Worker)
    if ward and ward != "All":
        query = query.filter(Worker.ward.ilike(f"%{ward}%"))
    if status_filter and status_filter != "All":
        query = query.filter(Worker.status.ilike(status_filter))
    
    workers = query.all()
    result = []
    for w in workers:
        active_count = db.query(Assignment).filter(
            Assignment.worker_id == w.id,
            Assignment.status.in_(["ASSIGNED", "ACCEPTED", "IN_PROGRESS"])
        ).count()
        w_dict = {
            "id": w.id,
            "user_id": w.user_id,
            "employee_id": w.employee_id,
            "name": w.name,
            "phone": w.phone,
            "email": w.email,
            "ward": w.ward,
            "status": w.status,
            "created_at": w.created_at,
            "active_assignments_count": active_count
        }
        result.append(w_dict)
    return result

@router.get("/{worker_id}", response_model=WorkerResponse)
def get_worker(worker_id: int, db: Session = Depends(get_db)):
    w = db.query(Worker).filter(Worker.id == worker_id).first()
    if not w:
        raise HTTPException(status_code=404, detail="Worker not found")
    active_count = db.query(Assignment).filter(
        Assignment.worker_id == w.id,
        Assignment.status.in_(["ASSIGNED", "ACCEPTED", "IN_PROGRESS"])
    ).count()
    return {
        "id": w.id,
        "user_id": w.user_id,
        "employee_id": w.employee_id,
        "name": w.name,
        "phone": w.phone,
        "email": w.email,
        "ward": w.ward,
        "status": w.status,
        "created_at": w.created_at,
        "active_assignments_count": active_count
    }

@router.post("", response_model=WorkerResponse, status_code=status.HTTP_201_CREATED)
def create_worker(worker_in: WorkerCreate, db: Session = Depends(get_db)):
    existing = db.query(Worker).filter(Worker.employee_id == worker_in.employee_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Employee ID already registered")
    w = Worker(**worker_in.dict())
    db.add(w)
    db.commit()
    db.refresh(w)
    return {
        "id": w.id,
        "user_id": w.user_id,
        "employee_id": w.employee_id,
        "name": w.name,
        "phone": w.phone,
        "email": w.email,
        "ward": w.ward,
        "status": w.status,
        "created_at": w.created_at,
        "active_assignments_count": 0
    }
