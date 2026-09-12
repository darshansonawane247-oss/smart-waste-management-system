import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { MapView } from '../../components/MapView';
import { MapPin, Filter } from 'lucide-react';

export const CitizenMap = () => {
  const [reports, setReports] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const data = await api.getReports();
      setReports(data);
      setLoading(false);
    };
    fetchReports();
  }, []);

  const filteredReports = reports.filter((r) => {
    if (filterStatus === 'All') return true;
    return r.status.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="content-area">
      <div className="page-header">
        <div>
          <h1 className="page-title">City Waste Reports Map</h1>
          <p className="page-subtitle">Nashik Municipal GIS Waste Monitoring Map</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={15} color="#64748b" />
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Status:</span>
          <select
            className="form-control"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
          >
            <option value="All">All Active & Resolved ({reports.length})</option>
            <option value="Pending">Pending Only</option>
            <option value="Assigned">Assigned Only</option>
            <option value="In Progress">In Progress Only</option>
            <option value="Completed">Completed Only</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: '12px' }}>
          <MapView
            reports={filteredReports}
            height="560px"
            zoom={12}
            viewBaseUrl="/citizen/reports"
          />
        </div>
      </div>
    </div>
  );
};
