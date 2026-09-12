from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.worker import Worker
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.auth.security import hash_password, verify_password, create_access_token
from app.auth.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered"
        )
    role = (user_in.role or "CITIZEN").upper()
    user = User(
        name=user_in.name,
        email=user_in.email.lower(),
        phone=user_in.phone,
        password_hash=hash_password(user_in.password),
        role=role,
        ward=user_in.ward or "Panchavati"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # If role is worker, create associated worker profile
    if role == "WORKER":
        worker_code = f"NMC-SAN-{100 + user.id}"
        worker = Worker(
            user_id=user.id,
            employee_id=worker_code,
            name=user.name,
            phone=user.phone,
            email=user.email,
            ward=user.ward or "Panchavati",
            status="AVAILABLE"
        )
        db.add(worker)
        db.commit()

    token = create_access_token(subject=user.id, role=user.role)
    return Token(access_token=token, token_type="bearer", user=user)

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email.lower()).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    token = create_access_token(subject=user.id, role=user.role)
    return Token(access_token=token, token_type="bearer", user=user)

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
