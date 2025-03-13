// Middleware d'autorisation basé sur les rôles

const passport = require('passport');
const logger = require('../utils/logger');

/**
 * Middleware d'authentification utilisant Passport et la stratégie JWT.
 */
const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      logger.error(`Erreur d'authentification : ${err.message}`, { stack: err.stack });
      return res.status(500).json({ error: "Erreur d'authentification" });
    }
    if (!user) {
      logger.warn('Accès non autorisé');
      return res.status(401).json({ error: 'Non autorisé' });
    }
    req.user = user;
    logger.debug(`Utilisateur authentifié : ID ${user.id}`);
    next();
  })(req, res, next);
};

/**
 * Middleware d'autorisation qui vérifie que l'utilisateur a l'un des rôles autorisés.
 *
 * @param {...number} allowedRoles - Liste des IDs de rôles autorisés.
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.roleId)) {
      logger.warn(`Accès refusé pour l'utilisateur ID : ${req.user ? req.user.id : 'Inconnu'}`);
      return res.status(403).json({ error: 'Accès refusé' });
    }
    logger.debug(`Accès autorisé pour l'utilisateur ID : ${req.user.id}`);
    next();
  };
};

module.exports = { authenticate, authorizeRoles };
