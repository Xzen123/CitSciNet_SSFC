const router = require('express').Router();
const { pool } = require('../config/db');
const auth = require('../middleware/authMiddleware');

// Get all projects
router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM projects');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create project (Researcher only)
router.post('/', auth, async (req, res) => {
    const { title, description, short_description, category, image_url, protocols, study_area } = req.body;

    // Check if user is researcher
    /* // For now, we allow any logged in user to create projects for demo purposes
    if (req.user.role !== 'researcher') {
        return res.status(403).json({ error: 'Only researchers can create projects' });
    }
    */

    try {
        const query = `
            INSERT INTO projects 
            (title, description, short_description, category, image_url, researcher_id, protocols, study_area) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING *
        `;

        const { rows } = await pool.query(query, [
            title,
            description,
            short_description,
            category,
            image_url,
            req.user.id,
            protocols || [],
            study_area || null
        ]);

        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

module.exports = router;
