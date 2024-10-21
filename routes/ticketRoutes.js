const express = require('express');
const { bookTicket, validateTicket } = require('../controllers/ticketController');
const authMiddleware = require('../middlewares/auth');
const employeeMiddleware = require('../middlewares/employee.js');

const router = express.Router();

// Book a ticket
router.post('/', authMiddleware, bookTicket);

// Validate a ticket (employee only)
router.put('/:id/validate', authMiddleware, employeeMiddleware, validateTicket);

module.exports = router;
