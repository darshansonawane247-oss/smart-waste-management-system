import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShieldCheck, User, HardHat, LogIn, AlertCircle } from 'lucide-react';
import { DEMO_USERS } from '../data/mockData';

export const Login = () => {
  const [role, setRole] = useState('citizen');
  const [email, setEmail] = useState(DEMO_USERS.citizen.email);
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (DEMO_USERS[newRole]) {
      setEmail(DEMO_USERS[newRole].email);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    login(role, email, password);
    navigate(`/${role}/dashboard`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '20px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          maxWidth: '860px',
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden'
        }}
      >
        {/* Left: Branding & Municipal Mission */}
        <div
          style={{
            backgroundColor: '#f1f5f9',
            padding: '36px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRight: '1px solid #e2e8f0'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '6px',
                  backgroundColor: '#15803d',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Trash2 size={24} />
              </div>
              <div>
                <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#15803d', lineHeight: 1.2 }}>
                  SWM System
                </h1>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Municipal Corporation</div>
              </div>
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>
              Smart Waste Management & Monitoring
            </h2>

            <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, marginBottom: '24px' }}>
              A centralized civic waste management platform connecting citizens, municipal administrators, and sanitary field workers to ensure clean and hygienic urban localities.
            </p>

            <div style={{ fontSize: '13px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#15803d' }} />
                <span>Geotagged waste reporting & status tracking</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#15803d' }} />
                <span>Automated ward-level sanitary worker assignment</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#15803d' }} />
                <span>Real-time GIS mapping & resolution verification</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '30px', paddingTop: '16px', borderTop: '1px solid #cbd5e1', fontSize: '12px', color: '#64748b' }}>
            Nashik Municipal Solid Waste Management Cell • Official Portal
          </div>
        </div>

        {/* Right: Login Form */}
        <div style={{ padding: '36px 32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
            Sign In to Portal
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
            Select your assigned role and log in with your credentials.
          </p>

          {error && (
            <div
              style={{
                padding: '10px 14px',
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                borderRadius: '6px',
                border: '1px solid #fca5a5',
                fontSize: '13px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div className="form-group">
              <label className="form-label">Select User Role</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  className={`role-pill ${role === 'citizen' ? 'active' : ''}`}
                  onClick={() => handleRoleChange('citizen')}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <User size={14} />
                  <span>Citizen</span>
                </button>
                <button
                  type="button"
                  className={`role-pill ${role === 'worker' ? 'active' : ''}`}
                  onClick={() => handleRoleChange('worker')}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <HardHat size={14} />
                  <span>Worker</span>
                </button>
                <button
                  type="button"
                  className={`role-pill ${role === 'admin' ? 'active' : ''}`}
                  onClick={() => handleRoleChange('admin')}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <ShieldCheck size={14} />
                  <span>Admin</span>
                </button>
              </div>
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address <span className="required">*</span>
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password <span className="required">*</span>
              </label>
              <input
                id="password"
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px 16px', marginTop: '6px' }}
            >
              <LogIn size={16} />
              <span>Login as {role.charAt(0).toUpperCase() + role.slice(1)}</span>
            </button>

            {/* Register Link */}
            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
              Are you a new resident?{' '}
              <Link to="/register" style={{ fontWeight: 600, color: '#15803d' }}>
                Register as Citizen
              </Link>
            </div>

            {/* Quick Demo Helper Hint */}
            <div style={{ marginTop: '16px', padding: '10px 12px', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '6px', fontSize: '11px', color: '#64748b' }}>
              <strong>Evaluation Note:</strong> Click any of the 3 role buttons above to auto-load demo credentials for Citizen, Worker, or Municipal Admin.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
