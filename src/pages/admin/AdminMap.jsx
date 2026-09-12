import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { MapView } from '../../components/MapView';

export const AdminMap = () => {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchReports = async () => {
      const data = await api.getReports();
      setReports(data);
    };
    fetchReports();
  }, []);

  const filtered = reports.filter((r) => filter === 'All' || r.status.toLowerCase() === filter.toLowerCase());

  return (
    <div className="content-area">
      <div className="page-header">
        <div>
          <h1 className="page-title">City-Wide GIS Waste Hotspot Map</h1>
          <p className="page-subtitle">Nashik Municipal Corporation spatial surveillance</p>
        </div>
        <div>
          <select
            className="form-control"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: 'auto', padding: '6px 12px' }}
          >
            <option value="All">All Spots ({reports.length})</option>
            <option value="Pending">Pending Only</option>
            <option value="Assigned">Assigned Only</option>
            <option value="In Progress">In Progress Only</option>
            <option value="Completed">Completed Only</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: '12px' }}>
          <MapView reports={filtered} height="580px" zoom={12} viewBaseUrl="/admin/reports" />
        </div>
      </div>
    </div>
  );
};
