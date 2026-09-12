import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';

// Helper to create colored clean SVG municipal pins
const createCustomPin = (status) => {
  let color = '#d97706'; // pending amber
  const s = (status || '').toLowerCase();
  if (s === 'assigned') color = '#4f46e5';
  if (s === 'in progress') color = '#0284c7';
  if (s === 'completed') color = '#16a34a';
  if (s === 'rejected') color = '#dc2626';

  const html = `
    <div style="
      background-color: ${color};
      width: 26px;
      height: 26px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 2px solid #ffffff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 8px;
        height: 8px;
        background-color: #ffffff;
        border-radius: 50%;
        transform: rotate(45deg);
      "></div>
    </div>
  `;

  return L.divIcon({
    className: 'swm-custom-marker',
    html,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -26]
  });
};

// Component to dynamically fit bounds or re-center
function MapCenterController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 13);
    }
  }, [center, zoom, map]);
  return null;
}

export const MapView = ({ reports = [], center = [20.0063, 73.78], zoom = 12, height = '400px', viewBaseUrl = '/citizen/reports' }) => {
  return (
    <div style={{ height, width: '100%', position: 'relative', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <MapCenterController center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {reports.map((report) => {
          if (!report.lat || !report.lng) return null;
          return (
            <Marker
              key={report.id}
              position={[report.lat, report.lng]}
              icon={createCustomPin(report.status)}
            >
              <Popup>
                <div style={{ minWidth: '180px', padding: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: '#1e293b' }}>{report.id}</span>
                    <StatusBadge status={report.status} />
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#15803d', marginBottom: '4px' }}>
                    {report.category}
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569', marginBottom: '8px' }}>
                    📍 {report.location}
                  </div>
                  <Link
                    to={`${viewBaseUrl}/${report.id}`}
                    style={{
                      display: 'inline-block',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#15803d',
                      textDecoration: 'underline'
                    }}
                  >
                    View Details →
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '8px 12px',
          borderRadius: '4px',
          border: '1px solid #cbd5e1',
          zIndex: 1000,
          fontSize: '11px',
          display: 'flex',
          gap: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#d97706' }} />
          <span>Pending</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#0284c7' }} />
          <span>In Progress</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
          <span>Completed</span>
        </div>
      </div>
    </div>
  );
};
