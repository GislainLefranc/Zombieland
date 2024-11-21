import express from 'express';
import {
    getAllReservations,
    getReservationById,
    createReservation,
    updateReservation,
    deleteReservation,
    getReservationsByUserId,
} from '../controllers/ReservationController.js';
import authenticateJWT from '../middlewares/authenticateJWT.js';
import authorizeRoles from '../middlewares/authorizeRoles.js';

export const router = express.Router();

router.get('/', authenticateJWT, authorizeRoles(3), getAllReservations);

router.get('/:id', authenticateJWT, authorizeRoles(3), getReservationById);

router.get('/user/:user_id', authenticateJWT, authorizeRoles(2, 3), getReservationsByUserId);

router.post('/', authenticateJWT, authorizeRoles(2, 3), createReservation);

router.put('/:id', authenticateJWT, authorizeRoles(3), updateReservation);

router.delete('/:id', authenticateJWT, authorizeRoles(3), deleteReservation);
