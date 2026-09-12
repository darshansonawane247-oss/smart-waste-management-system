import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NASHIK_AREAS } from '../../data/mockData';
import { User, Mail, Phone, MapPin, CheckCircle, Save } from 'lucide-react';

export const CitizenProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || 'Aarav Deshmukh',
    email: user?.email || 'aarav.deshmukh@gmail.com',
    phone: user?.phone || '+91 98221 44556',
    area: user?.area || 'Gangapur Road',
    address: user?.address || 'Flat 302, Sai Residency, Gangapur Road, Nashik - 422013'
  });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="content-area">
      <div className="page-header">
        <div>
          <h1 className="page-title">Citizen Profile</h1>
          <p className="page-subtitle">Your registered resident details and municipal jurisdiction</p>
        </div>
      </div>

      <div style={{ maxWidth: '640px' }} className="card">
        <div className="card-header">
          <h2 className="card-title">Resident Account Information</h2>
          <span className="badge badge-assigned">Registered Citizen</span>
        </div>
        <div className="card-body">
          {saved && (
            <div
              style={{
                padding: '10px 14px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                border: '1px solid var(--primary-border)',
                borderRadius: 'var(--radius)',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '18px'
              }}
            >
              <CheckCircle size={16} />
              <span>Profile information updated successfully.</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  disabled
                  style={{ backgroundColor: 'var(--bg-subtle)' }}
                />
                <div className="form-help">Primary login identifier</div>
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input
                  type="tel"
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Primary Municipal Area / Ward</label>
              <select
                className="form-control"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              >
                {NASHIK_AREAS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Residential Address</label>
              <textarea
                className="form-control"
                rows="2"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary">
                <Save size={15} />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
