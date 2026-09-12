from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.assignment import Assignment
from app.models.report import Report
from app.models.worker import Worker
from app.models.user import User
from app.models.notification import Notification
from app.schemas.assignment import AssignmentCreate, AssignmentResponse, AssignmentStatusUpdate
from app.auth.deps import get_current_user

router = APIRouter(prefix="/assignments", tags=["Assignments"])

@router.get("", response_model=List[AssignmentResponse])
def get_assignments(worker_id: Optional[int] = None, status_filter: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Assignment).order_by(Assignment.assigned_at.desc())
    if worker_id:
        query = query.filter(Assignment.worker_id == worker_id)
    if status_filter and status_filter.lower() != "all":
        query = query.filter(Assignment.status.ilike(status_filter))
    return query.all()

@router.post("", response_model=AssignmentResponse, status_code=status.HTTP_201_CREATED)
def create_assignment(
    assign_in: AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    report = db.query(Report).filter(Report.id == assign_in.report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    worker = db.query(Worker).filter(Worker.id == assign_in.worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")

    # Create assignment
    assignment = Assignment(
        report_id=report.id,
        worker_id=worker.id,
        assigned_by=current_user.id,
        status="ASSIGNED",
        assigned_at=datetime.utcnow()
    )
    db.add(assignment)

    # Update report status to ASSIGNED
    report.status = "ASSIGNED"
    worker.status = "ASSIGNED"

    # Notification for worker
    if worker.user_id:
        db.add(Notification(
            user_id=worker.user_id,
            role="WORKER",
            title="New Assignment Received",
            message=f"You have been assigned ticket {report.report_number} at {report.location}.",
            report_id=report.id
        ))

    # Notification for citizen
    db.add(Notification(
        user_id=report.user_id,
        role="CITIZEN",
        title="Sanitary Worker Assigned",
        message=f"Field worker {worker.name} ({worker.phone or 'NMC Team'}) has been assigned to your report {report.report_number}.",
        report_id=report.id
    ))

    db.commit()
    db.refresh(assignment)
    return assignment

@router.put("/{assignment_id}/status", response_model=AssignmentResponse)
def update_assignment_status(
    assignment_id: int,
    status_in: AssignmentStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    new_status = status_in.status.upper()
    assignment.status = new_status
    report = db.query(Report).filter(Report.id == assignment.report_id).first()
    worker = db.query(Worker).filter(Worker.id == assignment.worker_id).first()

    if new_status == "IN_PROGRESS":
        assignment.started_at = datetime.utcnow()
        if report:
            report.status = "IN_PROGRESS"
        if worker:
            worker.status = "BUSY"
    elif new_status == "COMPLETED":
        assignment.completed_at = datetime.utcnow()
        if report:
            report.status = "RESOLVED"
            report.resolved_at = datetime.utcnow()
            if status_in.completion_photo_url:
                report.completion_photo_url = status_in.completion_photo_url
            if status_in.completion_notes:
                report.completion_notes = status_in.completion_notes
        if worker:
            worker.status = "AVAILABLE"

        # Notify citizen and admin
        if report:
            db.add(Notification(
                user_id=report.user_id,
                role="CITIZEN",
                title="Grievance Resolved Successfully",
                message=f"Your complaint {report.report_number} at {report.location} has been cleared and resolved.",
                report_id=report.id
            ))
        admins = db.query(User).filter(User.role == "ADMIN").all()
        for admin in admins:
            db.add(Notification(
                user_id=admin.id,
                role="ADMIN",
                title="Assignment Completed by Worker",
                message=f"Worker {worker.name if worker else ''} completed ticket {report.report_number if report else ''}.",
                report_id=report.id if report else None
            ))

    db.commit()
    db.refresh(assignment)
    return assignment
