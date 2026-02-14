const router = require('express').Router();
const { pool } = require('../config/db');

router.get('/:project_id', async (req, res) => {
    const { project_id } = req.params;
    const { format } = req.query;

    try {
        const { rows } = await pool.query(
            'SELECT * FROM observations WHERE project_id = $1',
            [project_id]
        );

        if (format === 'csv') {
            // Basic CSV conversion
            const csv = rows.map(row => Object.values(row).join(',')).join('\n');
            res.header('Content-Type', 'text/csv');
            res.attachment(`project_${project_id}.csv`);
            return res.send(csv);
        }

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Export failed' });
    }
});

module.exports = router;
