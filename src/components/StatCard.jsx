import React from 'react';

export const StatCard = ({ title, value, subtext, icon: Icon, color = 'green' }) => {
  return (
    <div className="stat-card">
      <div>
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        {subtext && <div className="stat-subtext">{subtext}</div>}
      </div>
      {Icon && (
        <div className="stat-icon">
          <Icon size={22} />
        </div>
      )}
    </div>
  );
};
