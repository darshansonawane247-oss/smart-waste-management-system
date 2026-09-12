import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const pickerIcon = L.divIcon({
  className: 'swm-picker-marker',
  html: `
    <div style="
      background-color: #15803d;
      width: 32px;
      height: 32px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid #ffffff;
      box-shadow: 0 3px 6px rgba(0,0,0,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 10px;
        height: 10px;
        background-color: #ffffff;
        border-radius: 50%;
        transform: rotate(45deg);
      "></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

export const LocationPickerMap = ({ initialLat = 20.0063, initialLng = 73.7635, onLocationChange }) => {
  const [position, setPosition] = useState([initialLat, initialLng]);

  const handleSelect = (lat, lng) => {
    setPosition([lat, lng]);
    if (onLocationChange) {
      onLocationChange(Number(lat.toFixed(5)), Number(lng.toFixed(5)));
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ height: '300px', width: '100%', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-dark)' }}>
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onLocationSelect={handleSelect} />
          <Marker position={position} icon={pickerIcon} />
        </MapContainer>
      </div>

      <div style={{ marginTop: '8px', display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
        <div>
          <strong>Latitude:</strong> <span style={{ color: 'var(--text-main)', fontFamily: 'monospace' }}>{position[0].toFixed(5)}</span>
        </div>
        <div>
          <strong>Longitude:</strong> <span style={{ color: 'var(--text-main)', fontFamily: 'monospace' }}>{position[1].toFixed(5)}</span>
        </div>
        <div style={{ marginLeft: 'auto', fontStyle: 'italic', fontSize: '12px' }}>
          * Click anywhere on the map to pin exact waste spot
        </div>
      </div>
    </div>
  );
};
