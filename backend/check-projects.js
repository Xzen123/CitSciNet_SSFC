const { pool } = require('./config/db');

async function listProjects() {
    try {
        const { rows } = await pool.query('SELECT id, title, short_description, status, category FROM projects ORDER BY id DESC');
        console.table(rows);
        process.exit(0);
    } catch (err) {
        console.error('Error fetching projects:', err);
        process.exit(1);
    }
}

listProjects();
