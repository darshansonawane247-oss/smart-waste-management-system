import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

// Auth Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { NotificationsPage } from './pages/NotificationsPage';

// Citizen Pages
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { ReportWaste } from './pages/citizen/ReportWaste';
import { MyReports } from './pages/citizen/MyReports';
import { ReportDetails } from './pages/citizen/ReportDetails';
import { CitizenMap } from './pages/citizen/CitizenMap';
import { CitizenProfile } from './pages/citizen/CitizenProfile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AllReports } from './pages/admin/AllReports';
import { AdminReportDetails } from './pages/admin/AdminReportDetails';
import { Workers } from './pages/admin/Workers';
import { Assignments } from './pages/admin/Assignments';
import { Analytics } from './pages/admin/Analytics';
import { AdminMap } from './pages/admin/AdminMap';
import { Settings } from './pages/admin/Settings';

// Worker Pages
import { WorkerDashboard } from './pages/worker/WorkerDashboard';
import { MyTasks } from './pages/worker/MyTasks';
import { TaskDetails } from './pages/worker/TaskDetails';
import { CompletedTasks } from './pages/worker/CompletedTasks';
import { WorkerProfile } from './pages/worker/WorkerProfile';

// Main Application Layout Shell
const LayoutShell = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="main-layout">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {children}
      </div>
    </div>
  );
};

export default function App() {
  const { user, role } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Citizen Routes */}
      <Route
        path="/citizen/*"
        element={
          <LayoutShell>
            <Routes>
              <Route path="dashboard" element={<CitizenDashboard />} />
              <Route path="report" element={<ReportWaste />} />
              <Route path="reports" element={<MyReports />} />
              <Route path="reports/:id" element={<ReportDetails />} />
              <Route path="map" element={<CitizenMap />} />
              <Route path="profile" element={<CitizenProfile />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="*" element={<Navigate to="/citizen/dashboard" replace />} />
            </Routes>
          </LayoutShell>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <LayoutShell>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="reports" element={<AllReports />} />
              <Route path="reports/:id" element={<AdminReportDetails />} />
              <Route path="pending" element={<AllReports />} />
              <Route path="workers" element={<Workers />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="map" element={<AdminMap />} />
              <Route path="settings" element={<Settings />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </LayoutShell>
        }
      />

      {/* Worker Routes */}
      <Route
        path="/worker/*"
        element={
          <LayoutShell>
            <Routes>
              <Route path="dashboard" element={<WorkerDashboard />} />
              <Route path="tasks" element={<MyTasks />} />
              <Route path="tasks/:id" element={<TaskDetails />} />
              <Route path="completed" element={<CompletedTasks />} />
              <Route path="profile" element={<WorkerProfile />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="*" element={<Navigate to="/worker/dashboard" replace />} />
            </Routes>
          </LayoutShell>
        }
      />

      {/* Fallback Root Redirect */}
      <Route
        path="/"
        element={<Navigate to={`/${role || 'citizen'}/dashboard`} replace />}
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
