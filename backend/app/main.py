import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.database import engine, Base
from app.models import User, Dustbin, Report, Worker, Assignment, Notification
from app.routers import auth, reports, dustbins, workers, assignments, analytics, notifications, upload

# Create tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SWM — Smart Waste Management API",
    description="Nashik Municipal Solid Waste Command, Grievance Redressal & GIS Management API",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Uploads directory
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(os.path.join(settings.UPLOAD_DIR, "reports"), exist_ok=True)
os.makedirs(os.path.join(settings.UPLOAD_DIR, "completions"), exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)
app.include_router(dustbins.router, prefix=settings.API_V1_STR)
app.include_router(workers.router, prefix=settings.API_V1_STR)
app.include_router(assignments.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(notifications.router, prefix=settings.API_V1_STR)
app.include_router(upload.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": "SWM — Smart Waste Management Backend is running.",
        "docs": "/docs",
        "system": "Nashik Municipal Corporation Waste Redressal"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "swm-backend"}
