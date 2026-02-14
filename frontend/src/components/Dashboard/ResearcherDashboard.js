import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function ResearcherDashboard() {
    const [stats, setStats] = useState({
        totalObservations: 0,
        pendingReview: 0,
        flagged: 0
    });
    const [observations, setObservations] = useState([]);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

            // Parallel fetch
            const [obsRes, projRes] = await Promise.all([
                axios.get(`${API_URL}/api/observations`),
                axios.get(`${API_URL}/api/projects`)
            ]);

            const obs = obsRes.data;
            setObservations(obs);
            setProjects(projRes.data);

            setStats({
                totalObservations: obs.length,
                pendingReview: obs.filter(o => o.status === 'pending').length,
                flagged: obs.filter(o => o.status === 'needs_review').length
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };



    const updateStatus = async (id, newStatus) => {
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            await axios.patch(`${API_URL}/api/observations/${id}/status`, { status: newStatus });
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status.');
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Researcher Portal</h1>
                <p>Manage projects and review quality assurance flags.</p>
                <div style={{ marginTop: '1rem' }}>
                    <Link to="/data-tools" className="btn-secondary" style={{ display: 'inline-block', textDecoration: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--border-glass)', padding: '10px 20px', borderRadius: '50px' }}>
                        📊 Open Data Analysis Lab
                    </Link>
                </div>
            </header>

            <section className="stats-grid">
                <div className="stat-card">
                    <h3>{stats.totalObservations}</h3>
                    <p>Total Data Points</p>
                </div>
                <div className="stat-card">
                    <h3>{stats.flagged}</h3>
                    <p>Flagged Issues</p>
                </div>
                <div className="stat-card">
                    <h3>{observations.filter(o => o.status === 'pending').length}</h3>
                    <p>Pending Review</p>
                </div>
            </section>

            {/* NEW: Active Projects Section */}
            <section className="dashboard-section" style={{ marginTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2>Active Projects</h2>
                    <Link to="/create-project" className="btn-primary">+ Launch New Project</Link>
                </div>

                {projects.length === 0 ? (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '30px' }}>
                        <p className="text-muted">No projects found. Launch your first initiative!</p>
                    </div>
                ) : (
                    <div className="projects-grid">
                        {projects.map(project => (
                            <div key={project.id} className="project-card">
                                <div style={{ height: '140px', overflow: 'hidden', borderRadius: '4px 4px 0 0', backgroundColor: '#cbd5e1' }}>
                                    <img
                                        src={project.image_url || 'https://images.unsplash.com/photo-1501854140884-074cf2a2a120?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                                        alt={project.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1501854140884-074cf2a2a120?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'; }}
                                    />
                                </div>
                                <div className="project-content">
                                    <span className="badge-category">{project.category || 'General'}</span>
                                    <h3>{project.title}</h3>
                                    <p>{project.short_description || project.description.substring(0, 100) + '...'}</p>
                                    <div style={{ marginTop: '10px' }}>
                                        <span className={`status-badge ${project.status}`}>{project.status}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <div className="dashboard-split" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginTop: '2rem' }}>

                {/* Data Review Section */}
                <section className="dashboard-section">
                    <h2>Data Quality Review (Flagged)</h2>
                    <div className="review-list">
                        {observations.filter(o => o.status === 'needs_review').length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                <p>✅ No issues flagged. All data looks good!</p>
                            </div>
                        ) : (
                            observations.filter(o => o.status === 'needs_review').map(obs => (
                                <div key={obs.id} className="review-item">
                                    <div className="review-header">
                                        <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)', textTransform: 'uppercase' }}>{obs.type}</strong>
                                        <span className="review-badge">Needs Review</span>
                                    </div>
                                    <p style={{ margin: '0 0 10px 0', color: 'var(--text-main)' }}>{obs.description}</p>
                                    <div className="review-measurements">
                                        <code>{JSON.stringify(obs.measurements)}</code>
                                    </div>
                                    <p className="quality-flag">⚠️ Quality Flags Detected</p>
                                    <div className="actions">
                                        <button onClick={() => updateStatus(obs.id, 'approved')} className="btn-verify">Approve</button>
                                        <button onClick={() => updateStatus(obs.id, 'rejected')} className="btn-reject">Reject</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ResearcherDashboard;
