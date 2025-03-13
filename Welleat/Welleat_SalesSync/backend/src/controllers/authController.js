// Dossier : src/controllers
// Fichier : authController.js

const jwt = require('jsonwebtoken');
const { z } = require('zod');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { User, Role } = require('../models/indexModels');
const logger = require('../utils/logger');

// Schéma de validation pour la connexion
const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

// Schéma de validation pour la réinitialisation du mot de passe
const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Le token est requis'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

/**
 * Connexion d'un utilisateur.
 * Valide les informations reçues, vérifie l'existence et le mot de passe,
 * puis génère un token JWT.
 */
const login = async (req, res) => {
  logger.info('Tentative de connexion utilisateur');
  try {
    const { email, password } = loginSchema.parse(req.body);
    logger.info(`Email reçu : ${email}`);

    // Recherche de l'utilisateur avec son rôle
    const user = await User.findOne({ where: { email }, include: { model: Role, as: 'role' } });
    if (!user) {
      logger.warn(`Utilisateur avec l'email ${email} non trouvé`);
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn(`Mot de passe incorrect pour ${email}`);
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Création et renvoi du token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, roleId: user.roleId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    logger.info(`Utilisateur ${email} connecté avec succès`);
    res.json({ token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error(`Erreur de validation : ${JSON.stringify(error.errors)}`);
      return res.status(400).json({ errors: error.errors });
    }
    logger.error(`Erreur lors de la connexion : ${error.message}`);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
};

/**
 * Réinitialisation du mot de passe.
 * Vérifie la validité du token et met à jour le mot de passe de l'utilisateur.
 */
const resetPassword = async (req, res) => {
  try {
    const { token, password } = resetPasswordSchema.parse(req.body);
    // Hachage du token pour le comparer à celui stocké en base
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      where: {
        resetPasswordToken: tokenHash,
        resetPasswordExpires: { [Op.gt]: new Date() },
      },
    });
    if (!user) return res.status(400).json({ error: 'Token invalide ou expiré' });

    // Hachage et mise à jour du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res.status(400).json({ errors: error.errors });
    logger.error(`Erreur réinitialisation mot de passe : ${error.message}`);
    res.status(500).json({ error: 'Erreur lors de la réinitialisation du mot de passe' });
  }
};

/**
 * Middleware d'authentification par token JWT.
 * Vérifie la présence et la validité du token dans l'en-tête Authorization.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    logger.warn('Token manquant');
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      logger.warn(`Erreur lors de la vérification du token : ${err.message}`);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

module.exports = { login, resetPassword, authenticateToken };
