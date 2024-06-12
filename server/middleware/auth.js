const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) {
        return res.status(403).json({ msg: 'No token provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(500).json({ msg: 'Failed to authenticate token' });
        }

        req.userName = decoded.username;
        req.userRole = decoded.role;
        next();
    });
};

module.exports = verifyToken;