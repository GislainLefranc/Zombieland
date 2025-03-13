//Dossier : src/middlewares
//Fichier : auth.js
// Middleware pour l'authentification JWT

const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    logger.debug(`Header Authorization : ${authHeader}`);
    // Vérifier que l'en-tête Authorization existe et respecte le format Bearer
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Header Authorization manquant ou invalide');
      return res.status(401).json({ error: 'Token manquant ou format invalide' });
    }
    // Extraire et vérifier le token
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Vérifier la date d'expiration du token (si présente)
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      logger.warn('Token expiré');
      return res.status(401).json({ error: 'Token expiré' });
    }
    // Stocker les informations décodées dans req.user pour les prochains middlewares
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(`Erreur auth : ${error.message}`, { stack: error.stack });
    res.status(401).json({ error: 'Token invalide' });
  }
};

module.exports = auth;
