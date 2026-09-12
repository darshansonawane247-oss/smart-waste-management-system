import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { MapView } from '../../components/MapView';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  HardHat,
  CheckCircle2,
  XCircle,
  Clock,
  UserPlus,
  AlertTriangle
} from 'lucide-react';

export const AdminReportDetails = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');

  const loadData = async () => {
    setLoading(true);
    const rep = await api.getReportById(id);
    const wrk = await api.getWorkers();
    setReport(rep);
    setWorkers(wrk);
    if (wrk.length > 0) setSelectedWorkerId(wrk[0].id);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleAssignWorker = async () => {
    if (!selectedWorkerId) return;
    const updated = await api.assignWorker(report.id, selectedWorkerId);
    setReport(updated);
    setShowAssignModal(false);
    setActionSuccess(`Worker successfully assigned to ${report.id}.`);
    setTimeout(() => setActionSuccess(''), 4000);
  };

  const handleStatusChange = async (newStatus) => {
    const updated = await api.updateReportStatus(report.id, newStatus);
    setReport(updated);
    setActionSuccess(`Status updated to "${newStatus}".`);
    setTimeout(() => setActionSuccess(''), 4000);
  };

  if (loading) {
    return (
      <div className="content-area">
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading administrative record...
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="content-area">
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: '40px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#ef4444' }}>Report Not Found</h2>
            <Link to="/admin/reports" className="btn btn-secondary btn-sm" style={{ marginTop: '16px' }}>
              Back to All Reports
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-area">
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h1 className="page-title">Manage: {report.id}</h1>
            <StatusBadge status={report.status} />
          </div>
          <p className="page-subtitle">Nashik Municipal Corporation Grievance Dispatch</p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setShowAssignModal(true)} className="btn btn-primary btn-sm">
            <UserPlus size={14} />
            <span>Assign Worker</span>
          </button>
          <Link to="/admin/reports" className="btn btn-secondary btn-sm">
            <ArrowLeft size={14} />
            <span>Back to List</span>
          </Link>
        </div>
      </div>

      {actionSuccess && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            border: '1px solid var(--primary-border)',
            borderRadius: 'var(--radius)',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}
        >
          <CheckCircle2 size={16} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Admin Action Bar */}
      <div
        style={{
          backgroundColor: 'var(--bg-subtle)',
          padding: '14px 20px',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px'
        }}
      >
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
          Admin Workflow Actions:
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleStatusChange('In Progress')}
            className="btn btn-secondary btn-sm"
            disabled={report.status === 'In Progress'}
          >
            Mark In Progress
          </button>
          <button
            onClick={() => handleStatusChange('Completed')}
            className="btn btn-primary btn-sm"
            disabled={report.status === 'Completed'}
          >
            <CheckCircle2 size={13} />
            <span>Mark as Completed</span>
          </button>
          <button
            onClick={() => handleStatusChange('Rejected')}
            className="btn btn-secondary btn-sm"
            style={{ color: '#dc2626', borderColor: '#fca5a5' }}
            disabled={report.status === 'Rejected'}
          >
            <XCircle size={13} />
            <span>Reject Report</span>
          </button>
        </div>
      </div>

      {/* 2-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        <div>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Grievance & Citizen Details</h2>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>CATEGORY</div>
                  <div style={{ fontSize: '15px', fontWeight: 600 }}>{report.category}</div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>LOCATION / WARD</div>
                  <div style={{ fontSize: '14px' }}>📍 {report.location} ({report.area} Ward)</div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>CITIZEN CONTACT</div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>{report.citizenName}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{report.citizenEmail} • {report.citizenPhone}</div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>DESCRIPTION</div>
                  <div style={{ fontSize: '14px', backgroundColor: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: 'var(--radius)', marginTop: '4px' }}>
                    {report.description}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>LOGGED REMARKS</div>
                  <div style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>
                    {report.notes || 'No custom remarks recorded.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Photos</h2>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: report.completionImageUrl ? '1fr 1fr' : '1fr', gap: '14px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Citizen Upload
                  </div>
                  <img
                    src={report.imageUrl}
                    alt="Citizen Upload"
                    style={{ width: '100%', height: '170px', objectFit: 'cover', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}
                  />
                </div>
                {report.completionImageUrl && (
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#15803d', marginBottom: '4px' }}>
                      Worker Clearance
                    </div>
                    <img
                      src={report.completionImageUrl}
                      alt="Worker Clearance"
                      style={{ width: '100%', height: '170px', objectFit: 'cover', borderRadius: 'var(--radius)', border: '1px solid #86efac' }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          {/* Map */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">GIS Spot Location</h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {report.lat.toFixed(4)}, {report.lng.toFixed(4)}
              </span>
            </div>
            <div className="card-body" style={{ padding: '12px' }}>
              <MapView reports={[report]} center={[report.lat, report.lng]} zoom={14} height="240px" />
            </div>
          </div>

          {/* Assigned Worker */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Assigned Field Worker</h2>
              <button onClick={() => setShowAssignModal(true)} className="btn btn-secondary btn-sm">
                Change Worker
              </button>
            </div>
            <div className="card-body">
              {report.assignedWorkerName ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <HardHat size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700 }}>{report.assignedWorkerName}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      ID: {report.assignedWorkerId || 'Sanitary Staff'} • Ward Beat: {report.area}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '14px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    No worker currently assigned to this ticket.
                  </p>
                  <button onClick={() => setShowAssignModal(true)} className="btn btn-primary btn-sm">
                    Assign Sanitary Worker Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Worker Assignment Modal */}
      {showAssignModal && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Assign Sanitary Worker</h3>
              <button onClick={() => setShowAssignModal(false)} className="btn btn-secondary btn-sm">
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                Select a registered municipal sanitary staff member for report <strong>{report.id}</strong> ({report.area} Ward).
              </p>

              <div className="form-group">
                <label className="form-label">Select Worker</label>
                <select
                  className="form-control"
                  value={selectedWorkerId}
                  onChange={(e) => setSelectedWorkerId(e.target.value)}
                >
                  {workers.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.employeeId}) — {w.assignedArea} Ward [{w.status}]
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowAssignModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleAssignWorker} className="btn btn-primary">
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
