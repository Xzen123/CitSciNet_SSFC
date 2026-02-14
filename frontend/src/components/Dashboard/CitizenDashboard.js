import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import MapView from '../Map/Map';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Badges from '../Gamification/Badges';
import Leaderboard from '../Gamification/Leaderboard';
import '../Gamification/Gamification.css';
import './Dashboard.css';

function CitizenDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalObservations: 0,
        byType: { water_quality: 0, wildlife: 0, plant: 0, air_quality: 0 },
        projects: 3
    });
    const [gamification, setGamification] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Stats
                const obsRes = await api.getObservations();
                const obs = obsRes.data;
                const typeCounts = { water_quality: 0, wildlife: 0, plant: 0, air_quality: 0 };
                obs.forEach(o => { if (typeCounts[o.type] !== undefined) typeCounts[o.type]++; });
                setStats({ totalObservations: obs.length, byType: typeCounts, projects: 3 });

                // 2. Fetch Gamification Profile (if user)
                if (user) {
                    const profileRes = await api.getProfile(user.id);
                    setGamification(profileRes.data);
                }
            } catch (error) {
                console.error('Error loading dashboard:', error);
            }
        };
        fetchData();
    }, [user]);

    const levelProgress = gamification ? Math.min((gamification.current_xp % 500) / 500 * 100, 100) : 0;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div style={{ marginBottom: '10px' }}>
                    <span className="text-gradient" style={{ fontSize: '1.2rem', fontWeight: 600 }}>Welcome back,</span>
                    <h1 style={{ margin: '5px 0' }}>{user?.name || 'Citizen Scientist'}</h1>
                </div>

                {gamification && (
                    <div className="glass-panel" style={{ maxWidth: '500px', margin: '0 auto', padding: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>Level {gamification.current_level}</span>
                            <span className="text-muted">{gamification.current_xp} XP</span>
                        </div>
                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{
                                width: `${levelProgress}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                                transition: 'width 1s ease'
                            }}></div>
                        </div>
                        <p style={{ fontSize: '0.8rem', marginTop: '8px', color: 'var(--text-muted)' }}>
                            {500 - (gamification.current_xp % 500)} XP to next level
                        </p>
                    </div>
                )}
            </header>

            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>

                {/* Stats & Actions */}
                <div className="dashboard-column">
                    <section className="dashboard-section">
                        <h2>📊 Your Impact</h2>
                        <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                            <div className="stat-card">
                                <h3>{stats.totalObservations}</h3>
                                <p>Observations</p>
                            </div>
                            <div className="stat-card">
                                <h3>{gamification?.streak_days || 0}🔥</h3>
                                <p>Day Streak</p>
                            </div>
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            <Link to="/observe" className="new-observation-btn" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                                + New Observation
                            </Link>
                        </div>
                    </section>
                </div>

                {/* Gamification: Badges */}
                <div className="dashboard-column">
                    <section className="dashboard-section">
                        <h2>🏅 Achievements</h2>
                        <Badges badges={gamification?.badges} />
                        <div style={{ marginTop: '15px', textAlign: 'center' }}>
                            <small className="text-muted">Earn badges by exploring new locations and maintaining accuracy.</small>
                        </div>
                    </section>
                </div>

                {/* Gamification: Leaderboard */}
                <div className="dashboard-column">
                    <section className="dashboard-section">
                        <h2>🏆 Top Contributors</h2>
                        <Leaderboard />
                    </section>
                </div>
            </div>

            {/* Map Section */}
            <section className="dashboard-section" style={{ marginTop: '30px' }}>
                <h2>🌍 Global Activity</h2>
                <div className="dashboard-map-wrapper">
                    <MapView height="400px" />
                </div>
            </section>
        </div>
    );
}

export default CitizenDashboard;
