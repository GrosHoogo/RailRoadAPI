const Ticket = require('../models/Ticket');

// Réserver un billet
exports.bookTicket = async (req, res) => {
  const { userId, trainId, startStation, endStation } = req.body;
  try {
    const ticket = new Ticket({
      user: userId,
      train: trainId,
      start_station: startStation,
      end_station: endStation,
      isValid: false // Défini par défaut à false
    });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


// Valider un ticket (uniquement pour les employés)
exports.validateTicket = async (req, res) => {
  const { userId, trainId } = req.params;
  try {
    const ticket = await Ticket.findOne({ user: userId, train: trainId });
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    ticket.isValid = true; // Met à jour le champ isValid
    ticket.validationDate = new Date(); // Ajoute la date de validation
    await ticket.save();

    res.json({ message: 'Ticket validated', ticket });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
