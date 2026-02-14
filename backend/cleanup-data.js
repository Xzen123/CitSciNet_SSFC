const { pool } = require('./config/db');

async function cleanup() {
    try {
        console.log("🧹 Cleaning up old/junk data...");

        // Keep the India projects (Titles match what we seeded in seed-demo-data.js)
        const keepTitles = [
            'Ganges River Watch',
            'Bengaluru Bird Count',
            'Delhi Air Monitor'
        ];

        // Delete projects NOT in this list
        // Cascade should handle observations, but let's be safe

        // 1. Get IDs to delete
        const res = await pool.query(`SELECT id FROM projects WHERE title NOT IN ($1, $2, $3)`, keepTitles);
        const idsToDelete = res.rows.map(r => r.id);

        if (idsToDelete.length > 0) {
            console.log(`Found ${idsToDelete.length} projects to delete: ${idsToDelete.join(', ')}`);

            // Delete observations for these projects
            await pool.query(`DELETE FROM user_points WHERE related_entity_id IN (SELECT id FROM observations WHERE project_id = ANY($1))`, [idsToDelete]);
            await pool.query(`DELETE FROM validation_flags WHERE observation_id IN (SELECT id FROM observations WHERE project_id = ANY($1))`, [idsToDelete]);
            await pool.query(`DELETE FROM observation_reviews WHERE observation_id IN (SELECT id FROM observations WHERE project_id = ANY($1))`, [idsToDelete]);
            await pool.query(`DELETE FROM observations WHERE project_id = ANY($1)`, [idsToDelete]);

            // Delete projects
            await pool.query(`DELETE FROM projects WHERE id = ANY($1)`, [idsToDelete]);
            console.log("✅ Deleted old projects and their data.");
        } else {
            console.log("No old projects found.");
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

cleanup();
