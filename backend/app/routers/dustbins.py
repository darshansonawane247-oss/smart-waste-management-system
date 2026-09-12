from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.dustbin import Dustbin
from app.schemas.dustbin import DustbinCreate, DustbinResponse

router = APIRouter(prefix="/dustbins", tags=["Dustbins"])

@router.get("", response_model=List[DustbinResponse])
def get_dustbins(ward: str = None, status_filter: str = None, db: Session = Depends(get_db)):
    query = db.query(Dustbin)
    if ward and ward != "All":
        query = query.filter(Dustbin.ward.ilike(f"%{ward}%"))
    if status_filter and status_filter != "All":
        query = query.filter(Dustbin.status.ilike(f"%{status_filter}%"))
    return query.all()

@router.get("/{dustbin_id}", response_model=DustbinResponse)
def get_dustbin(dustbin_id: str, db: Session = Depends(get_db)):
    db_obj = db.query(Dustbin).filter(Dustbin.id == dustbin_id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Dustbin not found")
    return db_obj

@router.post("", response_model=DustbinResponse, status_code=status.HTTP_201_CREATED)
def create_dustbin(bin_in: DustbinCreate, db: Session = Depends(get_db)):
    existing = db.query(Dustbin).filter(Dustbin.id == bin_in.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Dustbin ID already exists")
    db_obj = Dustbin(**bin_in.dict())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
