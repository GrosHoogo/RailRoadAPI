const express = require('express');
const {
  bookTicket,
  validateTicket
} = require('../controllers/ticketController');
const authMiddleware = require('../middlewares/auth');
const employeeMiddleware = require('../middlewares/employee'); // Assurez-vous d'avoir ce middleware

const router = express.Router();

// Réserver un billet
router.post('/book', authMiddleware, bookTicket);

// Valider un billet (uniquement pour les employés et administrateurs)
router.put('/:userId/:trainId/validate', authMiddleware, employeeMiddleware, validateTicket);

module.exports = router;
