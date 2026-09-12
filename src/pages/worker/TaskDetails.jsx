import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { MapView } from '../../components/MapView';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  CheckCircle2,
  Play,
  Upload,
  User,
  Phone,
  Camera,
  Check
} from 'lucide-react';

const SAMPLE_COMPLETED_PHOTOS = [
  { label: 'Cleared Pavement Spot', url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80' },
  { label: 'Cleaned Roadside Curb', url: 'https://images.unsplash.com/photo-1516216628859-9bcceabb84ca?w=600&auto=format&fit=crop&q=80' },
  { label: 'Sanitized Bin Container', url: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=600&auto=format&fit=crop&q=80' }
];

export const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completionImage, setCompletionImage] = useState(SAMPLE_COMPLETED_PHOTOS[0].url);
  const [completionNotes, setCompletionNotes] = useState('');
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const loadTask = async () => {
    setLoading(true);
    const data = await api.getReportById(id);
    setTask(data);
    setLoading(false);
  };

  useEffect(() => {
    loadTask();
  }, [id]);

  const handleStartTask = async () => {
    const updated = await api.updateReportStatus(task.id, 'In Progress', 'Sanitary worker started waste clearance on site.');
    setTask(updated);
    setSuccessMessage('Task started. Status is now In Progress.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompletionImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinishCompletion = async (e) => {
    e.preventDefault();
    const updated = await api.completeTaskByWorker(task.id, completionImage, completionNotes || 'Cleared, loaded onto vehicle, and swept clean.');
    setTask(updated);
    setShowCompleteModal(false);
    setSuccessMessage('Waste collection completed successfully.');
  };

  if (loading) {
    return (
      <div className="content-area">
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading task details...
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="content-area">
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: '40px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#ef4444' }}>Task Not Found</h2>
            <Link to="/worker/tasks" className="btn btn-secondary btn-sm" style={{ marginTop: '16px' }}>
              Back to My Tasks
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
            <h1 className="page-title">Task: {task.id}</h1>
            <StatusBadge status={task.status} />
          </div>
          <p className="page-subtitle">Sanitary Field Task Record • Nashik Municipal Corporation</p>
        </div>
        <Link to="/worker/tasks" className="btn btn-secondary btn-sm">
          <ArrowLeft size={14} />
          <span>Back to Tasks</span>
        </Link>
      </div>

      {successMessage && (
        <div
          style={{
            padding: '14px 18px',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            border: '1px solid var(--primary-border)',
            borderRadius: 'var(--radius)',
            fontSize: '14px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px'
          }}
        >
          <CheckCircle2 size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Worker Quick Action Bar */}
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '16px 20px',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600 }}>Task Actions:</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Current Status: <strong>{task.status}</strong>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {task.status === 'Assigned' && (
            <button onClick={handleStartTask} className="btn btn-primary">
              <Play size={15} />
              <span>Accept Task & Start Collection</span>
            </button>
          )}

          {task.status === 'In Progress' && (
            <button onClick={() => setShowCompleteModal(true)} className="btn btn-primary">
              <CheckCircle2 size={16} />
              <span>Mark Completed</span>
            </button>
          )}

          {task.status === 'Completed' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 600, fontSize: '13px' }}>
              <CheckCircle2 size={16} />
              <span>Waste collection completed successfully.</span>
            </div>
          )}
        </div>
      </div>

      {/* Task Details Content */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        <div>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Task Specification</h2>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>WASTE CATEGORY</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                    {task.category}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>EXACT LOCATION</div>
                  <div style={{ fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <MapPin size={15} color="#15803d" />
                    <span>{task.location}</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>ASSIGNED DATE / TIME</div>
                  <div style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <Calendar size={15} color="#64748b" />
                    <span>{task.reportedDate}</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>CITIZEN'S DESCRIPTION</div>
                  <div style={{ fontSize: '14px', backgroundColor: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: 'var(--radius)', marginTop: '4px' }}>
                    {task.description}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>REPORTING CITIZEN</div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>{task.citizenName}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{task.citizenPhone}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Evidence */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Site Photos</h2>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: task.completionImageUrl ? '1fr 1fr' : '1fr', gap: '14px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Before Clearance (Citizen Photo)
                  </div>
                  <img
                    src={task.imageUrl}
                    alt="Citizen Photo"
                    style={{ width: '100%', height: '170px', objectFit: 'cover', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}
                  />
                </div>

                {task.completionImageUrl && (
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)', marginBottom: '6px' }}>
                      After Clearance (Your Proof)
                    </div>
                    <img
                      src={task.completionImageUrl}
                      alt="Completion Photo"
                      style={{ width: '100%', height: '170px', objectFit: 'cover', borderRadius: 'var(--radius)', border: '1px solid #86efac' }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          {/* Map Location */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Pickup GPS Coordinate</h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {task.lat.toFixed(4)}, {task.lng.toFixed(4)}
              </span>
            </div>
            <div className="card-body" style={{ padding: '12px' }}>
              <MapView reports={[task]} center={[task.lat, task.lng]} zoom={14} height="280px" />
            </div>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompleteModal && (
        <div className="modal-overlay" onClick={() => setShowCompleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Complete Waste Collection</h3>
              <button onClick={() => setShowCompleteModal(false)} className="btn btn-secondary btn-sm">✕</button>
            </div>
            <form onSubmit={handleFinishCompletion}>
              <div className="modal-body">
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  Please upload a photo of the cleared and sanitized site as proof of resolution.
                </p>

                <div className="form-group">
                  <label className="form-label">Upload Completion Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="form-control"
                    style={{ marginBottom: '8px' }}
                  />
                  <div className="form-help">Choose photo from phone or select demo photo below:</div>
                  <select
                    className="form-control"
                    style={{ marginTop: '6px', fontSize: '13px' }}
                    onChange={(e) => setCompletionImage(e.target.value)}
                  >
                    {SAMPLE_COMPLETED_PHOTOS.map((p, i) => (
                      <option key={i} value={p.url}>{p.label}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Photo Preview
                  </div>
                  <img
                    src={completionImage}
                    alt="Proof Preview"
                    style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Worker Completion Remarks</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Cleared 250kg waste, sprayed disinfectant."
                    value={completionNotes}
                    onChange={(e) => setCompletionNotes(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowCompleteModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>Confirm Task Completion</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
