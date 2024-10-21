const express = require('express');
const multer = require('multer');
const {
  getTrainStations,
  createTrainStation,
  updateTrainStation,
  deleteTrainStation,
} = require('../controllers/trainstationController');
const adminMiddleware = require('../middlewares/admin');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Get all train stations
router.get('/', getTrainStations);

// Create new train station (admin only)
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), createTrainStation);

// Update a train station (admin only)
router.put('/:id', authMiddleware, adminMiddleware, updateTrainStation);

// Delete a train station (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteTrainStation);

module.exports = router;
