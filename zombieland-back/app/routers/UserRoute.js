// File Path: routes/UserRoutes.js

import express from 'express';
import { getAllUsers, getOneUser, createUser, updateUser, deleteUser, getCurrentUser } from '../controllers/UserController.js';
import authenticateJWT from '../middlewares/authenticateJWT.js';
import authorizeRoles from '../middlewares/authorizeRoles.js';

export const router = express.Router();

// Route pour obtenir les informations de l'utilisateur connecté (à sécuriser avec JWT)
router.get('/me', authenticateJWT, getCurrentUser);

// Route pour obtenir tous les utilisateurs
router.get('/', authenticateJWT, authorizeRoles(3), getAllUsers);

// Route pour obtenir un utilisateur par ID
router.get('/:id', authenticateJWT, authorizeRoles(2, 3), getOneUser);

// Route pour créer un nouvel utilisateur
router.post('/', createUser);

// Route pour mettre à jour un utilisateur
router.put('/:id', authenticateJWT, authorizeRoles(2, 3),updateUser);

// Route pour supprimer un utilisateur
router.delete('/:id', authenticateJWT, authorizeRoles(2, 3),deleteUser);

