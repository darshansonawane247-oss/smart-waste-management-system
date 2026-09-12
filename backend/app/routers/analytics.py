from datetime import datetime
from collections import Counter
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.report import Report
from app.schemas.analytics import DashboardStats

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    reports = db.query(Report).all()
    total = len(reports)
    pending = sum(1 for r in reports if r.status.upper() == "PENDING")
    assigned = sum(1 for r in reports if r.status.upper() == "ASSIGNED")
    in_progress = sum(1 for r in reports if r.status.upper() in ["IN_PROGRESS", "ASSIGNED"])
    completed = sum(1 for r in reports if r.status.upper() == "RESOLVED")

    cat_counts = Counter(r.category for r in reports)
    area_counts = Counter(r.ward for r in reports)

    # Average resolution time in hours
    resolved_reports = [r for r in reports if r.status.upper() == "RESOLVED" and r.resolved_at and r.created_at]
    if resolved_reports:
        total_hours = sum((r.resolved_at - r.created_at).total_seconds() / 3600.0 for r in resolved_reports)
        avg_res = round(total_hours / len(resolved_reports), 1)
    else:
        avg_res = 3.5

    return DashboardStats(
        total=total,
        pending=pending,
        assigned=assigned,
        in_progress=in_progress,
        completed=completed,
        categoryCounts=dict(cat_counts),
        areaCounts=dict(area_counts),
        avgResolutionTimeHours=avg_res
    )
