import React from 'react';
import { Bell, CheckCircle2, Clock, Info } from 'lucide-react';

export const NotificationList = ({ notifications = [], onMarkRead }) => {
  if (!notifications || notifications.length === 0) {
    return (
      <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Bell size={28} style={{ opacity: 0.3, marginBottom: '8px' }} />
        <p>No notifications available at this time.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {notifications.map((n) => (
        <div
          key={n.id}
          style={{
            padding: '14px 16px',
            backgroundColor: n.read ? '#ffffff' : 'var(--bg-subtle)',
            borderRadius: 'var(--radius)',
            border: `1px solid ${n.read ? 'var(--border-color)' : 'var(--primary-border)'}`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}
        >
          <div
            style={{
              padding: '6px',
              borderRadius: '50%',
              backgroundColor: n.read ? 'var(--bg-subtle)' : 'var(--primary-light)',
              color: n.read ? 'var(--text-muted)' : 'var(--primary)',
              flexShrink: 0
            }}
          >
            <Info size={16} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ fontSize: '14px', fontWeight: n.read ? 500 : 700, color: 'var(--text-main)' }}>
                {n.title}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={11} />
                {n.date}
              </div>
            </div>
            <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.4 }}>
              {n.message}
            </div>
          </div>
          {!n.read && onMarkRead && (
            <button
              onClick={() => onMarkRead(n.id)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '11px', padding: '3px 8px' }}
              title="Mark as read"
            >
              Mark Read
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
