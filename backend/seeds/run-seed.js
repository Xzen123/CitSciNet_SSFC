const { pool } = require('../config/db');

async function seed() {
    try {
        console.log('Seeding database...');

        // 1. Create a default researcher
        // Password is 'password123' (hash it in real app, simplistic here for demo)
        const userRes = await pool.query(`
      INSERT INTO users (email, password_hash, name, role)
      VALUES ('researcher@citscinet.org', 'hashed_secret', 'Dr. Jane Goodall', 'researcher')
      ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `);
        const researcherId = userRes.rows[0].id;
        console.log('Researcher created with ID:', researcherId);

        // 2. Create Default Project (ID 1)
        await pool.query(`
      INSERT INTO projects (id, title, description, researcher_id, status)
      VALUES (1, 'Global Water Watch', 'Monitoring water quality metrics worldwide.', $1, 'active')
      ON CONFLICT (id) DO NOTHING
    `, [researcherId]);

        console.log('Default Project (ID 1) confirmed.');

        console.log('Seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seed();
