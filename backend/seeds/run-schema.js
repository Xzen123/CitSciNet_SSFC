const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function runSchema() {
    try {
        const schemaPath = path.join(__dirname, '../models/schema.sql');
        const sql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running schema...');
        await pool.query(sql);
        console.log('Schema created successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Schema failed:', err);
        process.exit(1);
    }
}

runSchema();
