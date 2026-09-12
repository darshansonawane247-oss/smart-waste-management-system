import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { ReportTable } from '../../components/ReportTable';
import { WASTE_CATEGORIES, NASHIK_AREAS } from '../../data/mockData';
import { Search, Filter, RefreshCw } from 'lucide-react';

export const AllReports = () => {
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'All';

  const [reports, setReports] = useState([]);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState(initialStatus);
  const [filterArea, setFilterArea] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await api.getReports();
    setReports(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredReports = reports.filter((r) => {
    const matchCategory = filterCategory === 'All' || r.category === filterCategory;
    const matchStatus = filterStatus === 'All' || r.status.toLowerCase() === filterStatus.toLowerCase();
    const matchArea = filterArea === 'All' || r.area === filterArea;
    const matchSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.citizenName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchStatus && matchArea && matchSearch;
  });

  return (
    <div className="content-area">
      <div className="page-header">
        <div>
          <h1 className="page-title">All Waste Reports</h1>
          <p className="page-subtitle">Centralized civic complaint database & administrative oversight</p>
        </div>
        <button onClick={loadData} className="btn btn-secondary btn-sm">
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Multi-filter Bar */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 240px' }}>
          <Search size={16} color="#64748b" />
          <input
            type="text"
            className="form-control"
            placeholder="Search ID, citizen, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '6px 10px', fontSize: '13px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Category:</span>
          <select
            className="form-control"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ width: 'auto', padding: '6px 10px', fontSize: '13px' }}
          >
            <option value="All">All Categories</option>
            {WASTE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Status:</span>
          <select
            className="form-control"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: 'auto', padding: '6px 10px', fontSize: '13px' }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Area:</span>
          <select
            className="form-control"
            value={filterArea}
            onChange={(e) => setFilterArea(e.target.value)}
            style={{ width: 'auto', padding: '6px 10px', fontSize: '13px' }}
          >
            <option value="All">All Areas</option>
            {NASHIK_AREAS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Grievance List</h2>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Showing {filteredReports.length} of {reports.length} records
          </span>
        </div>
        <ReportTable
          reports={filteredReports}
          viewBaseUrl="/admin/reports"
          showCitizen={true}
          showWorker={true}
        />
      </div>
    </div>
  );
};
