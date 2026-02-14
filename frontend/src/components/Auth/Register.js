import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../Forms/ObservationForm.css';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'citizen' });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.name, formData.email, formData.password, formData.role);
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="observation-form-container" style={{ maxWidth: '400px' }}>
            <h2 className="form-title">Join CitSciNet</h2>
            {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
            <form onSubmit={handleSubmit} className="observation-form">
                <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>I am a...</label>
                    <select name="role" value={formData.role} onChange={handleChange}>
                        <option value="citizen">Citizen Scientist</option>
                        <option value="researcher">Researcher</option>
                        <option value="educator">Educator / Student</option>
                    </select>
                </div>
                <button type="submit" className="btn-primary submit-btn">Register</button>
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Login</Link>
                </div>
            </form>
        </div>
    );
};

export default Register;
