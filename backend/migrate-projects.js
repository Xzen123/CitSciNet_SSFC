const { pool } = require('./config/db');

async function migrate() {
    try {
        console.log('Migrating projects table...');

        await pool.query(`
            ALTER TABLE projects 
            ADD COLUMN IF NOT EXISTS short_description VARCHAR(150),
            ADD COLUMN IF NOT EXISTS category VARCHAR(50),
            ADD COLUMN IF NOT EXISTS image_url TEXT;
        `);

        console.log('Migration successful!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
