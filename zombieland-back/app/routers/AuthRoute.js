import express from 'express';
import { login, updatePassword, generateResetToken, resetPassword } from '../controllers/AuthController.js';

export const router = express.Router();

// Route d'authentification via email
router.post('/login', login);

// Route pour la mise à jour du mot de passe
router.patch('/update-password/:id', updatePassword);

// Route pour réinitialiser le mot de passe
router.post('/reset-password', resetPassword);

// Route pour réinitialiser le mot de passe
router.post('/request-password-reset', generateResetToken);

export default router;
