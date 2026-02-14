import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LandingPage.css';
import { motion } from 'framer-motion';

const LandingPage = () => {
    const { user } = useAuth();

    return (
        <div className="landing-container">
            {/* HERO SECTION via Glass Theme */}
            <section className="hero-section">
                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1>Empower Science. <br />Protect Our Planet.</h1>
                    <p>Join a global network of citizens, researchers, and educators working together to monitor environmental health through <strong>CitSciNet</strong>.</p>

                    <div className="hero-buttons">
                        {user ? (
                            <Link to="/dashboard" className="btn-primary btn-lg">
                                Enter Portal
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="btn-primary btn-lg">Start Contributing</Link>
                                <Link to="/map" className="btn-secondary btn-lg" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>Explore Map</Link>
                            </>
                        )}
                    </div>
                </motion.div>

                <div className="hero-image">
                    <div className="visual-circle"></div>

                    <motion.div className="visual-card card-1"
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <span>🌱</span>
                        <div><strong>12,450</strong><small>Observations</small></div>
                    </motion.div>

                    <motion.div className="visual-card card-2"
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        <span>💧</span>
                        <div><strong>850</strong><small>Water Sources</small></div>
                    </motion.div>
                </div>
            </section>

            {/* FEATURED PROJECTS (New Section) */}
            <section className="section-padding" id="projects">
                <div className="section-header">
                    <h2>Featured Projects</h2>
                    <p>Discover active investigations in your area.</p>
                </div>

                <div className="projects-showcase">
                    <motion.div className="project-preview" whileHover={{ scale: 1.02 }}>
                        <div className="project-visual">🌊</div>
                        <div className="project-info">
                            <h3 style={{ fontSize: '2rem', marginBottom: '10px' }}>River Health 2025</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                                A community-led initiative to monitor pH, turbidity, and microplastics in urban waterways.
                                We need your help to collecting water samples at 50 designated points.
                            </p>
                            <Link to="/register" className="btn-primary">Join Project</Link>
                        </div>
                    </motion.div>

                    <motion.div className="project-preview" whileHover={{ scale: 1.02 }}>
                        <div className="project-visual">🏙️</div>
                        <div className="project-info">
                            <h3 style={{ fontSize: '2rem', marginBottom: '10px' }}>Urban Heat Mapping</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                                Track temperature variations across the city to identify heat islands.
                                Perfect for schools and student groups to learn about thermodynamics.
                            </p>
                            <Link to="/register" className="btn-primary">View Heatmap</Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="section-padding">
                <div className="section-header">
                    <h2>Platform Features</h2>
                </div>
                <div className="features-grid">
                    {[
                        { icon: "🔭", title: "Citizen Reporting", desc: "Easy-to-use mobile forms for logging environmental data in real-time." },
                        { icon: "🛡️", title: "Data Vetting", desc: "Robust validation tools for researchers to ensure high-quality datasets." },
                        { icon: "📊", title: "Visualization", desc: "Interactive maps and graphs to see local trends and global impact." }
                    ].map((feature, index) => (
                        <motion.div className="feature-card" key={index}
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                        >
                            <div className="icon-box">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* FOOTER */}
            <footer className="landing-footer" style={{ borderTop: '1px solid var(--border-glass)', background: 'transparent' }}>
                <h2>Ready to make an impact?</h2>
                <div style={{ margin: '40px 0' }}>
                    <Link to="/register" className="btn-primary btn-lg">Create Free Account</Link>
                </div>
                <div className="footer-links">
                    <span>© 2025 CitSciNet</span>
                    <Link to="/privacy">Privacy</Link>
                    <Link to="/terms">Terms</Link>
                    <Link to="/contact">Contact</Link>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
