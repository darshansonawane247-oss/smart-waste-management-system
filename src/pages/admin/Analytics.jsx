import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { CategoryChart } from '../../components/CategoryChart';
import { BarChart3, TrendingUp, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export const Analytics = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await api.getStatistics();
      setStats(data);
    };
    fetchStats();
  }, []);

  const resolutionRate = stats?.total
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  return (
    <div className="content-area">
      <div className="page-header">
        <div>
          <h1 className="page-title">Municipal Waste Analytics</h1>
          <p className="page-subtitle">Civic performance metrics and waste distribution statistics</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Resolution Rate"
          value={`${resolutionRate}%`}
          subtext="Resolved vs total logged"
          icon={TrendingUp}
        />
        <StatCard
          title="Total Resolved"
          value={stats?.completed || 0}
          subtext="Cleared waste sites"
          icon={CheckCircle2}
        />
        <StatCard
          title="Pending Action"
          value={stats?.pending || 0}
          subtext="Awaiting dispatch"
          icon={Clock}
        />
        <StatCard
          title="Rejected / Invalid"
          value={stats?.rejected || 0}
          subtext="Duplicate or false reports"
          icon={AlertTriangle}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Waste Classification Breakdown</h2>
          </div>
          <div className="card-body">
            <CategoryChart categoryCounts={stats?.categoryCounts || {}} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Ward-Wise Distribution</h2>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(stats?.areaCounts || {}).map(([area, count]) => {
                const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={area}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 500 }}>{area} Ward</span>
                      <span style={{ color: 'var(--text-muted)' }}>{count} complaints ({pct}%)</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#0284c7' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
