import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { HardHat, Phone, Plus, UserCheck } from 'lucide-react';
import { NASHIK_AREAS } from '../../data/mockData';

export const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWorker, setNewWorker] = useState({
    name: '',
    phone: '',
    assignedArea: 'Panchavati'
  });

  useEffect(() => {
    const fetchWorkers = async () => {
      const data = await api.getWorkers();
      setWorkers(data);
    };
    fetchWorkers();
  }, []);

  const handleAddWorker = (e) => {
    e.preventDefault();
    if (!newWorker.name || !newWorker.phone) return;

    const count = workers.length + 1;
    const workerObj = {
      id: `W-0${count}`,
      name: newWorker.name,
      employeeId: `NMC-SAN-40${count}`,
      phone: newWorker.phone,
      assignedArea: newWorker.assignedArea,
      status: 'Available',
      activeTasks: 0,
      rating: 4.8
    };

    setWorkers([...workers, workerObj]);
    setShowAddModal(false);
    setNewWorker({ name: '', phone: '', assignedArea: 'Panchavati' });
  };

  return (
    <div className="content-area">
      <div className="page-header">
        <div>
          <h1 className="page-title">Sanitary Field Workers</h1>
          <p className="page-subtitle">Nashik Municipal Corporation sanitary personnel roster</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-sm">
          <Plus size={15} />
          <span>Add New Worker</span>
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Staff Directory</h2>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {workers.length} active sanitary personnel
          </span>
        </div>
        <div className="table-responsive">
          <table className="swm-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Worker Name</th>
                <th>Contact Phone</th>
                <th>Assigned Ward / Beat</th>
                <th>Current Active Tasks</th>
                <th>Duty Status</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w) => (
                <tr key={w.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{w.employeeId}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--primary-light)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <HardHat size={14} />
                      </div>
                      <span style={{ fontWeight: 600 }}>{w.name}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px' }}>
                      <Phone size={13} color="#64748b" />
                      <span>{w.phone}</span>
                    </div>
                  </td>
                  <td>
                    <span>{w.assignedArea} Ward</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{w.activeTasks}</span>
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: w.status === 'Available' ? 'var(--status-completed-bg)' : 'var(--status-pending-bg)',
                        color: w.status === 'Available' ? 'var(--status-completed-text)' : 'var(--status-pending-text)'
                      }}
                    >
                      {w.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Register Sanitary Staff Member</h3>
              <button onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-sm">✕</button>
            </div>
            <form onSubmit={handleAddWorker}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Anand Shinde"
                    value={newWorker.name}
                    onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Mobile <span className="required">*</span></label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="+91 98230 00000"
                    value={newWorker.phone}
                    onChange={(e) => setNewWorker({ ...newWorker, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Default Assigned Ward</label>
                  <select
                    className="form-control"
                    value={newWorker.assignedArea}
                    onChange={(e) => setNewWorker({ ...newWorker, assignedArea: e.target.value })}
                  >
                    {NASHIK_AREAS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
