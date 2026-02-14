import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const EducatorDashboard = () => {
    const [activities] = useState([
        {
            id: 1,
            title: "Local Water Health",
            subject: "Chemistry & Biology",
            level: "Grade 9-12",
            description: "Investigate pH and turbidity in local streams to assess habitat suitability for macroinvertebrates.",
            status: "Active"
        },
        {
            id: 2,
            title: "Urban Heat Island Effect",
            subject: "Physics & Earth Science",
            level: "Grade 6-8",
            description: "Map temperature variations across paved vs. green surfaces in your school neighborhood.",
            status: "Coming Soon"
        }
    ]);


    const [loading, setLoading] = useState(false);

    // Fetch real datasets (mocked for now or strictly real observations)
    const handleDownloadData = async () => {
        setLoading(true);
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await axios.get(`${API_URL}/api/observations`);

            // Convert JSON to CSV
            const items = response.data;
            const replacer = (key, value) => value === null ? '' : value;
            const header = Object.keys(items[0]);
            const csv = [
                header.join(','), // header row first
                ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
            ].join('\r\n');

            // Download
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('hidden', '');
            a.setAttribute('href', url);
            a.setAttribute('download', 'citscinet_data.csv');
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error downloading data", error);
            alert("Failed to download dataset.");
        }
        setLoading(false);
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Student Learning Hub</h1>
                <p>Explore real-world science through guided activities and data analysis.</p>
            </header>

            {/* Guided Activities Section */}
            <section className="dashboard-section">
                <h2>📚 Guided Curriculum Activities</h2>
                <div className="projects-grid">
                    {activities.map(activity => (
                        <div key={activity.id} className="project-card">
                            <div className="project-content">
                                <span className="category-badge">{activity.subject}</span>
                                <h3>{activity.title}</h3>
                                <p className="text-muted">{activity.level}</p>
                                <p>{activity.description}</p>
                                {activity.status === 'Active' ? (
                                    <Link to={`/activity/${activity.id}`} className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                                        Start Activity
                                    </Link>
                                ) : (
                                    <button className="btn-primary" disabled style={{ opacity: 0.6 }}>Coming Soon</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Data Access Section */}
            <section className="dashboard-section" style={{ marginTop: '3rem' }}>
                <h2>💾 Real-World Datasets</h2>
                <div className="stats-grid">
                    <div className="stat-card" style={{ textAlign: 'left' }}>
                        <h3>Community Observations</h3>
                        <p>Access the full raw dataset of community contributions for your analysis projects.</p>
                        <div style={{ marginTop: '1rem' }}>
                            <button className="btn-secondary" onClick={handleDownloadData} disabled={loading}>
                                {loading ? 'Preparing Download...' : 'Download CSV Dataset'}
                            </button>
                        </div>
                    </div>
                    <div className="stat-card" style={{ textAlign: 'left' }}>
                        <h3>Data Visualization Tools</h3>
                        <p>Use our built-in tools to visualize trends over time.</p>
                        <div style={{ marginTop: '1rem' }}>
                            <Link to="/data-tools" className="btn-secondary" style={{ display: 'inline-block', textDecoration: 'none' }}>Open Grapher</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default EducatorDashboard;
