import React, { useState } from 'react';
import { resetStorageToDefaults } from '../../services/storage';
import { Settings as SettingsIcon, RotateCcw, CheckCircle, Save } from 'lucide-react';

export const Settings = () => {
  const [resetSuccess, setResetSuccess] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleResetData = () => {
    if (window.confirm('Reset all mock data to initial factory state?')) {
      resetStorageToDefaults();
      setResetSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="content-area">
      <div className="page-header">
        <div>
          <h1 className="page-title">Department Settings</h1>
          <p className="page-subtitle">Nashik Municipal Solid Waste Management Cell Configuration</p>
        </div>
      </div>

      <div style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Municipal Agency Parameters</h2>
          </div>
          <div className="card-body">
            {saved && (
              <div style={{ padding: '10px 14px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius)', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} />
                <span>Department configuration saved successfully.</span>
              </div>
            )}
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Municipal Authority Name</label>
                <input type="text" className="form-control" defaultValue="Nashik Municipal Corporation (NMC)" />
              </div>
              <div className="form-group">
                <label className="form-label">Toll-Free Grievance Helpline</label>
                <input type="text" className="form-control" defaultValue="1800-233-0244 / 0253-2575631" />
              </div>
              <div className="form-group">
                <label className="form-label">Standard Resolution SLA Window (Hours)</label>
                <input type="number" className="form-control" defaultValue={24} />
                <div className="form-help">Maximum target time to dispatch and resolve roadside waste complaints.</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Save size={14} />
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Demo Reset Panel */}
        <div className="card" style={{ borderColor: '#fca5a5' }}>
          <div className="card-header" style={{ backgroundColor: '#fff5f5' }}>
            <h2 className="card-title" style={{ color: '#991b1b' }}>Demo State Reset</h2>
          </div>
          <div className="card-body">
            <p style={{ fontSize: '13px', color: '#475569', marginBottom: '14px' }}>
              Reset the localStorage database back to initial seed data (useful for demonstration, college viva, or testing after filing sample reports).
            </p>
            {resetSuccess && (
              <div style={{ fontSize: '13px', color: 'var(--primary)', marginBottom: '12px' }}>
                Resetting and refreshing data...
              </div>
            )}
            <button onClick={handleResetData} className="btn btn-secondary btn-sm" style={{ color: '#dc2626', borderColor: '#fca5a5' }}>
              <RotateCcw size={14} />
              <span>Reset Database to Initial Seeds</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
