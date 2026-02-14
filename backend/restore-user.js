const { pool } = require('./config/db');
const bcrypt = require('bcryptjs');

async function restoreUser() {
    try {
        const email = 'nishant999908@gmail.com';
        const password = '2005';
        const name = 'Nishant';
        const role = 'researcher'; // Giving researcher role so they can see everything

        console.log(`👤 Restoring user: ${email}...`);

        const hash = await bcrypt.hash(password, 10);

        const res = await pool.query(
            `INSERT INTO users (name, email, password_hash, role) 
             VALUES ($1, $2, $3, $4) 
             ON CONFLICT (email) DO UPDATE SET password_hash = $3, role = $4
             RETURNING id, name, role`,
            [name, email, hash, role]
        );

        console.log('✅ User restored successfully:', res.rows[0]);
        process.exit();
    } catch (err) {
        console.error('❌ Failed to restore user:', err);
        process.exit(1);
    }
}

restoreUser();
