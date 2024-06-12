const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../database/db');

const secretKey = process.env.JWT_SECRET;

function login(req, res) {
    const { username, password } = req.body;
    const query = 'SELECT username, password, role FROM users WHERE username = ?';

    db.query(query, [username], async (err, result) => {
        if (err) {
            return res.status(500).json({ msg: 'Internal server error' });
        }
        if (result.length === 0) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }

        const user = result[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }

        const expirationTime = Math.floor(Date.now() / 1000) + (60 * 60); // Current timestamp + 1 hour
        const payload = {
            username: user.username,
            role: user.role,
            exp: expirationTime
        };

        const token = jwt.sign(payload, secretKey);
        return res.json({ token });
    });
}

module.exports = { login };