// middlewares/employee.js

const User = require('../models/User');

const employeeMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id); // Assurez-vous que vous avez l'ID de l'utilisateur dans req.user

    if (!user || (user.role !== 'employee' && user.role !== 'admin')) {
      return res.status(403).json({ message: 'Access denied. Employee or admin required.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = employeeMiddleware;
