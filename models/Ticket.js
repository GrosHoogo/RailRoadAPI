const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  train: { type: mongoose.Schema.Types.ObjectId, ref: 'Train', required: true },
  start_station: { type: String, required: true },
  end_station: { type: String, required: true },
  isValid: { type: Boolean, default: false },
});

module.exports = mongoose.model('Ticket', ticketSchema);
