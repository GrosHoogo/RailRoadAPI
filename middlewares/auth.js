const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Récupérer le token du header Authorization
    const token = req.header('Authorization').replace('Bearer ', '');
    // Décoder le token pour récupérer l'ID de l'utilisateur
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Chercher l'utilisateur correspondant au token
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      throw new Error();
    }

    // Ajouter le token et l'utilisateur à la requête pour un accès ultérieur
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = auth;
