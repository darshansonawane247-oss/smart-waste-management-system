import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trash2, Menu, Bell, LogOut, User } from 'lucide-react';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, role, logout, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="btn btn-secondary btn-sm"
          style={{ padding: '6px 8px', display: 'flex', alignItems: 'center' }}
          onClick={onToggleSidebar}
          title="Toggle Navigation Menu"
        >
          <Menu size={18} />
        </button>

        <Link to={`/${role || 'citizen'}/dashboard`} className="navbar-brand">
          <Trash2 size={22} color="#15803d" />
          <span>SWM — Smart Waste Management</span>
        </Link>
      </div>

      <div className="navbar-right">
        {/* Role Switcher Pill for Quick Evaluation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Role:</span>
          <select
            value={role || 'citizen'}
            onChange={(e) => {
              const newRole = e.target.value;
              switchRole(newRole);
              navigate(`/${newRole}/dashboard`);
            }}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '4px',
              border: '1px solid var(--border-dark)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              cursor: 'pointer'
            }}
          >
            <option value="citizen">Citizen</option>
            <option value="worker">Worker</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Notifications Icon */}
        <Link
          to={role === 'citizen' ? '/citizen/notifications' : role === 'admin' ? '/admin/notifications' : '/worker/notifications'}
          className="btn btn-secondary btn-sm"
          style={{ padding: '6px 8px', position: 'relative' }}
          title="Notifications"
        >
          <Bell size={16} />
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#ef4444'
            }}
          />
        </Link>

        {/* User Info */}
        {user && (
          <div className="user-profile-badge">
            <div className="user-avatar-circle">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>{user.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                {user.role} {user.area ? `• ${user.area}` : ''}
              </div>
            </div>
          </div>
        )}

        <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Logout">
          <LogOut size={15} />
          <span style={{ display: 'none', sm: 'inline' }}>Logout</span>
        </button>
      </div>
    </header>
  );
};
