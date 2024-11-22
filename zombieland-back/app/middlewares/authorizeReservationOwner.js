import Reservation from '../models/Reservation.js';

export const authorizeReservationOwner = async (req, res, next) => {
    const { reservation_id } = req.body;

    try {
        const reservation = await Reservation.findByPk(reservation_id);

        if (!reservation || reservation.user_id !== req.user.id) {
            return res.status(403).json({ message: "Accès refusé : Vous n'êtes pas propriétaire de cette réservation." });
        }

        next();
    } catch (error) {
        console.error("Erreur lors de la vérification de la réservation :", error);
        res.status(500).json({ message: "Erreur serveur lors de la vérification de la réservation." });
    }
};
