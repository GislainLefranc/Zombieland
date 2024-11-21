import express from 'express';
import {getAllReviews, getReviewById, createReview, updateReview, deleteReview} from '../controllers/ReviewController.js';

export const router = express.Router();

// Route pour récupérer tous les avis
router.get("/", getAllReviews);

// Route pour récupérer un avis par ID
router.get("/:id", getReviewById);

// Route pour créer un nouvel avis
router.post("/", createReview);

// Route pour mettre à jour un avis
router.patch("/:id", updateReview);

// Route pour supprimer un avis
router.delete("/:id", deleteReview);
