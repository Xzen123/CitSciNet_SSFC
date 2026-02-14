import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './components/Layout/LandingPage';
import MapView from './components/Map/Map';
import ObservationForm from './components/Forms/ObservationForm';
import CitizenDashboard from './components/Dashboard/CitizenDashboard';
import ResearcherDashboard from './components/Dashboard/ResearcherDashboard';
import EducatorDashboard from './components/Dashboard/EducatorDashboard';
import CreateProject from './components/Projects/CreateProject';
import CurriculumActivity from './components/Dashboard/CurriculumActivity';
import DataGrapher from './components/Dashboard/DataGrapher';


import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import PrivateRoute from './components/Auth/PrivateRoute';
import './App.css';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <header className="App-header">
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h1>CitSciNet</h1>
            </Link>
            <nav>
                {user ? (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/map">Map</Link>

                        <Link to="/observe">New Observation</Link>

                        {user.role === 'researcher' && (
                            <Link to="/researcher">Researcher Portal</Link>
                        )}
                        {user.role === 'educator' && (
                            <Link to="/educator">Educator Portal</Link>
                        )}

                        <div style={{ display: 'inline-flex', gap: '15px', alignItems: 'center', marginLeft: '20px' }}>
                            <span style={{ fontSize: '0.9rem' }}>Hi, {user.name}</span>
                            <button onClick={logout} style={{ background: 'none', border: '1px solid #ddd', padding: '5px 10px', color: 'inherit', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
                        </div>
                    </>
                ) : (
                    <>
                        <Link to="/map">Map</Link>
                        <Link to="/login" className="btn-primary" style={{ textDecoration: 'none', color: 'white' }}>Login</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <div className="App">
                    <Navbar />
                    <main>
                        <Routes>
                            {/* Public Landing Page */}
                            <Route path="/" element={<LandingPage />} />

                            {/* Auth Routes */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Public Map (can be viewed without login, optionally) */}
                            <Route path="/map" element={<MapView />} />

                            {/* Protected Routes */}
                            <Route path="/dashboard" element={
                                <PrivateRoute>
                                    <CitizenDashboard />
                                </PrivateRoute>
                            } />

                            <Route path="/observe" element={
                                <PrivateRoute>
                                    <ObservationForm />
                                </PrivateRoute>
                            } />

                            <Route path="/researcher" element={
                                <PrivateRoute allowedRoles={['researcher']}>
                                    <ResearcherDashboard />
                                </PrivateRoute>
                            } />

                            <Route path="/create-project" element={
                                <PrivateRoute allowedRoles={['researcher']}>
                                    <CreateProject />
                                </PrivateRoute>
                            } />

                            <Route path="/educator" element={
                                <PrivateRoute allowedRoles={['educator']}>
                                    <EducatorDashboard />
                                </PrivateRoute>
                            } />

                            <Route path="/activity/:id" element={
                                <PrivateRoute>
                                    <CurriculumActivity />
                                </PrivateRoute>
                            } />

                            <Route path="/data-tools" element={
                                <PrivateRoute>
                                    <DataGrapher />
                                </PrivateRoute>
                            } />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
