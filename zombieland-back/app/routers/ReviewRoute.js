import express from 'express';
import {getAllReviews, getAverageRating, getReviewById, createReview, updateReview, deleteReview} from '../controllers/ReviewController.js';

export const router = express.Router();

router.get('/', getAllReviews);

router.get('/:id', getReviewById);

router.get('/average/:activity_id', getAverageRating); //moyenne

router.post('/', createReview);

router.patch('/:id', updateReview);

router.delete('/:id', deleteReview);

