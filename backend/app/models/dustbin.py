from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime
from sqlalchemy.orm import relationship
from app.database import Base

class Dustbin(Base):
    __tablename__ = "dustbins"

    id = Column(String(50), primary_key=True, index=True) # e.g. D-01, D-27
    name = Column(String(150), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    ward = Column(String(100), nullable=False)
    address = Column(String(255), nullable=True)
    capacity = Column(Integer, default=500) # liters
    status = Column(String(50), default="ACTIVE") # ACTIVE, OVERFLOWING, MAINTENANCE
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    reports = relationship("Report", back_populates="nearest_dustbin")
