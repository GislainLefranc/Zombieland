import Review from '../models/Review.js';
import Reservation from '../models/Reservation.js';
import { validationResult } from 'express-validator';

// Récupérer tous les avis (Accessible aux visiteurs uniquement)
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            include: [
                {
                    model: Reservation,
                    attributes: ['id'], // Ajouter d'autres attributs si nécessaire
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        if (!reviews.length) {
            return res.status(404).json({ message: 'Aucun avis trouvé.' });
        }

        res.status(200).json(reviews);
    } catch (error) {
        console.error('Erreur lors de la récupération des avis :', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des avis.' });
    }
};

// Récupérer un avis par ID (Accessible à tous)
export const getReviewById = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await Review.findByPk(id, {
            include: [
                {
                    model: Reservation,
                    attributes: ['id'],
                },
            ],
        });

        if (!review) {
            return res.status(404).json({ message: 'Avis introuvable.' });
        }

        res.status(200).json(review);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'avis :', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération de l\'avis.' });
    }
};

// Créer un nouvel avis (Accessible aux utilisateurs connectés)
export const createReview = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { note, comment, reservation_id } = req.body;

        // Vérifiez si la réservation existe
        const reservation = await Reservation.findByPk(reservation_id, {
            where: { user_id: req.user.id }, // Assurez-vous que la réservation appartient à l'utilisateur connecté
        });
        if (!reservation) {
            return res.status(400).json({ message: "La réservation n'existe pas ou ne vous appartient pas." });
        }

        // Vérifiez si un avis existe déjà pour cette réservation
        const existingReview = await Review.findOne({ where: { reservation_id } });
        if (existingReview) {
            return res.status(400).json({
                message: "Un avis pour cette réservation existe déjà.",
            });
        }

        // Créez un nouvel avis
        const newReview = await Review.create({
            note,
            comment,
            reservation_id,
            user_id: req.user.id, // Utilisateur connecté
        });

        res.status(201).json(newReview);
    } catch (error) {
        console.error('Erreur lors de la création de l\'avis :', error);
        res.status(500).json({ message: 'Erreur serveur lors de la création de l\'avis.' });
    }
};

// Supprimer un avis (Accessible aux utilisateurs connectés pour leurs avis uniquement)
export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await Review.findByPk(id);

        if (!review) {
            return res.status(404).json({ message: "Avis introuvable." });
        }

        // Vérifiez si l'utilisateur connecté est le propriétaire de l'avis
        if (review.user_id !== req.user.id) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer cet avis." });
        }

        await review.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Erreur lors de la suppression de l'avis :", error);
        res.status(500).json({ message: "Erreur serveur lors de la suppression de l'avis." });
    }
};
