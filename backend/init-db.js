const { pool } = require('./config/db');
const fs = require('fs');
const path = require('path');

async function runSchema() {
    try {
        const schemaPath = path.join(__dirname, 'models', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running schema migration...');
        await pool.query(schemaSql);
        console.log('Schema applied successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error applying schema:', err);
        process.exit(1);
    }
}

runSchema();
