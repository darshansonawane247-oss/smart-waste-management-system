import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { Link } from 'react-router-dom';
import { HardHat, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';

export const Assignments = () => {
  const [reports, setReports] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [selectedAssignments, setSelectedAssignments] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const rep = await api.getReports();
    const wrk = await api.getWorkers();
    setReports(rep);
    setWorkers(wrk);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleWorkerSelect = (reportId, workerId) => {
    setSelectedAssignments({ ...selectedAssignments, [reportId]: workerId });
  };

  const handleDispatch = async (reportId) => {
    const workerId = selectedAssignments[reportId] || workers[0]?.id;
    if (!workerId) return;

    await api.assignWorker(reportId, workerId);
    setSuccessMsg(`Successfully dispatched worker for ${reportId}.`);
    setTimeout(() => setSuccessMsg(''), 3000);
    loadData();
  };

  const pendingReports = reports.filter((r) => r.status === 'Pending');
  const activeAssignments = reports.filter((r) => r.status === 'Assigned' || r.status === 'In Progress');

  return (
    <div className="content-area">
      <div className="page-header">
        <div>
          <h1 className="page-title">Task Assignments & Dispatch</h1>
          <p className="page-subtitle">Allocate incoming civic grievances to sanitary workers by ward</p>
        </div>
      </div>

      {successMsg && (
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
          <span>{successMsg}</span>
        </div>
      )}

      {/* Unassigned Grievances Requiring Action */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} color="#d97706" />
            <h2 className="card-title">Unassigned Grievances Requiring Worker Allocation</h2>
          </div>
          <span className="badge badge-pending">{pendingReports.length} pending allocation</span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {pendingReports.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
              All incoming waste reports have been assigned to field workers.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="swm-table">
                <thead>
                  <tr>
                    <th>Report ID</th>
                    <th>Category</th>
                    <th>Location / Ward</th>
                    <th>Reported Date</th>
                    <th>Select Sanitary Worker</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingReports.map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600 }}>{r.id}</td>
                      <td>{r.category}</td>
                      <td>📍 {r.location}</td>
                      <td>{r.reportedDate}</td>
                      <td>
                        <select
                          className="form-control"
                          style={{ padding: '6px 8px', fontSize: '13px' }}
                          value={selectedAssignments[r.id] || ''}
                          onChange={(e) => handleWorkerSelect(r.id, e.target.value)}
                        >
                          <option value="">-- Choose Sanitary Staff --</option>
                          {workers.map((w) => (
                            <option key={w.id} value={w.id}>
                              {w.name} ({w.assignedArea} Ward)
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleDispatch(r.id)}
                          className="btn btn-primary btn-sm"
                          disabled={!selectedAssignments[r.id]}
                        >
                          <UserCheck size={13} />
                          <span>Dispatch</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Active Work In Progress */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Active Dispatches Under Collection</h2>
          <span className="badge badge-inprogress">{activeAssignments.length} in-field</span>
        </div>
        <div className="table-responsive">
          <table className="swm-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Category</th>
                <th>Location</th>
                <th>Assigned Worker</th>
                <th>Current Status</th>
                <th style={{ textAlign: 'right' }}>Manage</th>
              </tr>
            </thead>
            <tbody>
              {activeAssignments.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600 }}>{r.id}</td>
                  <td>{r.category}</td>
                  <td>{r.location}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <HardHat size={14} color="#15803d" />
                      <span style={{ fontWeight: 500 }}>{r.assignedWorkerName}</span>
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={r.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link to={`/admin/reports/${r.id}`} className="btn btn-secondary btn-sm">
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
