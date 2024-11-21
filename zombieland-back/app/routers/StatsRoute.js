import express from 'express';
import { getReservationStats } from '../controllers/StatsController.js';
import authenticateJWT from '../middlewares/authenticateJWT.js';
import authorizeRoles from '../middlewares/authorizeRoles.js';

export const statsRouter = express.Router();

// Route pour récupérer les statistiques des réservations
statsRouter.get('/', authenticateJWT, authorizeRoles(3), getReservationStats);
