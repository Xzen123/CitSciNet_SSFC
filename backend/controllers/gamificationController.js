const { pool } = require('../config/db');

// Configurable Rules (Move to DB or Config file later)
const POINTS_RULES = {
    observation_submit: 10,
    peer_review: 5,
    streak_bonus_7: 50
};

// Helper: Calculate Level based on XP
const calculateLevel = (xp) => {
    // 0xp -> Lvl 1, 100xp -> Lvl 3, 2500xp -> Lvl 11
    return Math.floor(Math.sqrt(xp) / 5) + 1;
};

// 1. Award Points
exports.awardPoints = async (userId, amount, actionType, entityId) => {
    try {
        console.log(`[GAMIFICATION] Awarding ${amount} points to User ${userId} for ${actionType}`);

        // Record transaction
        await pool.query(
            'INSERT INTO user_points (user_id, amount, action_type, related_entity_id) VALUES ($1, $2, $3, $4)',
            [userId, amount, actionType, entityId]
        );

        // Get current stats to calculate streak
        const currentStatsRes = await pool.query('SELECT streak_days, last_active FROM user_levels WHERE user_id = $1', [userId]);
        let streak = 1;

        if (currentStatsRes.rows.length > 0) {
            const lastActive = new Date(currentStatsRes.rows[0].last_active);
            const currentStreak = currentStatsRes.rows[0].streak_days || 0;

            const today = new Date();
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            // Navigate to same day (reset time to midnight for comparison)
            const isToday = lastActive.toDateString() === today.toDateString();
            const isYesterday = lastActive.toDateString() === yesterday.toDateString();

            console.log(`[GAMIFICATION] Streak Check - LastActive: ${lastActive.toDateString()}, Today: ${today.toDateString()}`);
            console.log(`[GAMIFICATION] isToday: ${isToday}, isYesterday: ${isYesterday}, CurrentStreak: ${currentStreak}`);

            if (isToday) {
                streak = Math.max(currentStreak, 1); // Ensure at least 1 if active today
            } else if (isYesterday) {
                streak = currentStreak + 1; // Consecutive day
            } else {
                streak = 1; // Broken streak
            }
            console.log(`[GAMIFICATION] New Streak: ${streak}`);
        }

        // recalculate total XP
        const xpResult = await pool.query('SELECT SUM(amount) as total FROM user_points WHERE user_id = $1', [userId]);
        const totalXP = parseInt(xpResult.rows[0].total) || 0;
        const newLevel = calculateLevel(totalXP);

        // Upsert into user_levels with new streak
        await pool.query(
            `INSERT INTO user_levels (user_id, current_xp, current_level, streak_days, last_active) 
             VALUES ($1, $2, $3, $4, NOW())
             ON CONFLICT (user_id) 
             DO UPDATE SET current_xp = $2, current_level = $3, streak_days = $4, last_active = NOW()`,
            [userId, totalXP, newLevel, streak]
        );

        // Check for new badges
        await checkBadges(userId);

        return { totalXP, newLevel };
    } catch (err) {
        console.error('Error awarding points:', err);
    }
};

// Helper: Check and Award Badges
const checkBadges = async (userId) => {
    try {
        // Get user stats
        const pointsRes = await pool.query('SELECT COUNT(*) as obs_count FROM user_points WHERE user_id = $1 AND action_type = $2', [userId, 'observation_submit']);
        const obsCount = parseInt(pointsRes.rows[0].obs_count) || 0;

        // Get all badges
        const badgesRes = await pool.query('SELECT * FROM badges');
        const allBadges = badgesRes.rows;

        // Get user's existing badges
        const userBadgesRes = await pool.query('SELECT badge_id FROM user_badges WHERE user_id = $1', [userId]);
        const ownedBadgeIds = new Set(userBadgesRes.rows.map(b => b.badge_id));

        for (const badge of allBadges) {
            if (ownedBadgeIds.has(badge.id)) continue;

            let earned = false;
            // Criteria: {"count": 1} for First Discovery
            if (badge.criteria && badge.criteria.count) {
                if (obsCount >= badge.criteria.count) {
                    earned = true;
                }
            }

            if (earned) {
                await pool.query(
                    'INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2)',
                    [userId, badge.id]
                );
                console.log(`Awarded badge ${badge.name} to user ${userId}`);
            }
        }
    } catch (err) {
        console.error('Error checking badges:', err);
    }
};

// 2. Get User Gamification Profile
exports.getProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        // Get Level Info
        const levelRes = await pool.query('SELECT * FROM user_levels WHERE user_id = $1', [userId]);
        let profile = levelRes.rows[0];

        // If no profile exists yet, return default
        if (!profile) {
            profile = { current_xp: 0, current_level: 1, streak_days: 0 };
        }

        // Get Recent Points
        const historyRes = await pool.query(
            'SELECT * FROM user_points WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5',
            [userId]
        );

        // Get Badges
        const badgesRes = await pool.query(
            `SELECT b.*, ub.awarded_at 
             FROM user_badges ub 
             JOIN badges b ON ub.badge_id = b.id 
             WHERE ub.user_id = $1`,
            [userId]
        );

        res.json({
            ...profile,
            recent_activity: historyRes.rows,
            badges: badgesRes.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

// 3. Get Leaderboard
exports.getLeaderboard = async (req, res) => {
    try {
        // Simple Global XP Leaderboard
        const query = `
            SELECT u.name, ul.current_xp, ul.current_level, ul.accuracy_score
            FROM user_levels ul
            JOIN users u ON ul.user_id = u.id
            ORDER BY ul.current_xp DESC
            LIMIT 10
        `;
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};
