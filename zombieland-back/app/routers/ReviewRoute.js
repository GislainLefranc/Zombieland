import express from 'express';
import { getAllReviews, getReviewById, createReview, deleteReview } from '../controllers/ReviewController.js';
import authenticateJWT from '../middlewares/authenticateJWT.js';
import { authorizeReservationOwner } from '../middlewares/authorizeReservationOwner.js';

export const router = express.Router();

// Route pour récupérer tous les avis (accessible aux visiteurs)
router.get("/", getAllReviews);

// Route pour récupérer un avis par ID (accessible à tous)
router.get("/:id", getReviewById);

// Route pour créer un avis (vérifie l'utilisateur connecté et sa réservation)
router.post("/", authenticateJWT, authorizeReservationOwner, createReview);

// Route pour supprimer un avis (vérifie l'utilisateur connecté et sa réservation)
router.delete("/:id", authenticateJWT, deleteReview);
