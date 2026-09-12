import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { ReportTable } from '../../components/ReportTable';
import { MapView } from '../../components/MapView';
import { FileText, Clock, RefreshCw, CheckCircle2, PlusCircle, ArrowRight } from 'lucide-react';

export const CitizenDashboard = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const allReports = await api.getReports();
      // Filter reports filed by this citizen or relevant to their area
      const myReports = allReports.filter(
        (r) => r.citizenEmail === (user?.email || 'aarav.deshmukh@gmail.com')
      );
      
      const total = myReports.length;
      const pending = myReports.filter((r) => r.status === 'Pending').length;
      const inProgress = myReports.filter((r) => r.status === 'In Progress' || r.status === 'Assigned').length;
      const completed = myReports.filter((r) => r.status === 'Completed').length;

      setStats({ total, pending, inProgress, completed });
      setReports(allReports);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const recentReports = reports
    .filter((r) => r.citizenEmail === (user?.email || 'aarav.deshmukh@gmail.com'))
    .slice(0, 5);

  return (
    <div className="content-area">
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome, {user?.name || 'Citizen'}</h1>
          <p className="page-subtitle">Nashik Municipal Solid Waste Redressal Portal</p>
        </div>
        <Link to="/citizen/report" className="btn btn-primary">
          <PlusCircle size={16} />
          <span>Report Waste Issue</span>
        </Link>
      </div>

      {/* 4 Statistics */}
      <div className="stats-grid">
        <StatCard
          title="Total Reports"
          value={stats.total}
          subtext="Submitted by your account"
          icon={FileText}
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          subtext="Awaiting ward inspection"
          icon={Clock}
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          subtext="Assigned / Collection active"
          icon={RefreshCw}
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          subtext="Resolved & cleaned"
          icon={CheckCircle2}
        />
      </div>

      {/* Recent Reports Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Reports</h2>
          <Link to="/citizen/reports" className="btn btn-secondary btn-sm">
            <span>View All</span>
            <ArrowRight size={13} />
          </Link>
        </div>
        <ReportTable
          reports={recentReports}
          viewBaseUrl="/citizen/reports"
          emptyMessage="You haven't filed any waste complaints yet. Click 'Report Waste Issue' above to submit one."
        />
      </div>

      {/* Nearby Waste Reports Map */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Nearby Waste Reports</h2>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Interactive civic GIS view of active and resolved waste complaints in Nashik
            </div>
          </div>
          <Link to="/citizen/map" className="btn btn-secondary btn-sm">
            Full Screen Map
          </Link>
        </div>
        <div className="card-body" style={{ padding: '12px' }}>
          <MapView reports={reports} height="360px" viewBaseUrl="/citizen/reports" />
        </div>
      </div>
    </div>
  );
};
