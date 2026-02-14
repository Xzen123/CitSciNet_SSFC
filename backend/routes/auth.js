const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body; // role can be 'citizen', 'researcher', 'educator'

        // Check if user exists
        const userExist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExist.rows.length > 0) return res.status(400).json({ error: 'Email already exists' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save user
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
            [name, email, hashedPassword, role || 'citizen']
        );

        res.status(201).json(newUser.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log(`[LOGIN ATTEMPT] Email: '${email}', Password: '${password}'`);
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) return res.status(400).json({ error: 'Email is not found' });

        // Check password
        const validPass = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPass) return res.status(400).json({ error: 'Invalid password' });

        // Create and assign token
        const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.header('Authorization', token).json({
            token,
            user: {
                id: user.rows[0].id,
                name: user.rows[0].name,
                role: user.rows[0].role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
