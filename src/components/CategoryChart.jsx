import React from 'react';

export const CategoryChart = ({ categoryCounts = {} }) => {
  const entries = Object.entries(categoryCounts);
  const total = entries.reduce((sum, [, val]) => sum + val, 0) || 1;

  // Sort descending by count
  entries.sort((a, b) => b[1] - a[1]);

  return (
    <div style={{ padding: '8px 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {entries.map(([category, count]) => {
          const pct = Math.round((count / total) * 100);
          return (
            <div key={category}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px' }}>
                <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{category}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                  <strong>{count}</strong> reports ({pct}%)
                </span>
              </div>
              <div
                style={{
                  height: '10px',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: '5px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: '100%',
                    backgroundColor: 'var(--primary)',
                    borderRadius: '5px',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
        <span>Total Logged Categories: {entries.length}</span>
        <span>Aggregated Reports: {total}</span>
      </div>
    </div>
  );
};
