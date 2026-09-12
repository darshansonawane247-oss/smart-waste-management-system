import sys
import os
from datetime import datetime, timedelta

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.dustbin import Dustbin
from app.models.report import Report
from app.models.worker import Worker
from app.models.assignment import Assignment
from app.models.notification import Notification
from app.auth.security import hash_password
from app.services.location_service import find_nearest_dustbin

def seed():
    print("Creating tables in PostgreSQL...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(User).count() > 0:
            print("Database already contains data. Clearing old data for clean seed...")
            db.query(Notification).delete()
            db.query(Assignment).delete()
            db.query(Report).delete()
            db.query(Worker).delete()
            db.query(Dustbin).delete()
            db.query(User).delete()
            db.commit()

        print("Seeding Users...")
        admin_user = User(
            name="Admin Officer Patil",
            email="admin@nashik-swm.gov.in",
            phone="+91 253 257 0001",
            password_hash=hash_password("password123"),
            role="ADMIN",
            ward="NMC Central HQ"
        )
        worker_user = User(
            name="Ramesh Shinde",
            email="ramesh@swm.org",
            phone="+91 98220 11223",
            password_hash=hash_password("password123"),
            role="WORKER",
            ward="CIDCO"
        )
        citizen_user = User(
            name="Aarav Deshmukh",
            email="aarav.deshmukh@gmail.com",
            phone="+91 98221 44556",
            password_hash=hash_password("password123"),
            role="CITIZEN",
            ward="Gangapur Road"
        )
        db.add_all([admin_user, worker_user, citizen_user])
        db.commit()
        db.refresh(admin_user)
        db.refresh(worker_user)
        db.refresh(citizen_user)

        print("Seeding Dustbins across Nashik Wards...")
        dustbins = [
            Dustbin(id="D-01", name="Panchavati Ramkund Public Bin", latitude=20.0076, longitude=73.7915, ward="Panchavati", address="Ramkund Ghat Road", capacity=800, status="ACTIVE"),
            Dustbin(id="D-02", name="Kalaram Mandir North Gate", latitude=20.0102, longitude=73.7938, ward="Panchavati", address="Opp. Kalaram Temple", capacity=500, status="ACTIVE"),
            Dustbin(id="D-03", name="College Road Circle Bin", latitude=20.0084, longitude=73.7638, ward="College Road", address="Near BYK College Chowk", capacity=1000, status="ACTIVE"),
            Dustbin(id="D-04", name="Gangapur Road Jogging Track", latitude=20.0142, longitude=73.7540, ward="Gangapur Road", address="Anandwalli Riverfront Road", capacity=600, status="ACTIVE"),
            Dustbin(id="D-05", name="CIDCO Pawan Nagar Junction", latitude=19.9825, longitude=73.7482, ward="CIDCO", address="Pawan Nagar Main Market", capacity=1200, status="ACTIVE"),
            Dustbin(id="D-06", name="CIDCO Trimurti Chowk Compactor", latitude=19.9740, longitude=73.7521, ward="CIDCO", address="Trimurti Chowk Ring Road", capacity=1500, status="ACTIVE"),
            Dustbin(id="D-07", name="Satpur MIDC Road 12 Station", latitude=19.9890, longitude=73.7225, ward="Satpur", address="Near NICE Industrial Area", capacity=1000, status="ACTIVE"),
            Dustbin(id="D-08", name="Satpur Ashok Nagar Community Bin", latitude=19.9972, longitude=73.7314, ward="Satpur", address="Ashok Nagar Colony Gate", capacity=500, status="ACTIVE"),
            Dustbin(id="D-09", name="Nashik Road Railway Stn East", latitude=19.9575, longitude=73.8340, ward="Nashik Road", address="Station Complex East Gate", capacity=1200, status="ACTIVE"),
            Dustbin(id="D-10", name="Muktidham Temple Corner", latitude=19.9535, longitude=73.8398, ward="Nashik Road", address="Near Muktidham Pilgrims Way", capacity=750, status="ACTIVE"),
            Dustbin(id="D-11", name="Mahatma Nagar Playground Bin", latitude=20.0028, longitude=73.7610, ward="College Road", address="Mahatma Nagar Sports Complex", capacity=500, status="ACTIVE"),
            Dustbin(id="D-12", name="Panchavati Market Yard Secondary", latitude=20.0150, longitude=73.7880, ward="Panchavati", address="APMC Market Outer Perimeter", capacity=1500, status="OVERFLOWING")
        ]
        db.add_all(dustbins)
        db.commit()

        print("Seeding Workers...")
        workers = [
            Worker(user_id=worker_user.id, employee_id="NMC-SAN-401", name="Ramesh Shinde", phone="+91 98220 11223", email="ramesh@swm.org", ward="CIDCO", status="ASSIGNED"),
            Worker(employee_id="NMC-SAN-402", name="Suresh Jadhav", phone="+91 98220 33445", email="suresh.j@swm.org", ward="Panchavati", status="AVAILABLE"),
            Worker(employee_id="NMC-SAN-403", name="Mahesh Bhalerao", phone="+91 98220 55667", email="mahesh.b@swm.org", ward="Gangapur Road", status="AVAILABLE"),
            Worker(employee_id="NMC-SAN-404", name="Ganesh More", phone="+91 98220 77889", email="ganesh.m@swm.org", ward="College Road", status="BUSY"),
            Worker(employee_id="NMC-SAN-405", name="Kailash Gaikwad", phone="+91 98220 99001", email="kailash.g@swm.org", ward="Satpur", status="AVAILABLE"),
            Worker(employee_id="NMC-SAN-406", name="Dattatray Wagh", phone="+91 98221 11224", email="dattatray.w@swm.org", ward="Nashik Road", status="AVAILABLE")
        ]
        db.add_all(workers)
        db.commit()

        # Re-query workers for assignment IDs
        worker_list = db.query(Worker).all()
        w_ramesh = next(w for w in worker_list if w.employee_id == "NMC-SAN-401")
        w_ganesh = next(w for w in worker_list if w.employee_id == "NMC-SAN-404")

        print("Seeding Reports with Automatic Haversine Nearest Dustbin Calculation...")
        sample_reports_data = [
            {
                "num": "SWM-2026-00101",
                "category": "Overflowing Dustbin",
                "desc": "Pawan Nagar commercial square public bin overflowing since yesterday evening. Stray dogs scattering litter.",
                "loc": "Pawan Nagar Chowk, CIDCO",
                "ward": "CIDCO",
                "lat": 19.9830,
                "lng": 73.7489,
                "status": "ASSIGNED",
                "photo": "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80",
                "hours_ago": 12
            },
            {
                "num": "SWM-2026-00102",
                "category": "Roadside Garbage",
                "desc": "Heavy domestic waste dumped beside walkway near BYK college compound wall.",
                "loc": "College Road, near BYK Circle",
                "ward": "College Road",
                "lat": 20.0090,
                "lng": 73.7645,
                "status": "IN_PROGRESS",
                "photo": "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80",
                "hours_ago": 8
            },
            {
                "num": "SWM-2026-00103",
                "category": "Construction Waste",
                "desc": "Bricks, concrete debris, and cement sacks dumped on public footpath blocking pedestrians.",
                "loc": "Anandwalli Main Road, Gangapur Road",
                "ward": "Gangapur Road",
                "lat": 20.0150,
                "lng": 73.7535,
                "status": "PENDING",
                "photo": "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=600&auto=format&fit=crop&q=80",
                "hours_ago": 4
            },
            {
                "num": "SWM-2026-00104",
                "category": "Plastic Waste",
                "desc": "Huge pile of discarded single-use plastic cups and packaging near temple entry path.",
                "loc": "Ramkund Ghat Walkway, Panchavati",
                "ward": "Panchavati",
                "lat": 20.0080,
                "lng": 73.7920,
                "status": "RESOLVED",
                "photo": "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80",
                "hours_ago": 36,
                "resolved_hours_ago": 10
            },
            {
                "num": "SWM-2026-00105",
                "category": "Food Waste",
                "desc": "Rotting vegetables and organic waste from weekly market producing foul smell.",
                "loc": "Trimurti Chowk Market Area, CIDCO",
                "ward": "CIDCO",
                "lat": 19.9745,
                "lng": 73.7528,
                "status": "PENDING",
                "photo": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80",
                "hours_ago": 3
            },
            {
                "num": "SWM-2026-00106",
                "category": "Garbage Dump",
                "desc": "Accumulated municipal waste behind industrial boundary wall on Road 12.",
                "loc": "NICE Industrial Sector, Satpur",
                "ward": "Satpur",
                "lat": 19.9895,
                "lng": 73.7230,
                "status": "PENDING",
                "photo": "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80",
                "hours_ago": 18
            },
            {
                "num": "SWM-2026-00107",
                "category": "E-Waste",
                "desc": "Discarded monitor housings, printed circuit boards, and cables left near electrical substation.",
                "loc": "Mahatma Nagar Substation Lane",
                "ward": "College Road",
                "lat": 20.0035,
                "lng": 73.7615,
                "status": "PENDING",
                "photo": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80",
                "hours_ago": 24
            },
            {
                "num": "SWM-2026-00108",
                "category": "Overflowing Dustbin",
                "desc": "Railway station passenger bin filled beyond brim with plastic bottles and food packets.",
                "loc": "Station East Approach, Nashik Road",
                "ward": "Nashik Road",
                "lat": 19.9578,
                "lng": 73.8344,
                "status": "RESOLVED",
                "photo": "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80",
                "hours_ago": 48,
                "resolved_hours_ago": 20
            },
            {
                "num": "SWM-2026-00109",
                "category": "Roadside Garbage",
                "desc": "Piles of leaves and street sweeping bags unattended on side of the road.",
                "loc": "Ashok Nagar Ring Road, Satpur",
                "ward": "Satpur",
                "lat": 19.9975,
                "lng": 73.7318,
                "status": "RESOLVED",
                "photo": "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80",
                "hours_ago": 52,
                "resolved_hours_ago": 28
            },
            {
                "num": "SWM-2026-00110",
                "category": "Garbage Dump",
                "desc": "Unregulated open dumping on vacant plot near residential society.",
                "loc": "Gangapur Dam Road, Anandwalli",
                "ward": "Gangapur Road",
                "lat": 20.0160,
                "lng": 73.7520,
                "status": "PENDING",
                "photo": "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80",
                "hours_ago": 6
            },
            {
                "num": "SWM-2026-00111",
                "category": "Plastic Waste",
                "desc": "Plastic bags and discarded wrappers near flower sellers' stalls.",
                "loc": "Muktidham Pilgrim Path, Nashik Road",
                "ward": "Nashik Road",
                "lat": 19.9540,
                "lng": 73.8402,
                "status": "RESOLVED",
                "photo": "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80",
                "hours_ago": 60,
                "resolved_hours_ago": 30
            },
            {
                "num": "SWM-2026-00112",
                "category": "Food Waste",
                "desc": "Food scraps from marriage hall bins left uncovered overnight.",
                "loc": "Kalaram Temple North Lane, Panchavati",
                "ward": "Panchavati",
                "lat": 20.0108,
                "lng": 73.7942,
                "status": "PENDING",
                "photo": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80",
                "hours_ago": 2
            }
        ]

        created_reports = []
        for r_data in sample_reports_data:
            nearest_bin, dist = find_nearest_dustbin(r_data["lat"], r_data["lng"], db)
            c_time = datetime.utcnow() - timedelta(hours=r_data["hours_ago"])
            r_time = datetime.utcnow() - timedelta(hours=r_data.get("resolved_hours_ago", 0)) if "resolved_hours_ago" in r_data else None

            rep = Report(
                report_number=r_data["num"],
                user_id=citizen_user.id,
                photo_url=r_data["photo"],
                category=r_data["category"],
                description=r_data["desc"],
                location=r_data["loc"],
                ward=r_data["ward"],
                latitude=r_data["lat"],
                longitude=r_data["lng"],
                nearest_dustbin_id=nearest_bin.id if nearest_bin else None,
                nearest_dustbin_distance=dist,
                status=r_data["status"],
                created_at=c_time,
                updated_at=c_time,
                resolved_at=r_time,
                completion_notes="Cleared and verified by NMC sanitary squad." if r_data["status"] == "RESOLVED" else None,
                completion_photo_url="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80" if r_data["status"] == "RESOLVED" else None
            )
            db.add(rep)
            created_reports.append(rep)

        db.commit()

        # Add Assignments for the assigned/in-progress reports
        print("Seeding Assignments...")
        rep_assigned = next(r for r in created_reports if r.report_number == "SWM-2026-00101")
        rep_progress = next(r for r in created_reports if r.report_number == "SWM-2026-00102")

        assign1 = Assignment(
            report_id=rep_assigned.id,
            worker_id=w_ramesh.id,
            assigned_by=admin_user.id,
            status="ASSIGNED",
            assigned_at=datetime.utcnow() - timedelta(hours=6)
        )
        assign2 = Assignment(
            report_id=rep_progress.id,
            worker_id=w_ganesh.id,
            assigned_by=admin_user.id,
            status="IN_PROGRESS",
            assigned_at=datetime.utcnow() - timedelta(hours=7),
            started_at=datetime.utcnow() - timedelta(hours=5)
        )
        db.add_all([assign1, assign2])

        # Notifications
        print("Seeding Notifications...")
        notifs = [
            Notification(user_id=admin_user.id, role="ADMIN", title="Daily Operations Started", message="Nashik Solid Waste monitoring initialized for all 6 wards."),
            Notification(user_id=worker_user.id, role="WORKER", title="Task Dispatched", message=f"Assigned to ticket {rep_assigned.report_number} at {rep_assigned.location}.", report_id=rep_assigned.id),
            Notification(user_id=citizen_user.id, role="CITIZEN", title="Report Registered", message=f"Your ticket {rep_assigned.report_number} has been assigned to sanitary field staff.", report_id=rep_assigned.id)
        ]
        db.add_all(notifs)
        db.commit()

        print("=== DATABASE SEEDED SUCCESSFULLY ===")
        print(f"Total Users: {db.query(User).count()}")
        print(f"Total Dustbins: {db.query(Dustbin).count()}")
        print(f"Total Workers: {db.query(Worker).count()}")
        print(f"Total Reports: {db.query(Report).count()}")
        print(f"Total Assignments: {db.query(Assignment).count()}")

    except Exception as e:
        db.rollback()
        print("Error during seeding:", e)
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed()
