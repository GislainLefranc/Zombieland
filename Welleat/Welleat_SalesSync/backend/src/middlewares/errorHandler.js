// Dossier : src/middlewares
// Fichier : errorHandler.js
// Middleware global pour la gestion centralisée des erreurs

const { ZodError } = require('zod');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  const userId = req.user?.id || 'non authentifié';
  logger.error(`Erreur : ${err.message}`, { stack: err.stack, route: req.originalUrl, userId });
  // Définir le code d'erreur (par défaut 500)
  const statusCode = Number.isInteger(err.status) ? err.status : 500;
  const response = { success: false, error: err.message || 'Erreur interne du serveur' };

  // Si l'erreur provient de la validation Zod, ajouter les détails
  if (err instanceof ZodError) {
    response.details = err.errors.map(e => ({ path: e.path.join('.'), message: e.message }));
  }
  // En mode développement, renvoyer la stack et les détails supplémentaires
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.details = err.details || null;
  }
  res.status(statusCode).json(response);
};

module.exports = errorHandler;
