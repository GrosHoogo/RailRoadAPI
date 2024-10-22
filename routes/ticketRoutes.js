const express = require('express');
const router = express.Router();
const { bookTicket, validateTicket } = require('../controllers/ticketController');
const authMiddleware = require('../middlewares/auth');
const employeeMiddleware = require('../middlewares/employee');

// Route to book a ticket
router.post('/book', authMiddleware, bookTicket);

// Route to validate a ticket (only for employee or admin)
router.put('/:ticketId/validate', authMiddleware, employeeMiddleware, validateTicket);

module.exports = router;
