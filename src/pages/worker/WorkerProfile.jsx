import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { HardHat, Phone, MapPin, Award, Shield } from 'lucide-react';

export const WorkerProfile = () => {
  const { user } = useAuth();

  return (
    <div className="content-area">
      <div className="page-header">
        <div>
          <h1 className="page-title">Worker Profile</h1>
          <p className="page-subtitle">Nashik Municipal Corporation Field Personnel Record</p>
        </div>
      </div>

      <div style={{ maxWidth: '640px' }} className="card">
        <div className="card-header">
          <h2 className="card-title">Sanitary Employee Credentials</h2>
          <span className="badge badge-completed">On Active Duty</span>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <HardHat size={32} />
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
                {user?.name || 'Ramesh Shinde'}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Sanitary Department • {user?.employeeId || 'NMC-SAN-401'}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>EMPLOYEE CODE</div>
              <div style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'monospace', marginTop: '2px' }}>
                {user?.employeeId || 'NMC-SAN-401'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>CONTACT PHONE</div>
              <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '2px' }}>
                {user?.phone || '+91 98230 11223'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>ASSIGNED WARD / BEAT</div>
              <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '2px' }}>
                {user?.assignedArea || 'CIDCO'} Ward
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>DIVISION</div>
              <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '2px' }}>
                Zone 4 Solid Waste Division
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>SERVICE RATING</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#d97706', marginTop: '2px' }}>
                ⭐ 4.8 / 5.0 (Municipal Citizen Feedback)
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>COLLECTION VEHICLE</div>
              <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '2px' }}>
                MH-15-AB-4122 (Hydraulic Tipper)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
