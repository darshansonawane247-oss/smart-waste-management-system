# SWM — Smart Waste Management and Monitoring System

A civic waste-management and grievance redressal platform designed for municipal corporations, connecting citizens, municipal administrators, and sanitary field workers.

---

## 📌 Project Overview

The **SWM (Smart Waste Management and Monitoring System)** is a practical, municipal-grade civic platform that allows:
- **Citizens** to geotag and report waste hotspots, track grievance resolution in real-time, and view nearby complaints on a GIS map.
- **Municipal Administrators** to monitor city-wide waste statistics, view waste classification breakdowns, assign field workers, and track SLAs.
- **Sanitary Field Workers** to receive task dispatches, locate garbage spots via GPS coordinates, accept collections, and upload photo proof of clearance.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, JavaScript, HTML5, CSS3
- **Routing**: React Router DOM (v6)
- **Maps / GIS**: Leaflet, React-Leaflet, OpenStreetMap
- **Icons**: Lucide React
- **Architecture**: MVC-compatible, backend-ready service layer (`src/services/api.js`) ready to integrate with **Java + Servlet + JSP / Spring Boot + MySQL**.
- **Data & State**: In-browser persistent `localStorage` with realistic Indian municipal seed data (Nashik Municipal Corporation).

---

## 👥 User Roles & Credentials

### 1. Citizen
- **Email**: `aarav.deshmukh@gmail.com`
- **Password**: `password123`
- **Features**: Geotagged waste reporting with interactive Leaflet pin-picker, photographic upload, status timeline tracking, nearby map, resident profile.

### 2. Sanitary Worker
- **Email**: `ramesh@swm.org`
- **Password**: `password123`
- **Employee ID**: `NMC-SAN-401` (CIDCO Ward)
- **Features**: Task dashboard, pickup route location, "Accept Task", "Start Collection", completion proof photo upload, "Mark Completed".

### 3. Municipal Admin
- **Email**: `admin@nashik-swm.gov.in`
- **Password**: `password123`
- **Features**: City-wide grievance analytics, reports by category chart, worker directory, automated & manual dispatch, status lifecycle controls.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 2. Installation
```bash
git clone <your-repository-url>
cd swm-waste-management
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 📂 Project Structure

```
swm-waste-management/
├── src/
│   ├── components/       # Reusable UI components (Navbar, Sidebar, MapView, StatusBadge, etc.)
│   ├── context/          # AuthContext for role authentication & demo switching
│   ├── data/             # Mock data with realistic Nashik wards & personnel
│   ├── pages/
│   │   ├── citizen/      # Citizen dashboard, reporting form, grievance details
│   │   ├── admin/        # Admin dashboard, reports table, worker management, analytics
│   │   └── worker/       # Sanitary worker task list & completion workflow
│   ├── services/         # Storage and async API service layer
│   ├── App.jsx           # Application routing
│   ├── index.css         # Clean, human-made civic design system
│   └── main.jsx          # Application entrypoint
├── index.html
├── package.json
└── vite.config.js
```
