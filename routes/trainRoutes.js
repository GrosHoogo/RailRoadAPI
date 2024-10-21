const express = require('express');
const {
  getTrains,
  createTrain,
  updateTrain,
  deleteTrain,
} = require('../controllers/trainController');
const adminMiddleware = require('../middlewares/admin');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Get all trains
router.get('/', getTrains);

// Create new train (admin only)
router.post('/', authMiddleware, adminMiddleware, createTrain);

// Update a train (admin only)
router.put('/:id', authMiddleware, adminMiddleware, updateTrain);

// Delete a train (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteTrain);

module.exports = router;
