import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { ReportTable } from '../../components/ReportTable';
import { CategoryChart } from '../../components/CategoryChart';
import { FileText, Clock, RefreshCw, CheckCircle2, Users, AlertCircle, ArrowRight } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const s = await api.getStatistics();
      const r = await api.getReports();
      setStats(s);
      setRecentReports(r.slice(0, 6));
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="content-area">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Nashik Municipal Solid Waste Command & Redressal Center</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to="/admin/pending" className="btn btn-secondary btn-sm">
            Pending Review ({stats?.pending || 0})
          </Link>
          <Link to="/admin/assignments" className="btn btn-primary btn-sm">
            Dispatch Worker
          </Link>
        </div>
      </div>

      {/* 4 Statistics */}
      <div className="stats-grid">
        <StatCard
          title="Total Reports"
          value={stats?.total || 0}
          subtext="City-wide logged tickets"
          icon={FileText}
        />
        <StatCard
          title="Pending"
          value={stats?.pending || 0}
          subtext="Require worker assignment"
          icon={Clock}
        />
        <StatCard
          title="In Progress"
          value={stats?.inProgress + stats?.assigned || 0}
          subtext="Assigned / Active collection"
          icon={RefreshCw}
        />
        <StatCard
          title="Completed"
          value={stats?.completed || 0}
          subtext="Verified & cleared spots"
          icon={CheckCircle2}
        />
      </div>

      {/* 2-Column Section: Category Chart | Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h2 className="card-title">Reports by Category</h2>
            <Link to="/admin/analytics" className="btn btn-secondary btn-sm">
              Deep Analytics
            </Link>
          </div>
          <div className="card-body">
            <CategoryChart categoryCounts={stats?.categoryCounts || {}} />
          </div>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h2 className="card-title">Wards Overview</h2>
            <Link to="/admin/map" className="btn btn-secondary btn-sm">
              GIS Map
            </Link>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.entries(stats?.areaCounts || {}).slice(0, 5).map(([area, count]) => (
                <div
                  key={area}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius)',
                    fontSize: '13px'
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{area} Ward</span>
                  <span className="badge badge-assigned">{count} active reports</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Waste Reports</h2>
          <Link to="/admin/reports" className="btn btn-secondary btn-sm">
            <span>View All Reports</span>
            <ArrowRight size={13} />
          </Link>
        </div>
        <ReportTable
          reports={recentReports}
          viewBaseUrl="/admin/reports"
          showCitizen={true}
          showWorker={true}
        />
      </div>
    </div>
  );
};
