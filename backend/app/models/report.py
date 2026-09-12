from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    report_number = Column(String(50), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    photo_url = Column(String(500), nullable=True)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String(255), nullable=True)
    ward = Column(String(100), nullable=False, default="Panchavati")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    nearest_dustbin_id = Column(String(50), ForeignKey("dustbins.id", ondelete="SET NULL"), nullable=True)
    nearest_dustbin_distance = Column(Float, nullable=True) # in meters
    status = Column(String(50), default="PENDING", nullable=False) # PENDING, ASSIGNED, IN_PROGRESS, RESOLVED, REJECTED
    completion_photo_url = Column(String(500), nullable=True)
    completion_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    resolved_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="reports")
    nearest_dustbin = relationship("Dustbin", back_populates="reports")
    assignments = relationship("Assignment", back_populates="report", cascade="all, delete-orphan")
