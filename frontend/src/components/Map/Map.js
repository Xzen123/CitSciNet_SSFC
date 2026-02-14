import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import './Map.css';
import './Map.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const createIcon = (color) => new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const icons = {
    water_quality: createIcon('blue'),
    wildlife: createIcon('green'),
    plant: createIcon('gold'),
    air_quality: createIcon('red'),
    default: createIcon('grey')
};

function LocationMarker() {
    const map = useMap();
    const [position, setPosition] = useState(null);

    useEffect(() => {
        map.locate().on("locationfound", function (e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        });
    }, [map]);

    return position === null ? null : (
        <Marker position={position} icon={icons.default}>
            <Popup>You are here</Popup>
        </Marker>
    );
}

const FilterBadge = ({ label, count, color, active, onClick }) => (
    <button
        className={`filter-badge ${active ? 'active' : ''}`}
        onClick={onClick}
        style={{ '--badge-color': color }}
    >
        <span className="dot" style={{ background: color }}></span>
        {label}
        <span className="count">{count}</span>
    </button>
);

function MapView({ height }) {
    const [observations, setObservations] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedObs, setSelectedObs] = useState(null);

    useEffect(() => {
        const fetchObservations = async () => {
            try {
                const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
                const response = await axios.get(`${API_URL}/api/observations`);
                setObservations(response.data);
            } catch (error) {
            }
        };
        fetchObservations();
    }, []);

    const filteredObs = useMemo(() => {
        if (activeFilter === 'all') return observations;
        return observations.filter(obs => obs.type === activeFilter);
    }, [observations, activeFilter]);

    const stats = useMemo(() => {
        const counts = { all: observations.length, water_quality: 0, wildlife: 0, plant: 0, air_quality: 0 };
        observations.forEach(obs => {
            if (counts[obs.type] !== undefined) counts[obs.type]++;
        });
        return counts;
    }, [observations]);

    return (
        <div className="map-explorer-container" style={{ height: height || 'calc(100vh - 80px)' }}>
            {/* Sidebar Overlay */}
            <div className="map-sidebar glass-panel">
                <div className="sidebar-header">
                    <h2>Data Explorer</h2>
                    <p>Real-time citizen science data.</p>
                </div>

                <div className="filter-group">
                    <h3>Filters</h3>
                    <div className="filter-list">
                        <FilterBadge label="All Data" count={stats.all} color="#94a3b8" active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} />
                        <FilterBadge label="Water" count={stats.water_quality} color="#3b82f6" active={activeFilter === 'water_quality'} onClick={() => setActiveFilter('water_quality')} />
                        <FilterBadge label="Wildlife" count={stats.wildlife} color="#22c55e" active={activeFilter === 'wildlife'} onClick={() => setActiveFilter('wildlife')} />
                        <FilterBadge label="Plants" count={stats.plant} color="#eab308" active={activeFilter === 'plant'} onClick={() => setActiveFilter('plant')} />
                        <FilterBadge label="Air" count={stats.air_quality} color="#ef4444" active={activeFilter === 'air_quality'} onClick={() => setActiveFilter('air_quality')} />
                    </div>
                </div>

                <div className="recent-feed">
                    <h3>Recent Activity</h3>
                    <div className="feed-list">
                        {filteredObs.slice(0, 5).map(obs => (
                            <div key={obs.id} className="feed-item" onClick={() => setSelectedObs(obs)}>
                                <div className="feed-icon" style={{ background: obs.type === 'water_quality' ? '#3b82f6' : obs.type === 'wildlife' ? '#22c55e' : obs.type === 'plant' ? '#eab308' : '#ef4444' }}>
                                    {obs.type === 'water_quality' ? '💧' : obs.type === 'wildlife' ? '🐾' : obs.type === 'plant' ? '🌿' : '💨'}
                                </div>
                                <div className="feed-info">
                                    <strong>{obs.type.replace('_', ' ')}</strong>
                                    <small>{new Date(obs.created_at).toLocaleDateString()}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Map Area */}
            <div className="map-view-wrapper">
                <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                    <LocationMarker />
                    {filteredObs.map((obs) => (
                        <Marker
                            key={obs.id}
                            position={[obs.latitude, obs.longitude]}
                            icon={icons[obs.type] || icons.default}
                        >
                            <Popup className="glass-popup">
                                <div className="popup-content">
                                    <h3>{obs.type.replace('_', ' ').toUpperCase()}</h3>
                                    <p>{obs.description}</p>
                                    {obs.image_url && <img src={obs.image_url} alt="Observation" style={{ width: '100%', borderRadius: '8px', marginTop: '10px' }} />}
                                    <div className="popup-measurements">
                                        {obs.measurements && Object.entries(obs.measurements).map(([key, val]) => (
                                            <div key={key}><strong>{key}:</strong> {val}</div>
                                        ))}
                                    </div>
                                    <small>Reported: {new Date(obs.created_at).toLocaleDateString()}</small>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}

export default MapView;
