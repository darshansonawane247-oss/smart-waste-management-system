import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { MapView } from '../../components/MapView';
import { ArrowLeft, Calendar, MapPin, User, HardHat, Phone, CheckCircle2, Clock, FileText } from 'lucide-react';

export const ReportDetails = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      const data = await api.getReportById(id);
      setReport(data);
      setLoading(false);
    };
    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="content-area">
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading grievance details...
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
            <p style={{ marginTop: '8px', color: 'var(--text-muted)' }}>
              No waste report exists with ID: {id}
            </p>
            <Link to="/citizen/reports" className="btn btn-secondary btn-sm" style={{ marginTop: '16px' }}>
              Back to Reports
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
            <h1 className="page-title">{report.id}</h1>
            <StatusBadge status={report.status} />
          </div>
          <p className="page-subtitle">Civic Waste Grievance Record • Nashik Municipal Corporation</p>
        </div>
        <Link to="/citizen/reports" className="btn btn-secondary btn-sm">
          <ArrowLeft size={14} />
          <span>Back to List</span>
        </Link>
      </div>

      {/* Simple Municipal Progress Timeline */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h2 className="card-title">Grievance Resolution Progress</h2>
        </div>
        <div className="card-body" style={{ padding: '24px 20px' }}>
          <div className="timeline">
            {report.timeline.map((step, idx) => {
              const isDone = step.completed;
              const isCurrent = !isDone && (idx === 0 || report.timeline[idx - 1]?.completed);
              return (
                <div
                  key={step.step}
                  className={`timeline-step ${isDone ? 'completed' : isCurrent ? 'active' : ''}`}
                >
                  <div className="timeline-icon">
                    {isDone ? <CheckCircle2 size={18} /> : idx + 1}
                  </div>
                  <div className="timeline-label">{step.step}</div>
                  <div className="timeline-date">{step.date || 'Pending'}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Left (Details & Photos) | Right (Map & Worker Info) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Left Column */}
        <div>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Incident Information</h2>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>WASTE CATEGORY</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                    {report.category}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>LOCATION / WARD</div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <MapPin size={15} color="#15803d" />
                    <span>{report.location}</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>REPORTED DATE & TIME</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <Calendar size={15} color="#64748b" />
                    <span>{report.reportedDate}</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>PROBLEM DESCRIPTION</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-main)', backgroundColor: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius)', marginTop: '4px', lineHeight: 1.5 }}>
                    {report.description}
                  </div>
                </div>

                {report.notes && (
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>SUPERVISOR / SYSTEM REMARKS</div>
                    <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
                      {report.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Photo Evidence Card */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Photographic Evidence</h2>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: report.completionImageUrl ? '1fr 1fr' : '1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Citizen Reported Image
                  </div>
                  <img
                    src={report.imageUrl}
                    alt="Citizen Reported"
                    style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}
                  />
                </div>

                {report.completionImageUrl && (
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#15803d', marginBottom: '6px' }}>
                      Field Worker Clearance Proof
                    </div>
                    <img
                      src={report.completionImageUrl}
                      alt="Clearance Proof"
                      style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 'var(--radius)', border: '1px solid #86efac' }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Map Location */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Geographic Location</h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                {report.lat.toFixed(4)}° N, {report.lng.toFixed(4)}° E
              </span>
            </div>
            <div className="card-body" style={{ padding: '12px' }}>
              <MapView
                reports={[report]}
                center={[report.lat, report.lng]}
                zoom={14}
                height="260px"
              />
            </div>
          </div>

          {/* Assigned Worker / Sanitary Unit */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Assigned Sanitary Worker</h2>
            </div>
            <div className="card-body">
              {report.assignedWorkerName ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <HardHat size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                      {report.assignedWorkerName}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Sanitary Staff • Ward Division {report.area}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                      <Phone size={12} />
                      <span>Contact via Municipal Central: 1800-233-0244</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius)', fontSize: '13px', color: 'var(--text-muted)' }}>
                  A field sanitary worker has not yet been assigned to this ticket. The ward sanitary inspector typically dispatches a team within 2-4 working hours.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
