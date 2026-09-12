import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { WASTE_CATEGORIES, NASHIK_AREAS } from '../../data/mockData';
import { LocationPickerMap } from '../../components/LocationPickerMap';
import { CheckCircle2, Upload, AlertCircle, ArrowLeft, Image as ImageIcon } from 'lucide-react';

const SAMPLE_WASTE_PHOTOS = [
  { label: 'Overflowing Municipal Bin', url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80' },
  { label: 'Plastic Packaging Dump', url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80' },
  { label: 'Construction Rubble & Debris', url: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=600&auto=format&fit=crop&q=80' },
  { label: 'Organic / Food Waste Mound', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80' },
  { label: 'Electronic E-Waste Pile', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80' }
];

export const ReportWaste = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [category, setCategory] = useState(WASTE_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [area, setArea] = useState(user?.area || 'Gangapur Road');
  const [locationLandmark, setLocationLandmark] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: 20.0063, lng: 73.7635 });
  const [imageUrl, setImageUrl] = useState(SAMPLE_WASTE_PHOTOS[0].url);
  const [submitting, setSubmitting] = useState(false);
  const [createdReport, setCreatedReport] = useState(null);
  const [error, setError] = useState('');

  const handleLocationChange = (lat, lng) => {
    setCoordinates({ lat, lng });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!description.trim()) {
      setError('Please provide a brief description of the waste issue.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        category,
        description,
        area,
        location: locationLandmark ? `${area}, ${locationLandmark}` : `${area}, Nashik`,
        lat: coordinates.lat,
        lng: coordinates.lng,
        imageUrl,
        citizenName: user?.name || 'Aarav Deshmukh',
        citizenEmail: user?.email || 'aarav.deshmukh@gmail.com',
        citizenPhone: user?.phone || '+91 98221 44556'
      };

      const result = await api.createReport(payload);
      setCreatedReport(result);
    } catch (err) {
      setError('Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (createdReport) {
    return (
      <div className="content-area">
        <div style={{ maxWidth: '640px', margin: '40px auto' }} className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: '40px 30px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
              Your waste report has been submitted successfully.
            </h2>

            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Nashik Municipal Corporation sanitary inspectors have received your grievance and will assign a field collection worker shortly.
            </p>

            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius)',
                padding: '16px',
                marginBottom: '28px',
                display: 'inline-block'
              }}
            >
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Assigned Tracking ID
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace', marginTop: '4px' }}>
                {createdReport.id}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <Link to={`/citizen/reports/${createdReport.id}`} className="btn btn-primary">
                View Report Status
              </Link>
              <Link to="/citizen/dashboard" className="btn btn-secondary">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-area">
      <div className="page-header">
        <div>
          <h1 className="page-title">Report Waste Issue</h1>
          <p className="page-subtitle">Submit a civic waste grievance to Nashik Municipal Corporation</p>
        </div>
        <Link to="/citizen/dashboard" className="btn btn-secondary btn-sm">
          <ArrowLeft size={14} />
          <span>Dashboard</span>
        </Link>
      </div>

      {error && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            borderRadius: '6px',
            border: '1px solid #fca5a5',
            fontSize: '13px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Waste Complaint Form</h2>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Date: {new Date().toLocaleDateString('en-IN')}</span>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Waste Category & Area */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">
                  Waste Category <span className="required">*</span>
                </label>
                <select
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  {WASTE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="form-help">Select the primary type of waste observed.</div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Municipal Ward / Area <span className="required">*</span>
                </label>
                <select
                  className="form-control"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  required
                >
                  {NASHIK_AREAS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <div className="form-help">Ward under which the problem falls.</div>
              </div>
            </div>

            {/* Landmark & Specific Street */}
            <div className="form-group">
              <label className="form-label">Street / Landmark Address</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Near KTHM College Bus Stop, Opp. State Bank"
                value={locationLandmark}
                onChange={(e) => setLocationLandmark(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">
                Description of Waste Issue <span className="required">*</span>
              </label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Describe the condition, severity, overflowing duration, stray animal menace, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Photo Upload & Sample Chooser */}
            <div className="form-group">
              <label className="form-label">Upload Waste Site Photograph</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', alignItems: 'start' }}>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="form-control"
                    style={{ marginBottom: '8px' }}
                  />
                  <div className="form-help">Upload photo from device camera or local storage.</div>

                  <div style={{ marginTop: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                      Or choose sample municipal test photo:
                    </label>
                    <select
                      className="form-control"
                      style={{ fontSize: '13px', marginTop: '4px' }}
                      onChange={(e) => setImageUrl(e.target.value)}
                    >
                      {SAMPLE_WASTE_PHOTOS.map((p, idx) => (
                        <option key={idx} value={p.url}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Image Preview
                  </div>
                  <div
                    style={{
                      height: '140px',
                      borderRadius: 'var(--radius)',
                      border: '1px solid var(--border-color)',
                      overflow: 'hidden',
                      backgroundColor: 'var(--bg-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Waste preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        <ImageIcon size={24} />
                        <div style={{ fontSize: '12px' }}>No photo selected</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Location Section with Map */}
            <div className="form-group" style={{ marginTop: '24px' }}>
              <label className="form-label">
                Geographical Location (Interactive Map)
              </label>
              <div className="form-help" style={{ marginBottom: '8px' }}>
                Click on the map or drag to set the exact geographic coordinate of the garbage spot.
              </div>
              <LocationPickerMap
                initialLat={coordinates.lat}
                initialLng={coordinates.lng}
                onLocationChange={handleLocationChange}
              />
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: '28px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Link to="/citizen/dashboard" className="btn btn-secondary">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                <Upload size={16} />
                <span>{submitting ? 'Submitting Grievance...' : 'Submit Report'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
