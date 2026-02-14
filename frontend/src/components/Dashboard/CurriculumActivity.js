import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Dashboard.css';

const activitiesData = {
    1: {
        id: 1,
        title: "Local Water Health",
        subject: "Chemistry & Biology",
        level: "Grade 9-12",
        description: "Investigate pH and turbidity in local streams to assess habitat suitability for macroinvertebrates.",
        objectives: [
            "Understand the relationship between pH, turbidity, and aquatic life.",
            "Collect water samples from local water bodies.",
            "Analyze data to determine ecosystem health."
        ],
        protocol: [
            "Locate a safe access point to the stream.",
            "Rinse the collection jar three times with stream water.",
            "Collect the water sample from mid-stream.",
            "Measure pH using the test strip immediately.",
            "Record the data in the CitSciNet app."
        ],
        resources: [
            { title: "Understanding pH in Rivers (Video)", type: "video" },
            { title: "Macroinvertebrate ID Guide (PDF)", type: "pdf" }
        ],
        standards: "NGSS HS-LS2-7: Design, evaluate, and refine a solution for reducing the impacts of human activities on the environment and biodiversity.",
        status: "Active"
    },
    2: {
        id: 2,
        title: "Urban Heat Island Effect",
        subject: "Physics & Earth Science",
        level: "Grade 6-8",
        description: "Map temperature variations across paved vs. green surfaces in your school neighborhood.",
        status: "Coming Soon"
    }
};

const CurriculumActivity = () => {
    const { id } = useParams();
    const activity = activitiesData[id];
    const [checkedSteps, setCheckedSteps] = useState({});

    if (!activity) {
        return <div className="dashboard-container">Activity not found</div>;
    }

    const toggleStep = (index) => {
        setCheckedSteps(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const progress = Math.round((Object.values(checkedSteps).filter(Boolean).length / activity.protocol?.length) * 100) || 0;

    return (
        <div className="dashboard-container">
            <Link to="/educator" className="btn-secondary" style={{ marginBottom: '20px' }}>&larr; Back to Dashboard</Link>

            <header className="dashboard-header glass-panel" style={{ textAlign: 'left', marginBottom: '2rem', padding: '2rem', background: 'var(--bg-glass)' }}>
                <span className="category-badge" style={{ background: 'var(--primary)', color: 'white' }}>{activity.subject}</span>
                <h1 style={{ marginTop: '0.5rem' }}>{activity.title}</h1>
                <p className="text-muted" style={{ fontSize: '1.1rem' }}>{activity.level}</p>
                <div style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.1)', height: '10px', borderRadius: '5px', overflow: 'hidden', maxWidth: '300px' }}>
                    <div style={{ width: `${progress}%`, background: 'var(--success)', height: '100%', transition: 'width 0.3s ease' }}></div>
                </div>
                <p style={{ fontSize: '0.8rem', marginTop: '5px', color: 'var(--text-muted)' }}>{progress}% Preparation Complete</p>
            </header>

            <div className="dashboard-split" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <section className="dashboard-section">
                    <h2>Overview</h2>
                    <p style={{ lineHeight: '1.6', color: 'var(--text-main)' }}>{activity.description}</p>

                    <h3 style={{ marginTop: '2rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '10px', color: 'var(--primary)' }}>Learning Objectives</h3>
                    <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: 'var(--text-main)' }}>
                        {activity.objectives?.map((obj, i) => <li key={i}>{obj}</li>)}
                    </ul>

                    <h3 style={{ marginTop: '2rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '10px', color: 'var(--primary)' }}>Field Protocol Checklist</h3>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        {activity.protocol?.map((step, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', padding: '10px', background: checkedSteps[i] ? 'rgba(34, 197, 94, 0.1)' : 'transparent', borderRadius: '6px', transition: 'all 0.2s', border: '1px solid var(--border-glass)' }}>
                                <input
                                    type="checkbox"
                                    checked={!!checkedSteps[i]}
                                    onChange={() => toggleStep(i)}
                                    style={{ width: '20px', height: '20px', marginRight: '15px', cursor: 'pointer', accentColor: 'var(--success)' }}
                                />
                                <span style={{ textDecoration: checkedSteps[i] ? 'line-through' : 'none', color: checkedSteps[i] ? 'var(--text-muted)' : 'var(--text-main)' }}>{step}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="dashboard-section">
                    <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '20px' }}>
                        <h3 style={{ color: 'var(--text-main)' }}>Ready to Start?</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            Ensure you have reviewed the protocol items on the left before starting data collection.
                        </p>
                        <Link to={`/observe?activity=${activity.id}`} className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', padding: '15px' }}>
                            🚀 Start Data Collection
                        </Link>

                        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1rem' }}>
                            <h4 style={{ color: 'var(--text-main)' }}>Teacher Resources</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {activity.resources?.map((res, i) => (
                                    <li key={i} style={{ marginBottom: '10px' }}>
                                        <button onClick={(e) => { e.preventDefault(); alert("Resource opening..."); }} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
                                            <span style={{ marginRight: '8px' }}>{res.type === 'video' ? '📺' : '📄'}</span>
                                            {res.title}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div style={{ marginTop: '2rem' }}>
                            <h4 style={{ color: 'var(--text-main)' }}>Standards Alignment</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '4px' }}>{activity.standards}</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CurriculumActivity;
