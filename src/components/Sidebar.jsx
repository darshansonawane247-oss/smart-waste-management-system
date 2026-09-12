import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  MapPin,
  Bell,
  User,
  Users,
  ClipboardList,
  BarChart3,
  Settings,
  CheckCircle,
  LogOut,
  AlertCircle
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinks = () => {
    if (role === 'admin') {
      return [
        { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/admin/reports', label: 'All Reports', icon: FileText },
        { to: '/admin/pending', label: 'Pending Reports', icon: AlertCircle },
        { to: '/admin/workers', label: 'Workers', icon: Users },
        { to: '/admin/assignments', label: 'Assignments', icon: ClipboardList },
        { to: '/admin/map', label: 'City Waste Map', icon: MapPin },
        { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
        { to: '/admin/settings', label: 'Settings', icon: Settings },
      ];
    } else if (role === 'worker') {
      return [
        { to: '/worker/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/worker/tasks', label: 'My Tasks', icon: ClipboardList },
        { to: '/worker/completed', label: 'Completed Tasks', icon: CheckCircle },
        { to: '/worker/profile', label: 'Profile', icon: User },
      ];
    } else {
      // Citizen
      return [
        { to: '/citizen/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/citizen/report', label: 'Report Waste', icon: PlusCircle },
        { to: '/citizen/reports', label: 'My Reports', icon: FileText },
        { to: '/citizen/map', label: 'Nearby Map', icon: MapPin },
        { to: '/citizen/notifications', label: 'Notifications', icon: Bell },
        { to: '/citizen/profile', label: 'Profile', icon: User },
      ];
    }
  };

  const links = getLinks();

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
        <div>
          <div className="sidebar-brand-title">
            {role === 'admin' ? 'NMC Municipal Admin' : role === 'worker' ? 'Sanitary Field Portal' : 'Citizen Waste Portal'}
          </div>
          <div className="sidebar-brand-sub">Nashik Municipal Corporation</div>
        </div>
      </div>

      <ul className="sidebar-menu">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => {
                  if (window.innerWidth < 900 && onClose) {
                    onClose();
                  }
                }}
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>

      <div className="sidebar-footer">
        <button
          onClick={handleLogout}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', justifyContent: 'flex-start', color: '#991b1b' }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
