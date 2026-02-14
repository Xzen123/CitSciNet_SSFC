import React from 'react';
import { motion } from 'framer-motion';
import './Gamification.css';

const Badges = ({ badges }) => {
    if (!badges || badges.length === 0) {
        return (
            <div className="glass-panel p-4 text-center">
                <p className="text-muted">No badges yet. Start observing!</p>
            </div>
        );
    }

    return (
        <div className="badges-grid">
            {badges.map((badge) => (
                <motion.div
                    key={badge.id}
                    className="badge-card glass-panel"
                    whileHover={{ scale: 1.05 }}
                >
                    <div className="badge-icon">🏅</div>
                    <div className="badge-info">
                        <h4>{badge.name}</h4>
                        <p>{badge.description}</p>
                        <span className="badge-date">Earned on {new Date(badge.awarded_at).toLocaleDateString()}</span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default Badges;
