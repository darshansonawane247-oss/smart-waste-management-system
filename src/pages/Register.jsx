import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trash2, UserPlus, CheckCircle } from 'lucide-react';
import { NASHIK_AREAS } from '../data/mockData';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    area: 'Panchavati',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill out all mandatory fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    register(formData);
    setSuccess(true);
    setTimeout(() => {
      navigate('/citizen/dashboard');
    }, 1200);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '24px' }}>
      <div
        style={{
          maxWidth: '560px',
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          padding: '32px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '6px',
              backgroundColor: '#15803d',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Trash2 size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>
              Citizen Registration
            </h2>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Nashik Municipal Corporation — Waste Redressal Cell
            </div>
          </div>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', border: '1px solid #fca5a5', fontSize: '13px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {success ? (
          <div style={{ textAlign: 'center', padding: '30px 20px' }}>
            <CheckCircle size={48} color="#15803d" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>
              Account Created Successfully!
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
              Redirecting you to the citizen dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name <span className="required">*</span></label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="e.g. Ramesh Kadam"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Email Address <span className="required">*</span></label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="ramesh@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number <span className="required">*</span></label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="+91 98220 12345"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Municipal Area / Ward</label>
                <select
                  name="area"
                  className="form-control"
                  value={formData.area}
                  onChange={handleChange}
                >
                  {NASHIK_AREAS.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Residential Address</label>
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  placeholder="Apartment / Colony name"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Password <span className="required">*</span></label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password <span className="required">*</span></label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px 16px', marginTop: '8px' }}
            >
              <UserPlus size={16} />
              <span>Register Account</span>
            </button>

            <div style={{ marginTop: '18px', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
              Already registered?{' '}
              <Link to="/login" style={{ fontWeight: 600, color: '#15803d' }}>
                Sign In here
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
