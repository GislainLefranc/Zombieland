// Dossier: src/config
// Fichier: rateLimiter.js
// Middleware de limitation des requêtes

const rateLimit = require('express-rate-limit');

// Configuration du middleware de limitation des requêtes
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // Durée de la fenêtre (en millisecondes)
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // Nombre maximum de requêtes par IP
  message: {
    status: 429,
    message: 'Trop de requêtes, veuillez réessayer plus tard.',
  },
  standardHeaders: true, // Envoi des headers RateLimit standards
  legacyHeaders: false,  // Désactivation des anciens headers
});

module.exports = limiter;
