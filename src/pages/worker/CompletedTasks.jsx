import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { ReportTable } from '../../components/ReportTable';
import { CheckCircle2 } from 'lucide-react';

export const CompletedTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const allReports = await api.getReports();
      const completed = allReports.filter((r) => r.status === 'Completed');
      setTasks(completed);
      setLoading(false);
    };
    fetchTasks();
  }, [user]);

  return (
    <div className="content-area">
      <div className="page-header">
        <div>
          <h1 className="page-title">Completed Field Tasks</h1>
          <p className="page-subtitle">Historical record of resolved waste grievances</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} color="#15803d" />
            <h2 className="card-title">Resolved Task Roster</h2>
          </div>
          <span className="badge badge-completed">{tasks.length} cleared spots</span>
        </div>
        <ReportTable
          reports={tasks}
          viewBaseUrl="/worker/tasks"
          showCitizen={true}
          emptyMessage="No completed tasks recorded yet."
        />
      </div>
    </div>
  );
};
