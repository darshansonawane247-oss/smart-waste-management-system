import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { ReportTable } from '../../components/ReportTable';
import { PlusCircle, Search } from 'lucide-react';

export const MyReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const allReports = await api.getReports();
      // Show reports for current citizen or all if testing
      const userReports = allReports.filter(
        (r) => r.citizenEmail === (user?.email || 'aarav.deshmukh@gmail.com')
      );
      setReports(userReports);
      setLoading(false);
    };

    fetchReports();
  }, [user]);

  const filteredReports = reports.filter((r) => {
    const matchesStatus = filterStatus === 'All' || r.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="content-area">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Waste Reports</h1>
          <p className="page-subtitle">Track and monitor status of your reported grievances</p>
        </div>
        <Link to="/citizen/report" className="btn btn-primary">
          <PlusCircle size={16} />
          <span>New Waste Report</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px' }}>
          <Search size={16} color="#64748b" />
          <input
            type="text"
            className="form-control"
            placeholder="Search by ID, category, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '6px 10px', fontSize: '13px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Status:</span>
          <select
            className="form-control"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '6px 10px', fontSize: '13px', width: 'auto' }}
          >
            <option value="All">All Statuses ({reports.length})</option>
            <option value="Pending">Pending</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Reports Table Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Grievance History</h2>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Showing {filteredReports.length} of {reports.length} reports
          </span>
        </div>
        <ReportTable
          reports={filteredReports}
          viewBaseUrl="/citizen/reports"
          showWorker={true}
          emptyMessage="No reports match the selected filters."
        />
      </div>
    </div>
  );
};
