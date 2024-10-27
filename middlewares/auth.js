const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).send({ error: 'Token missing. Please authenticate.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(404).send({ error: 'User not found. Please authenticate.' });
        }

        req.token = token;
        req.user = user;

        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).send({ error: 'Invalid token. Please authenticate.' });
    }
};

module.exports = auth;
