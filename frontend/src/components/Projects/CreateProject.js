import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './CreateProject.css';

const CreateProject = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        short_description: '',
        description: '',
        category: '',
        image_url: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const categories = [
        'Ecology', 'Astronomy', 'Water Quality', 'Wildlife', 'Climate', 'Health', 'Other'
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImageFile(e.target.files[0]);
            // Helper to preview (optional)
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        setError('');

        try {
            let imageUrl = formData.image_url;

            // Upload Image if selected
            if (imageFile) {
                const uploadData = new FormData();
                uploadData.append('image', imageFile);
                const uploadRes = await api.uploadImage(uploadData);
                imageUrl = uploadRes.data.url;
            }

            const projectData = {
                ...formData,
                image_url: imageUrl
            };

            await api.createProject(projectData);
            navigate('/dashboard'); // or /projects
        } catch (err) {
            console.error(err);
            setError('Failed to create project. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="create-project-container glass-panel">
            <h2 className="text-gradient">Launch Your Citizen Science Initiative</h2>
            <p className="subtitle">Fill out the details below to get started.</p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="project-form">
                {/* 1. Project Details */}
                <div className="form-section">
                    <h3>1. Project Details</h3>

                    <div className="form-group">
                        <label>Project Name</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Neighborhood Bird Watch"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Short Description (Max 150 chars)</label>
                        <textarea
                            name="short_description"
                            value={formData.short_description}
                            onChange={handleChange}
                            maxLength="150"
                            placeholder="A brief, catchy summary of your project."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Full Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="5"
                            placeholder="Describe your goals, data collection methods, etc."
                            required
                        />
                    </div>
                </div>

                {/* 2. Category & Image */}
                <div className="form-section">
                    <h3>2. Category & Image</h3>

                    <div className="form-group">
                        <label>Project Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <small>Help users find your project.</small>
                    </div>

                    <div className="form-group">
                        <label>Project Image</label>
                        <div className="file-upload-wrapper">
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/webp"
                                onChange={handleImageChange}
                            />
                            <div className="upload-placeholder">
                                {imageFile ? imageFile.name : "Click to upload or drag and drop (Max 5MB)"}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={uploading}>
                        {uploading ? 'Launching...' : 'Create and Join Project'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateProject;
