const { pool } = require('./config/db');
const bcrypt = require('bcryptjs');

async function testLoginDirect() {
    console.log("--- Testing Login Logic Directly ---");
    const email = 'sarah@research.com';
    const password = 'password123';

    try {
        // 1. Fetch User
        const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userRes.rows.length === 0) {
            console.log("❌ User not found in DB");
            return;
        }
        const user = userRes.rows[0];
        console.log(`✅ User found: ${user.email}, ID: ${user.id}`);
        console.log(`   Hash in DB: ${user.password_hash}`);

        // 2. Compare Password
        console.log(`   Testing password: '${password}'`);
        const validPass = await bcrypt.compare(password, user.password_hash);

        if (validPass) {
            console.log("✅ Password MATCHES!");
        } else {
            console.log("❌ Password does NOT match.");

            // Debug: Hash the password again to see what it looks like
            const newHash = await bcrypt.hash(password, 10);
            console.log(`   New Hash would be: ${newHash}`);
        }

    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

testLoginDirect();
