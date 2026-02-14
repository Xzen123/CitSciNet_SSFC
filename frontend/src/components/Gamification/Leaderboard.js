import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './Gamification.css';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await api.getLeaderboard();
                setLeaders(res.data);
            } catch (err) {
                console.error("Failed to load leaderboard", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (loading) return <div className="glass-panel p-4">Loading Leaderboard...</div>;

    return (
        <div className="glass-panel leaderboard-container">
            <h3 className="text-gradient">🏆 Top Contributors</h3>
            <div className="leaderboard-list">
                {leaders.map((user, index) => (
                    <div key={index} className="leaderboard-item">
                        <span className="rank">#{index + 1}</span>
                        <div className="user-info">
                            <span className="name">{user.name}</span>
                            <span className="level">Lvl {user.current_level}</span>
                        </div>
                        <span className="xp">{user.current_xp} XP</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;
