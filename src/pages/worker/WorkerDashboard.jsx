import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { ReportTable } from '../../components/ReportTable';
import { ClipboardList, Clock, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';

export const WorkerDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const workerId = user?.workerId || 'W-01';
      const allReports = await api.getReports();
      // Tasks assigned to this worker (or default worker W-01)
      const workerTasks = allReports.filter(
        (r) => r.assignedWorkerId === workerId || r.assignedWorkerId === 'W-03' || r.assignedWorkerName === user?.name
      );
      setTasks(workerTasks);
      setLoading(false);
    };
    fetchTasks();
  }, [user]);

  const assignedCount = tasks.filter((t) => t.status === 'Assigned').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const totalTasks = tasks.length;

  const activeTasks = tasks.filter((t) => t.status !== 'Completed');

  return (
    <div className="content-area">
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome, {user?.name || 'Ramesh Shinde'}</h1>
          <p className="page-subtitle">
            Sanitary Field Operations • Employee ID: {user?.employeeId || 'NMC-SAN-401'} ({user?.assignedArea || 'CIDCO'} Ward)
          </p>
        </div>
        <Link to="/worker/tasks" className="btn btn-primary btn-sm">
          <ClipboardList size={15} />
          <span>My Field Tasks</span>
        </Link>
      </div>

      {/* 4 Metrics */}
      <div className="stats-grid">
        <StatCard
          title="Assigned Tasks"
          value={totalTasks}
          subtext="Total allocated to you"
          icon={ClipboardList}
        />
        <StatCard
          title="Pending Pickup"
          value={assignedCount}
          subtext="Not yet started"
          icon={Clock}
        />
        <StatCard
          title="In Progress"
          value={inProgressCount}
          subtext="Active in-field collection"
          icon={RefreshCw}
        />
        <StatCard
          title="Completed"
          value={completedCount}
          subtext="Cleared and verified"
          icon={CheckCircle2}
        />
      </div>

      {/* Active Tasks To Action */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Pending & In-Progress Field Tasks</h2>
          <Link to="/worker/tasks" className="btn btn-secondary btn-sm">
            <span>View All</span>
            <ArrowRight size={13} />
          </Link>
        </div>
        <ReportTable
          reports={activeTasks}
          viewBaseUrl="/worker/tasks"
          showCitizen={true}
          emptyMessage="Great job! You have no pending waste collection tasks assigned right now."
        />
      </div>
    </div>
  );
};
