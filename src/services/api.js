import { getStorageData, setStorageData, KEYS, initStorage } from './storage';

// Ensure storage is initialized
initStorage();

const simulateDelay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  // REPORTS
  async getReports(filters = {}) {
    await simulateDelay();
    let reports = getStorageData(KEYS.REPORTS, []);
    if (filters.status && filters.status !== 'All') {
      reports = reports.filter((r) => r.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.category && filters.category !== 'All') {
      reports = reports.filter((r) => r.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.area && filters.area !== 'All') {
      reports = reports.filter((r) => r.area.toLowerCase() === filters.area.toLowerCase());
    }
    if (filters.citizenEmail) {
      reports = reports.filter((r) => r.citizenEmail.toLowerCase() === filters.citizenEmail.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      reports = reports.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      );
    }
    return reports;
  },

  async getReportById(id) {
    await simulateDelay();
    const reports = getStorageData(KEYS.REPORTS, []);
    return reports.find((r) => r.id === id) || null;
  },

  async createReport(data) {
    await simulateDelay();
    const reports = getStorageData(KEYS.REPORTS, []);
    
    // Generate sequential SWM ID
    const count = reports.length + 129;
    const year = new Date().getFullYear();
    const newId = `SWM-${year}-${String(count).padStart(5, '0')}`;

    const nowStr = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const newReport = {
      id: newId,
      category: data.category,
      description: data.description,
      location: data.location || `${data.area}, Nashik`,
      area: data.area || 'Panchavati',
      lat: data.lat || 20.0063,
      lng: data.lng || 73.7635,
      citizenName: data.citizenName || 'Citizen User',
      citizenEmail: data.citizenEmail || 'citizen@swm.org',
      citizenPhone: data.citizenPhone || '+91 98220 00000',
      reportedDate: nowStr,
      status: 'Pending',
      assignedWorkerId: null,
      assignedWorkerName: null,
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80',
      completionImageUrl: null,
      timeline: [
        { step: 'Reported', date: nowStr, completed: true },
        { step: 'Assigned', date: null, completed: false },
        { step: 'In Progress', date: null, completed: false },
        { step: 'Completed', date: null, completed: false }
      ],
      notes: data.notes || 'Submitted by citizen portal.'
    };

    reports.unshift(newReport);
    setStorageData(KEYS.REPORTS, reports);

    // Also push notification for admin
    const notifications = getStorageData(KEYS.NOTIFICATIONS, []);
    notifications.unshift({
      id: 'N-' + Date.now(),
      userId: 'admin@nashik-swm.gov.in',
      role: 'admin',
      title: 'New Complaint Registered',
      message: `New report ${newId} (${data.category}) logged at ${data.location || data.area}.`,
      date: nowStr,
      read: false
    });
    setStorageData(KEYS.NOTIFICATIONS, notifications);

    return newReport;
  },

  async assignWorker(reportId, workerId) {
    await simulateDelay();
    const reports = getStorageData(KEYS.REPORTS, []);
    const workers = getStorageData(KEYS.WORKERS, []);
    const worker = workers.find((w) => w.id === workerId);

    const nowStr = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const updatedReports = reports.map((r) => {
      if (r.id === reportId) {
        const updatedTimeline = r.timeline.map((t) => {
          if (t.step === 'Assigned') return { ...t, date: nowStr, completed: true };
          return t;
        });
        return {
          ...r,
          status: 'Assigned',
          assignedWorkerId: workerId,
          assignedWorkerName: worker ? worker.name : 'Sanitary Worker',
          timeline: updatedTimeline,
          notes: `Assigned to ${worker ? worker.name : 'worker'} on ${nowStr}.`
        };
      }
      return r;
    });

    setStorageData(KEYS.REPORTS, updatedReports);

    // Create notifications for citizen & worker
    const notifications = getStorageData(KEYS.NOTIFICATIONS, []);
    const targetReport = reports.find((r) => r.id === reportId);

    if (targetReport) {
      notifications.unshift({
        id: 'N-' + Date.now(),
        userId: targetReport.citizenEmail,
        role: 'citizen',
        title: 'Worker Assigned',
        message: `Your report ${reportId} has been assigned to ${worker ? worker.name : 'sanitary team'}.`,
        date: nowStr,
        read: false
      });
      notifications.unshift({
        id: 'N-' + (Date.now() + 1),
        userId: workerId,
        role: 'worker',
        title: 'New Task Assigned',
        message: `Task ${reportId} (${targetReport.category}) at ${targetReport.location} has been assigned to you.`,
        date: nowStr,
        read: false
      });
      setStorageData(KEYS.NOTIFICATIONS, notifications);
    }

    return updatedReports.find((r) => r.id === reportId);
  },

  async updateReportStatus(reportId, newStatus, customNotes) {
    await simulateDelay();
    const reports = getStorageData(KEYS.REPORTS, []);
    const nowStr = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const updatedReports = reports.map((r) => {
      if (r.id === reportId) {
        const updatedTimeline = r.timeline.map((t) => {
          if (t.step.toLowerCase() === newStatus.toLowerCase()) {
            return { ...t, date: nowStr, completed: true };
          }
          if (newStatus === 'Rejected' && t.step === 'Completed') {
            return { step: 'Rejected', date: nowStr, completed: true };
          }
          return t;
        });

        return {
          ...r,
          status: newStatus,
          timeline: updatedTimeline,
          notes: customNotes || `Status changed to ${newStatus} on ${nowStr}.`
        };
      }
      return r;
    });

    setStorageData(KEYS.REPORTS, updatedReports);
    return updatedReports.find((r) => r.id === reportId);
  },

  async completeTaskByWorker(reportId, completionImageUrl, completionNotes) {
    await simulateDelay();
    const reports = getStorageData(KEYS.REPORTS, []);
    const nowStr = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const updatedReports = reports.map((r) => {
      if (r.id === reportId) {
        const updatedTimeline = r.timeline.map((t) => {
          if (t.step === 'Completed') return { ...t, date: nowStr, completed: true };
          if (t.step === 'In Progress' && !t.completed) return { ...t, date: nowStr, completed: true };
          return t;
        });

        return {
          ...r,
          status: 'Completed',
          completionImageUrl: completionImageUrl || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80',
          timeline: updatedTimeline,
          notes: completionNotes || `Waste cleared and verified on ${nowStr}.`
        };
      }
      return r;
    });

    setStorageData(KEYS.REPORTS, updatedReports);

    // Notify citizen
    const targetReport = reports.find((r) => r.id === reportId);
    if (targetReport) {
      const notifications = getStorageData(KEYS.NOTIFICATIONS, []);
      notifications.unshift({
        id: 'N-' + Date.now(),
        userId: targetReport.citizenEmail,
        role: 'citizen',
        title: 'Waste Collected',
        message: `Your waste report ${reportId} has been marked as completed. Thank you for keeping our city clean!`,
        date: nowStr,
        read: false
      });
      setStorageData(KEYS.NOTIFICATIONS, notifications);
    }

    return updatedReports.find((r) => r.id === reportId);
  },

  // WORKERS
  async getWorkers() {
    await simulateDelay();
    return getStorageData(KEYS.WORKERS, []);
  },

  async getTasksForWorker(workerId) {
    await simulateDelay();
    const reports = getStorageData(KEYS.REPORTS, []);
    return reports.filter((r) => r.assignedWorkerId === workerId);
  },

  // NOTIFICATIONS
  async getNotifications(role, userId) {
    await simulateDelay();
    const notifications = getStorageData(KEYS.NOTIFICATIONS, []);
    return notifications.filter((n) => n.role === role || (userId && n.userId === userId));
  },

  async markNotificationRead(id) {
    await simulateDelay();
    const notifications = getStorageData(KEYS.NOTIFICATIONS, []);
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setStorageData(KEYS.NOTIFICATIONS, updated);
    return true;
  },

  // STATISTICS
  async getStatistics() {
    await simulateDelay();
    const reports = getStorageData(KEYS.REPORTS, []);
    const total = reports.length;
    const pending = reports.filter((r) => r.status === 'Pending').length;
    const assigned = reports.filter((r) => r.status === 'Assigned').length;
    const inProgress = reports.filter((r) => r.status === 'In Progress').length;
    const completed = reports.filter((r) => r.status === 'Completed').length;
    const rejected = reports.filter((r) => r.status === 'Rejected').length;

    // Category count breakdown
    const categoryCounts = {};
    reports.forEach((r) => {
      categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
    });

    // Area count breakdown
    const areaCounts = {};
    reports.forEach((r) => {
      areaCounts[r.area] = (areaCounts[r.area] || 0) + 1;
    });

    return {
      total,
      pending,
      assigned,
      inProgress,
      completed,
      rejected,
      categoryCounts,
      areaCounts
    };
  }
};
