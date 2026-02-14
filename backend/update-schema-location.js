const { pool } = require('./config/db');

async function migrate() {
    try {
        console.log('🌍 Adding location to projects table...');

        // Add location column
        await pool.query(`
            ALTER TABLE projects 
            ADD COLUMN IF NOT EXISTS location GEOMETRY(POINT, 4326);
        `);

        // Create index
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_projects_location 
            ON projects USING GIST (location);
        `);

        console.log('✅ Schema updated.');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

migrate();
