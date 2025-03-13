// src/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { login, resetPassword } = require('../controllers/authController');

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Validation des données échouée
 *       401:
 *         description: Email ou mot de passe incorrect
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/login', login);

/**
 * @route POST /auth/reset-password
 * @desc Réinitialiser le mot de passe
 * @access Public
 */
router.post('/reset-password', resetPassword);

module.exports = router;
