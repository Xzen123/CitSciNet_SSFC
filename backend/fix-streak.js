const { pool } = require('./config/db');

async function fixStreak() {
    try {
        const userIdRes = await pool.query("SELECT id FROM users WHERE name = 'NISHANT KUMAR'");
        if (userIdRes.rows.length === 0) {
            console.log("User not found");
            process.exit();
        }
        const userId = userIdRes.rows[0].id;

        const res = await pool.query(
            'UPDATE user_levels SET streak_days = 1 WHERE user_id = $1 RETURNING *',
            [userId]
        );
        console.log("Updated:", res.rows[0]);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixStreak();
