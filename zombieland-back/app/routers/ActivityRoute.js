import express from 'express';
import { getAllActivities, getOneActivity, createActivity, updateActivity, deleteActivity, getActivityMultimedia, addMultimediaToActivity, removeMultimediaFromActivity } from '../controllers/ActivityController.js';
import authenticateJWT from '../middlewares/authenticateJWT.js';
import authorizeRoles from '../middlewares/authorizeRoles.js';

export const router = express.Router();

// Route pour obtenir toutes les activités (accessible à tous les utilisateurs)
router.get('/', getAllActivities);

// Route pour obtenir une activité par ID (accessible à tous les utilisateurs)
router.get('/:id', getOneActivity);

// Route pour créer une activité (réservée aux administrateurs)
router.post('/', authenticateJWT, authorizeRoles(3), createActivity);

// Route pour mettre à jour une activité (réservée aux administrateurs)
router.put('/:id', authenticateJWT, authorizeRoles(3), updateActivity);

// Route pour supprimer une activité (réservée aux administrateurs)
router.delete('/:id', authenticateJWT, authorizeRoles(3), deleteActivity);

// Routes liées au multimédia d'une activité
// Obtenir les médias d'une activité (accessible à tous les utilisateurs)
router.get('/:activityId/multimedia', authenticateJWT, getActivityMultimedia);

// Ajouter des médias à une activité (réservé aux administrateurs)
router.put('/:activityId/multimedia', authenticateJWT, authorizeRoles(3), addMultimediaToActivity);

// Supprimer un média d'une activité (réservé aux administrateurs)
router.delete('/:activityId/multimedia/:multimediaId', authenticateJWT, authorizeRoles(3), removeMultimediaFromActivity);