import React, { useState } from 'react';
import axios from 'axios';
import './ObservationForm.css'; // We'll create this for better styling

function ObservationForm() {
    const [formData, setFormData] = useState({
        type: 'water_quality',
        description: '',
        latitude: '',
        longitude: '',
        // Common dynamic fields
        ph: '',
        temperature: '',
        dissolved_oxygen: '',
        turbidity: '',
        species_name: '',
        count: '',
        behavior: '',
        height: '',
        flowering_status: 'no',
        aqi: '',
        pm25: '',
        project_id: ''
    });

    const [locationStatus, setLocationStatus] = useState('');

    const [projects, setProjects] = useState([]);

    // Fetch active projects on mount
    React.useEffect(() => {
        const fetchProjects = async () => {
            try {
                const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
                const res = await axios.get(`${API_URL}/api/projects`);
                const activeProjects = res.data.filter(p => p.status === 'active');
                setProjects(activeProjects);
            } catch (err) {
                console.error('Failed to fetch projects', err);
            }
        };
        fetchProjects();
    }, []);

    const protocols = {
        water_quality: {
            label: 'Water Quality',
            fields: ['ph', 'temperature', 'dissolved_oxygen', 'turbidity']
        },
        wildlife: {
            label: 'Wildlife Sighting',
            fields: ['species_name', 'count', 'behavior']
        },
        plant: {
            label: 'Plant Observation',
            fields: ['species_name', 'height', 'flowering_status']
        },
        air_quality: {
            label: 'Air Quality',
            fields: ['aqi', 'pm25']
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'project_id') {
            const selectedProject = projects.find(p => p.id.toString() === value.toString());
            if (selectedProject && selectedProject.protocols) {
                try {
                    // Handle both stringified JSON and object (if axios parsed it)
                    const proto = typeof selectedProject.protocols === 'string'
                        ? JSON.parse(selectedProject.protocols)
                        : selectedProject.protocols;

                    if (proto.type && protocols[proto.type]) {
                        setFormData(prev => ({
                            ...prev,
                            [name]: value,
                            type: proto.type
                        }));
                        return;
                    }
                } catch (err) {
                    console.error('Error parsing project protocols:', err);
                }
            }
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const getGPS = () => {
        setLocationStatus('Locating...');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;

                    // Simple India Bounding Box Check
                    if (latitude < 6 || latitude > 37 || longitude < 68 || longitude > 97) {
                        setLocationStatus('Warning: Location appears to be outside India.');
                    } else {
                        setLocationStatus('Location acquired! (India)');
                    }

                    setFormData({
                        ...formData,
                        latitude: latitude,
                        longitude: longitude
                    });
                },
                (error) => {
                    setLocationStatus('Error: ' + error.message);
                }
            );
        } else {
            setLocationStatus('Geolocation not supported.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.latitude || !formData.longitude) {
            alert('Please capture your GPS location before submitting.');
            return;
        }

        // Extract measurements based on protocol
        const measurements = {};
        const currentFields = protocols[formData.type].fields;

        currentFields.forEach(field => {
            if (formData[field]) {
                measurements[field] = formData[field];
            }
        });

        const observation = {
            project_id: formData.project_id,
            type: formData.type,
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
            description: formData.description,
            measurements: measurements,
            photo_urls: []
        };

        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

            if (navigator.onLine) {
                await axios.post(`${API_URL}/api/observations`, observation);
                alert('Observation submitted successfully!');
            } else {
                saveObservationLocally(observation);
                alert('Offline: Observation saved locally. Will sync when online.');
            }
            // Reset description and measurements, keep loc/type because users might make multiple obs at same spot
            setFormData(prev => ({ ...prev, description: '', ...Object.fromEntries(currentFields.map(f => [f, ''])) }));
        } catch (error) {
            console.error('Error submitting:', error);
            // Improved error handling
            const msg = error.response?.data?.error || 'Failed to submit. check console.';
            alert(`Error: ${msg}`);
        }
    };

    const saveObservationLocally = (observation) => {
        const pending = JSON.parse(localStorage.getItem('pendingObservations') || '[]');
        pending.push({ ...observation, timestamp: new Date().toISOString() });
        localStorage.setItem('pendingObservations', JSON.stringify(pending));
        window.addEventListener('online', syncPendingObservations);
    };

    const syncPendingObservations = async () => {
        const pending = JSON.parse(localStorage.getItem('pendingObservations') || '[]');
        if (pending.length === 0) return;

        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        for (const obs of pending) {
            try {
                await axios.post(`${API_URL}/api/observations`, obs);
            } catch (e) { console.error('Sync failed', e); }
        }
        localStorage.removeItem('pendingObservations');
        alert('Synced offline observations!');
    };

    const renderField = (field) => {
        switch (field) {
            case 'ph': return <input type="number" step="0.1" name="ph" placeholder="pH (0-14)" value={formData.ph} onChange={handleInputChange} />;
            case 'temperature': return <input type="number" step="0.1" name="temperature" placeholder="Temp (°C)" value={formData.temperature} onChange={handleInputChange} />;
            case 'dissolved_oxygen': return <input type="number" step="0.1" name="dissolved_oxygen" placeholder="DO (mg/L)" value={formData.dissolved_oxygen} onChange={handleInputChange} />;
            case 'turbidity': return <input type="number" step="0.1" name="turbidity" placeholder="Turbidity (NTU)" value={formData.turbidity} onChange={handleInputChange} />;
            case 'species_name': return <input type="text" name="species_name" placeholder="Species Name" value={formData.species_name} onChange={handleInputChange} />;
            case 'count': return <input type="number" name="count" placeholder="Count" value={formData.count} onChange={handleInputChange} />;
            case 'behavior': return <input type="text" name="behavior" placeholder="Behavior (e.g., feeding)" value={formData.behavior} onChange={handleInputChange} />;
            case 'height': return <input type="number" step="0.1" name="height" placeholder="Height (cm)" value={formData.height} onChange={handleInputChange} />;
            case 'flowering_status':
                return (
                    <select name="flowering_status" value={formData.flowering_status} onChange={handleInputChange}>
                        <option value="no">Not Flowering</option>
                        <option value="yes">Flowering</option>
                        <option value="fruiting">Fruiting</option>
                    </select>
                );
            case 'aqi': return <input type="number" name="aqi" placeholder="AQI" value={formData.aqi} onChange={handleInputChange} />;
            case 'pm25': return <input type="number" step="0.1" name="pm25" placeholder="PM2.5 (µg/m³)" value={formData.pm25} onChange={handleInputChange} />;
            default: return null;
        }
    };

    return (
        <div className="observation-form-container">
            <h2 className="form-title">New Observation</h2>
            <form onSubmit={handleSubmit} className="observation-form">

                <div className="form-group">
                    <label>Select Project</label>
                    <select name="project_id" value={formData.project_id} onChange={handleInputChange} className="form-control" required>
                        <option value="">-- Choose a Project --</option>
                        {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.title} ({p.category || 'General'})</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Protocol / Observation Type</label>
                    <select name="type" value={formData.type} onChange={handleInputChange} className="form-control">
                        {Object.entries(protocols).map(([key, proto]) => (
                            <option key={key} value={key}>{proto.label}</option>
                        ))}
                    </select>
                </div>

                <div className="form-section">
                    <h3>Location</h3>
                    <div className="location-controls" style={{ marginBottom: '15px' }}>
                        <button type="button" onClick={getGPS} className="btn-secondary">📍 Capture Live GPS</button>
                        <span className="location-status" style={{ marginLeft: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{locationStatus}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Latitude</label>
                            <input
                                type="number"
                                step="any"
                                name="latitude"
                                value={formData.latitude}
                                onChange={handleInputChange}
                                placeholder="e.g. 28.6139"
                                required
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Longitude</label>
                            <input
                                type="number"
                                step="any"
                                name="longitude"
                                value={formData.longitude}
                                onChange={handleInputChange}
                                placeholder="e.g. 77.2090"
                                required
                            />
                        </div>
                    </div>
                    <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '5px' }}>
                        Enter coordinates manually or use the button above to autofill.
                    </small>
                </div>

                <div className="form-section">
                    <h3>Data Collection: {protocols[formData.type].label}</h3>
                    <div className="dynamic-fields">
                        {protocols[formData.type].fields.map(field => (
                            <div key={field} className="form-group">
                                <label>{field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
                                {renderField(field)}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Description / Notes</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Additional details..."
                    />
                </div>

                <button type="submit" className="btn-primary submit-btn">Submit Observation</button>
            </form>
        </div>
    );
}

export default ObservationForm;
