const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, deleteProfile } = require('../controllers/userController');
const auth = require('../middlewares/auth'); // Middleware d'authentification
const adminMiddleware = require('../middlewares/admin'); // Middleware d'autorisation d'administrateur

// Inscription
router.post('/register', register);

// Connexion
router.post('/login', login);

// Obtenir le profil utilisateur
router.get('/me', auth, getProfile);

// Mettre à jour le profil utilisateur
router.put('/me', auth, updateProfile);

// Supprimer un utilisateur par ID (seulement pour admin)
router.delete('/:id', auth, adminMiddleware, deleteProfile);

module.exports = router;
