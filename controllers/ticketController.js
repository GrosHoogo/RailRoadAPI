const Ticket = require('../models/Ticket');

// Book a ticket
exports.bookTicket = async (req, res) => {
  const { trainId, startStation, endStation } = req.body;
  try {
    const ticket = new Ticket({
      user: req.user.id,
      train: trainId,
      start_station: startStation,
      end_station: endStation,
    });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Validate a ticket (employee only)
exports.validateTicket = async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findById(id).populate('user').populate('train');
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    ticket.isValid = true;
    await ticket.save();

    res.json({ message: 'Ticket validated', ticket });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
