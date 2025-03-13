// Dossier : src/services/utils
// Fichier : errorHandler.js
// Service pour la gestion des erreurs

const logger = require('../../utils/logger');

/**
 * Gère l'erreur et envoie une réponse formatée au client.
 *
 * @param {Error} err - Erreur survenue.
 * @param {object} req - Requête Express.
 * @param {object} res - Réponse Express.
 */
function handleError(err, req, res) {
  const statusCode = (err.status && Number.isInteger(err.status)) ? err.status : 500;
  const response = {
    success: false,
    error: err.message || 'Erreur interne du serveur',
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    if (err.details) response.details = err.details;
  }
  
  logger.error(`Erreur [${req.method} ${req.originalUrl}] : ${err.message}`, { 
    stack: err.stack,
    user: req.user ? req.user.id : 'non authentifié',
  });

  res.status(statusCode).json(response);
}

module.exports = { handleError };
