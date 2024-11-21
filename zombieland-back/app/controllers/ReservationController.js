import Reservation from '../models/Reservation.js';

// Get all reservations (Afficher toutes les réservations)
export const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll();

    if (!reservations.length) {
      return res.status(404).json({ message: 'No reservations found' });
    }
    res.status(200).json(reservations);
  } catch (error) {
    console.error('Server error while fetching reservations:', error);
    res.status(500).json({ message: 'Server error while fetching reservations' });
  }
};

// Get a reservation by ID (Retrieve a specific reservation by its ID)
export const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.status(200).json(reservation);
  } catch (error) {
    console.error('Server error while fetching reservation:', error);
    res.status(500).json({ message: 'Server error while fetching reservation' });
  }
};

// Get all reservations by user ID (Afficher toutes les réservations par ID utilisateur)
export const getReservationsByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    const reservations = await Reservation.findAll({ where: { user_id } });

    if (!reservations.length) {
      return res.status(404).json({ message: 'No reservations found for this user' });
    }
    res.status(200).json(reservations);
  } catch (error) {
    console.error('Server error while fetching reservations:', error);
    res.status(500).json({ message: 'Server error while fetching reservations' });
  }
};

// Create a reservation (Créer une réservation)
export const createReservation = async (req, res) => {
  try {
    const { date_start, date_end, number_tickets, user_id, period_id } = req.body;
    const newReservation = await Reservation.create({ date_start, date_end, number_tickets, user_id, period_id });
    res.status(201).json(newReservation);
  } catch (error) {
    console.error('Server error while creating reservation:', error);
    res.status(500).json({ message: 'Server error while creating reservation' });
  }
};

// Update a reservation (Mettre à jour une réservation)
export const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Reservation.update(req.body, { where: { id } });

    if (!updated) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    const updatedReservation = await Reservation.findByPk(id);
    res.status(200).json(updatedReservation);
  } catch (error) {
    console.error('Server error while updating reservation:', error);
    res.status(500).json({ message: 'Server error while updating reservation' });
  }
};

// Delete a reservation (Supprimer une réservation)
export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    await reservation.destroy(reservation);
    res.status(204).send();
  } catch (error) {
    console.error('Server error while deleting reservation:', error);
    res.status(500).json({ message: 'Server error while deleting reservation' });
  }
};

