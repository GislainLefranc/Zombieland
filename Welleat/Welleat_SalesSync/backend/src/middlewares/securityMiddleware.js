// Dossier : src/middlewares
// Fichier : securityMiddleware.js
// Middleware pour renforcer la sécurité : Helmet, CORS, limitation des requêtes

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const securityMiddleware = [
  // Protection des en-têtes HTTP
  helmet(),
  // Configuration de CORS
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
  }),
  // Limitation du nombre de requêtes par IP
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Trop de requêtes depuis cette adresse IP, veuillez réessayer plus tard.',
    standardHeaders: true,
    legacyHeaders: false,
  }),
];

module.exports = securityMiddleware;
