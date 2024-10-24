const mongoose = require('mongoose');

const trainStationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  open_hour: { type: String, required: true },
  close_hour: { type: String, required: true },
});

module.exports = mongoose.model('TrainStation', trainStationSchema);
