const express = require('express');
const { register, login, getProfile, updateProfile, deleteProfile } = require('../controllers/userController');
const auth = require('../middlewares/auth');

const router = express.Router();

// Inscription
router.post('/register', register);

// Connexion
router.post('/login', login);

// Obtenir le profil de l'utilisateur connecté
router.get('/me', auth, getProfile);

// Mettre à jour le profil de l'utilisateur connecté
router.put('/me', auth, updateProfile);

// Supprimer le profil de l'utilisateur connecté
router.delete('/me', auth, deleteProfile);

module.exports = router;
