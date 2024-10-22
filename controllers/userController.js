const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Inscription d'un nouvel utilisateur
exports.register = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    // Génération du token JWT
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    // Génération d'un token JWT
    const token = user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).send({ error: 'Invalid login credentials' });
  }
};

// Obtenir le profil de l'utilisateur connecté
exports.getProfile = async (req, res) => {
  res.send(req.user);
};

// Mettre à jour le profil utilisateur
exports.updateProfile = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['pseudo', 'email', 'password'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    updates.forEach((update) => req.user[update] = req.body[update]);
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Supprimer le profil utilisateur
exports.deleteProfile = async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send({ error: 'Failed to delete user' });
  }
};

