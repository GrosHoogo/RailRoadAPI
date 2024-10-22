const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).send({ error: 'Token missing. Please authenticate.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user with the id from the token
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).send({ error: 'User not found. Please authenticate.' });
    }

    // Attach token and user to the request object for further use in the app
    req.token = token;
    req.user = user;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Authentication error:", error); // Useful for debugging
    res.status(401).send({ error: 'Invalid token. Please authenticate.' });
  }
};

module.exports = auth;
