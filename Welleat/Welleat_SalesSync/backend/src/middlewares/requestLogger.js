// Dossier : src/middlewares
// Fichier : requestLogger.js
// Middleware pour la journalisation des requêtes

const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  logger.info(`Requête : ${req.method} ${req.url} - IP : ${req.ip}`);
  next();
};

module.exports = requestLogger;
