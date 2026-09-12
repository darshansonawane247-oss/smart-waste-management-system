from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.report import Report
from app.models.user import User
from app.models.dustbin import Dustbin
from app.models.worker import Worker
from app.models.assignment import Assignment
from app.models.notification import Notification
from app.schemas.report import ReportCreate, ReportResponse, ReportStatusUpdate
from app.auth.deps import get_current_user
from app.services.location_service import find_nearest_dustbin

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("", response_model=List[ReportResponse])
def get_reports(
    status: Optional[str] = None,
    category: Optional[str] = None,
    ward: Optional[str] = None,
    search: Optional[str] = None,
    user_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Report).order_by(Report.created_at.desc())

    if status and status.lower() != "all":
        query = query.filter(Report.status.ilike(status))
    if category and category.lower() != "all":
        query = query.filter(Report.category.ilike(category))
    if ward and ward.lower() != "all":
        query = query.filter(Report.ward.ilike(f"%{ward}%"))
    if user_id:
        query = query.filter(Report.user_id == user_id)
    if search:
        s = f"%{search}%"
        query = query.filter(
            (Report.report_number.ilike(s)) |
            (Report.description.ilike(s)) |
            (Report.location.ilike(s)) |
            (Report.category.ilike(s))
        )
    return query.all()

@router.get("/{report_id}", response_model=ReportResponse)
def get_report(report_id: int, db: Session = Depends(get_db)):
    rep = db.query(Report).filter(Report.id == report_id).first()
    if not rep:
        raise HTTPException(status_code=404, detail="Report not found")
    return rep

@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
def create_report(
    rep_in: ReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Sequential report number
    count = db.query(Report).count() + 101
    year = datetime.utcnow().year
    report_num = f"SWM-{year}-{str(count).zfill(5)}"

    # Nearest Dustbin Algorithm (Haversine)
    nearest_bin, distance_m = find_nearest_dustbin(rep_in.latitude, rep_in.longitude, db)

    report = Report(
        report_number=report_num,
        user_id=current_user.id,
        photo_url=rep_in.photo_url,
        category=rep_in.category,
        description=rep_in.description,
        location=rep_in.location or f"{rep_in.ward}, Nashik",
        ward=rep_in.ward or "Panchavati",
        latitude=rep_in.latitude,
        longitude=rep_in.longitude,
        nearest_dustbin_id=nearest_bin.id if nearest_bin else None,
        nearest_dustbin_distance=distance_m,
        status="PENDING"
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    # Notify all admins of new issue
    admins = db.query(User).filter(User.role == "ADMIN").all()
    for admin in admins:
        db.add(Notification(
            user_id=admin.id,
            role="ADMIN",
            title="New Waste Report Logged",
            message=f"Report {report.report_number} ({report.category}) reported at {report.location}.",
            report_id=report.id
        ))
    db.commit()

    return report

@router.put("/{report_id}/status", response_model=ReportResponse)
def update_report_status(
    report_id: int,
    status_update: ReportStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    old_status = report.status
    report.status = status_update.status.upper()
    if report.status == "RESOLVED":
        report.resolved_at = datetime.utcnow()
    elif old_status == "RESOLVED" and report.status != "RESOLVED":
        report.resolved_at = None

    if status_update.notes:
        report.completion_notes = status_update.notes

    # Notification to citizen
    db.add(Notification(
        user_id=report.user_id,
        role="CITIZEN",
        title=f"Report Status Updated: {report.status}",
        message=f"Your ticket {report.report_number} status changed to {report.status}.",
        report_id=report.id
    ))

    db.commit()
    db.refresh(report)
    return report
