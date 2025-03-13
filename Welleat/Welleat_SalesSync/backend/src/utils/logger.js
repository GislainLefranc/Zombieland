// Dossier : src/utils
// Fichier : logger.js
// Utilitaire pour la gestion des logs.

const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}] : ${message}`
    )
  ),
  transports: [
    new transports.Console({ 
      level: 'info',
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),
    // Fichiers de log pour les niveaux error, info, debug et combined
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/info.log', level: 'info' }),
    new transports.File({ filename: 'logs/debug.log', level: 'debug' }),
    new transports.File({ filename: 'logs/combined.log' })
  ],
});

module.exports = logger;
