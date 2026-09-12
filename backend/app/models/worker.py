from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Worker(Base):
    __tablename__ = "workers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    employee_id = Column(String(50), unique=True, index=True, nullable=False) # e.g. NMC-SAN-401
    name = Column(String(100), nullable=False)
    phone = Column(String(30), nullable=True)
    email = Column(String(150), unique=True, nullable=False)
    ward = Column(String(100), nullable=False)
    status = Column(String(50), default="AVAILABLE", nullable=False) # AVAILABLE, ASSIGNED, BUSY, OFFLINE
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="worker_profile")
    assignments = relationship("Assignment", back_populates="worker")
