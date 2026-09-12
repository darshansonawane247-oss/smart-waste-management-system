import React from 'react';
import { Clock, UserCheck, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const normalized = (status || 'Pending').toLowerCase().replace(/\s+/g, '');

  let badgeClass = 'badge-pending';
  let Icon = Clock;

  if (normalized === 'assigned') {
    badgeClass = 'badge-assigned';
    Icon = UserCheck;
  } else if (normalized === 'inprogress') {
    badgeClass = 'badge-inprogress';
    Icon = RefreshCw;
  } else if (normalized === 'completed') {
    badgeClass = 'badge-completed';
    Icon = CheckCircle2;
  } else if (normalized === 'rejected') {
    badgeClass = 'badge-rejected';
    Icon = XCircle;
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <Icon size={12} />
      {status || 'Pending'}
    </span>
  );
};
