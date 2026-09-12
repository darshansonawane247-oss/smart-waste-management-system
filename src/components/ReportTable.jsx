import React from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import { Eye, MapPin, Calendar } from 'lucide-react';

export const ReportTable = ({ reports = [], viewBaseUrl = '/citizen/reports', showCitizen = false, showWorker = false, emptyMessage = 'No reports found.' }) => {
  if (!reports || reports.length === 0) {
    return (
      <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="swm-table">
        <thead>
          <tr>
            <th>Report ID</th>
            <th>Category</th>
            <th>Location</th>
            {showCitizen && <th>Reported By</th>}
            {showWorker && <th>Assigned Worker</th>}
            <th>Date</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{report.id}</span>
              </td>
              <td>
                <span style={{ fontWeight: 500 }}>{report.category}</span>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                  <MapPin size={14} color="#64748b" />
                  <span>{report.location}</span>
                </div>
              </td>
              {showCitizen && (
                <td>
                  <div style={{ fontSize: '13px' }}>
                    <div style={{ fontWeight: 500 }}>{report.citizenName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{report.citizenPhone}</div>
                  </div>
                </td>
              )}
              {showWorker && (
                <td>
                  <span style={{ fontSize: '13px', color: report.assignedWorkerName ? 'var(--text-main)' : 'var(--text-muted)' }}>
                    {report.assignedWorkerName || 'Unassigned'}
                  </span>
                </td>
              )}
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <Calendar size={13} />
                  <span>{report.reportedDate}</span>
                </div>
              </td>
              <td>
                <StatusBadge status={report.status} />
              </td>
              <td style={{ textAlign: 'right' }}>
                <Link to={`${viewBaseUrl}/${report.id}`} className="btn btn-secondary btn-sm">
                  <Eye size={13} />
                  <span>View</span>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
