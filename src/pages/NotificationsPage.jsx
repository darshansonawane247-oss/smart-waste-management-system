import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { NotificationList } from '../components/NotificationList';
import { Bell, CheckCheck } from 'lucide-react';

export const NotificationsPage = () => {
  const { user, role } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    setLoading(true);
    const data = await api.getNotifications(role, user?.email || user?.workerId);
    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, [role, user]);

  const handleMarkRead = async (id) => {
    await api.markNotificationRead(id);
    loadNotifications();
  };

  const handleMarkAllRead = async () => {
    for (const n of notifications) {
      if (!n.read) await api.markNotificationRead(n.id);
    }
    loadNotifications();
  };

  return (
    <div className="content-area">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">Alerts, dispatch updates, and resolution notices</p>
        </div>
        {notifications.some((n) => !n.read) && (
          <button onClick={handleMarkAllRead} className="btn btn-secondary btn-sm">
            <CheckCheck size={14} />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={16} color="#15803d" />
            <h2 className="card-title">Recent Alerts</h2>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {notifications.filter((n) => !n.read).length} unread
          </span>
        </div>
        <div className="card-body">
          <NotificationList notifications={notifications} onMarkRead={handleMarkRead} />
        </div>
      </div>
    </div>
  );
};
