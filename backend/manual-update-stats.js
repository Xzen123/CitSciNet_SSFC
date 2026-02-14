const { pool } = require('./config/db');

async function updateStats() {
    try {
        const email = 'techthunder2018@gmail.com';
        console.log(`🔍 Finding user: ${email}...`);

        const userRes = await pool.query('SELECT id, name FROM users WHERE email = $1', [email]);

        if (userRes.rows.length === 0) {
            console.error('❌ User not found!');
            process.exit(1);
        }

        const userId = userRes.rows[0].id;
        const userName = userRes.rows[0].name;
        console.log(`✅ Found user: ${userName} (ID: ${userId})`);

        // 1. Update User Levels (Level 5, 2500 XP, 10 Day Streak)
        console.log('📈 Updating Stats...');
        await pool.query(
            `INSERT INTO user_levels (user_id, current_xp, current_level, streak_days, last_active)
             VALUES ($1, 2500, 5, 10, NOW())
             ON CONFLICT (user_id) 
             DO UPDATE SET current_xp = 2500, current_level = 5, streak_days = 10, last_active = NOW()`,
            [userId]
        );

        // 2. Award Badges (Assuming badge IDs 1, 2, 3 exist from seed data or we insert placeholders)
        // First, ensure some badges exist to assign
        await pool.query(`
            INSERT INTO badges (id, name, description, icon_url, category, criteria)
            VALUES 
            (101, 'Data Pioneer', 'Submitted 10+ Observations', '🌟', 'Community', '{}'),
            (102, 'Streak Master', '7 Day Streak Achieved', '🔥', 'Dedication', '{}')
            ON CONFLICT (id) DO NOTHING
        `);

        console.log('🏅 Awarding Badges...');
        await pool.query(
            `INSERT INTO user_badges (user_id, badge_id)
             VALUES ($1, 101), ($1, 102)
             ON CONFLICT (user_id, badge_id) DO NOTHING`,
            [userId]
        );

        console.log('🎉 Update Complete!');
        console.log(`User ${userName} is now Level 5 with a 10-day streak.`);

        process.exit();
    } catch (err) {
        console.error('❌ Error updating stats:', err);
        process.exit(1);
    }
}

updateStats();
