const { pool } = require('./config/db');

async function checkLevels() {
    try {
        const res = await pool.query(`
            SELECT u.name, ul.current_level, ul.current_xp, ul.streak_days, ul.last_active 
            FROM user_levels ul
            JOIN users u ON ul.user_id = u.id
        `);
        console.log(JSON.stringify(res.rows, null, 2));
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkLevels();
