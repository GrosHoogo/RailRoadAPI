const express = require('express');
const { getProfile, updateUser, deleteUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Get current user profile
router.get('/me', authMiddleware, getProfile);

// Update user
router.put('/me', authMiddleware, updateUser);

// Delete user
router.delete('/me', authMiddleware, deleteUser);

module.exports = router;
