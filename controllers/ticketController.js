// controllers/ticketController.js
const Ticket = require('../models/Ticket');
const { ticketBookingSchema, ticketValidationSchema } = require('../validation/ticketValidation');

// Book a ticket
exports.bookTicket = async (req, res) => {
  // Validate the request body
  const { error } = ticketBookingSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { trainId } = req.body; // Assuming you only want trainId now
  try {
    const ticket = new Ticket({
      user: req.user.id,
      train: trainId,
      isValid: false, // Default to false
    });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.validateTicket = async (req, res) => {
  const { ticketId } = req.params;  // This must match the route definition

  try {
    const ticket = await Ticket.findById(ticketId).populate('user').populate('train');
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    // Update ticket validation status and date
    ticket.isValid = true;
    ticket.validationDate = new Date(); 
    await ticket.save();

    res.json({ message: 'Ticket validated', ticket });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

