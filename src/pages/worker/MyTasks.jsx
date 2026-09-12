import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { ReportTable } from '../../components/ReportTable';
import { Filter, Search } from 'lucide-react';

export const MyTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const workerId = user?.workerId || 'W-01';
      const allReports = await api.getReports();
      const workerTasks = allReports.filter(
        (r) => r.assignedWorkerId === workerId || r.assignedWorkerId === 'W-03' || r.assignedWorkerName === user?.name
      );
      setTasks(workerTasks);
      setLoading(false);
    };
    fetchTasks();
  }, [user]);

  const filteredTasks = tasks.filter((t) => {
    const matchFilter = filter === 'All' || t.status.toLowerCase() === filter.toLowerCase();
    const matchSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="content-area">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Assigned Tasks</h1>
          <p className="page-subtitle">Field waste collection & disposal assignments</p>
        </div>
      </div>

      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 240px' }}>
          <Search size={16} color="#64748b" />
          <input
            type="text"
            className="form-control"
            placeholder="Search tasks by ID or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '6px 10px', fontSize: '13px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Filter:</span>
          <select
            className="form-control"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: 'auto', padding: '6px 10px', fontSize: '13px' }}
          >
            <option value="All">All Tasks ({tasks.length})</option>
            <option value="Assigned">Assigned (Not Started)</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Task List</h2>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Showing {filteredTasks.length} tasks
          </span>
        </div>
        <ReportTable
          reports={filteredTasks}
          viewBaseUrl="/worker/tasks"
          showCitizen={true}
          emptyMessage="No tasks found matching your filter."
        />
      </div>
    </div>
  );
};
