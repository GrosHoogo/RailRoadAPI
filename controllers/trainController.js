const Train = require('../models/Train');

// Get all trains
exports.getTrains = async (req, res) => {
  const { limit = 10, sortBy = 'time_of_departure' } = req.query;
  try {
    const trains = await Train.find().sort(sortBy).limit(parseInt(limit));
    res.json(trains);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new train (admin only)
exports.createTrain = async (req, res) => {
  const { name, start_station, end_station, time_of_departure } = req.body;
  try {
    const train = new Train({ name, start_station, end_station, time_of_departure });
    await train.save();
    res.status(201).json(train);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a train (admin only)
exports.updateTrain = async (req, res) => {
  const { id } = req.params;
  try {
    const train = await Train.findByIdAndUpdate(id, req.body, { new: true });
    if (!train) return res.status(404).json({ message: 'Train not found' });
    res.json(train);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a train (admin only)
exports.deleteTrain = async (req, res) => {
  const { id } = req.params;
  try {
    const train = await Train.findByIdAndDelete(id);
    if (!train) return res.status(404).json({ message: 'Train not found' });
    res.json({ message: 'Train deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
