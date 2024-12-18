const TrainStation = require('../models/TrainStation');

// Get all trainstations
exports.getTrainStations = async (req, res) => {
  const { limit = 10, sortBy = 'name' } = req.query;
  try {
    const stations = await TrainStation.find().sort(sortBy).limit(parseInt(limit));
    res.json(stations);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new trainstation (admin only)
exports.createTrainStation = async (req, res) => {
  const { name, open_hour, close_hour } = req.body;

  try {
    const station = new TrainStation({ name, open_hour, close_hour });
    await station.save();
    res.status(201).json(station);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update trainstation (admin only)
exports.updateTrainStation = async (req, res) => {
  const { id } = req.params;
  let updateData = req.body;

  try {
    const station = await TrainStation.findByIdAndUpdate(id, updateData, { new: true });
    if (!station) return res.status(404).json({ message: 'Station not found' });
    res.json(station);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete trainstation (admin only)
exports.deleteTrainStation = async (req, res) => {
  const { id } = req.params;

  try {
    const station = await TrainStation.findByIdAndDelete(id);
    if (!station) return res.status(404).json({ message: 'Station not found' });

    res.json({ message: 'Station deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
