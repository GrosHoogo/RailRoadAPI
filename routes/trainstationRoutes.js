const express = require('express');
const {
  getTrainStations,
  createTrainStation,
  updateTrainStation,
  deleteTrainStation,
} = require('../controllers/trainstationController');
const adminMiddleware = require('../middlewares/admin');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Get all train stations
router.get('/', getTrainStations);

// Create new train station (admin only)
router.post('/', authMiddleware, adminMiddleware, createTrainStation);

// Update a train station (admin only)
router.put('/:id', authMiddleware, adminMiddleware, updateTrainStation);

// Delete a train station (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteTrainStation);

module.exports = router;
