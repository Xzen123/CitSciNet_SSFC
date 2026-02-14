const { pool } = require('./config/db');

const badges = [
    {
        name: 'First Discovery',
        description: 'Submit your first valid observation.',
        icon: '🌱',
        category: 'Exploration',
        criteria: { count: 1 }
    },
    {
        name: 'Data Contributor',
        description: 'Submit 5 observations.',
        icon: '📝',
        category: 'Consistency',
        criteria: { count: 5 }
    },
    {
        name: 'Expert Observer',
        description: 'Submit 20 observations.',
        icon: '🔭',
        category: 'Mastery',
        criteria: { count: 20 }
    }
];

async function seedBadges() {
    try {
        for (const badge of badges) {
            await pool.query(
                `INSERT INTO badges (name, description, icon_url, category, criteria) 
                 VALUES ($1, $2, $3, $4, $5) 
                 ON CONFLICT (id) DO NOTHING`, // Note: This simplistic conflict check assumes IDs are stable or won't duplicate names if unique constraint existed. Ideally check by name.
                [badge.name, badge.description, badge.icon, badge.category, badge.criteria]
            );
        }
        console.log('Badges seeded!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedBadges();
