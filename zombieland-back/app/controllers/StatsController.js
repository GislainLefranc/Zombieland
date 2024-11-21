import { Op } from 'sequelize';
import Reservation from '../models/Reservation.js';
import Period from '../models/Period.js';

export const getReservationStats = async (req, res) => {
  try {
    const today = new Date();
    const yesterdayStart = new Date();
    yesterdayStart.setDate(today.getDate() - 1);
    yesterdayStart.setHours(0, 0, 0, 0); // Début de la journée précédente

    const yesterdayEnd = new Date();
    yesterdayEnd.setDate(today.getDate() - 1);
    yesterdayEnd.setHours(23, 59, 59, 999); // Fin de la journée précédente

    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const yearStart = new Date(today.getFullYear(), 0, 1);

    // Calcul des statistiques
    const dailyReservations = await Reservation.count({
      where: {
        date_start: {
          [Op.between]: [yesterdayStart, yesterdayEnd],
        },
      },
    });

    const dailyTickets = await Reservation.sum('number_tickets', {
      where: {
        date_start: {
          [Op.between]: [yesterdayStart, yesterdayEnd],
        },
      },
    });

    const monthlyReservations = await Reservation.count({
      where: {
        date_start: {
          [Op.between]: [lastMonthStart, thisMonthStart],
        },
      },
    });

    const monthlyTickets = await Reservation.sum('number_tickets', {
      where: {
        date_start: {
          [Op.between]: [lastMonthStart, thisMonthStart],
        },
      },
    });

    const yearlyReservations = await Reservation.count({
      where: {
        date_start: {
          [Op.gte]: yearStart,
        },
      },
    });

    const yearlyTickets = await Reservation.sum('number_tickets', {
      where: {
        date_start: {
          [Op.gte]: yearStart,
        },
      },
    });

    // Calcul du chiffre d'affaires
    const calculateRevenue = async (startDate, endDate) => {
      const reservations = await Reservation.findAll({
        where: {
          date_start: {
            [Op.between]: [startDate, endDate],
          },
        },
        include: [{ model: Period }],
      });

      let totalRevenue = 0;
      for (const reservation of reservations) {
        const period = reservation.Period; // Associe la période à la réservation
        if (period) {
          totalRevenue += reservation.number_tickets * parseFloat(period.price);
        }
      }
      return totalRevenue;
    };

    const dailyRevenue = await calculateRevenue(yesterdayStart, yesterdayEnd);
    const monthlyRevenue = await calculateRevenue(lastMonthStart, thisMonthStart);
    const yearlyRevenue = await calculateRevenue(yearStart, today);

    res.status(200).json({
      dailyReservations,
      monthlyReservations,
      yearlyReservations,
      dailyTickets: dailyTickets || 0,
      monthlyTickets: monthlyTickets || 0,
      yearlyTickets: yearlyTickets || 0,
      dailyRevenue: dailyRevenue || 0,
      monthlyRevenue: monthlyRevenue || 0,
      yearlyRevenue: yearlyRevenue || 0,
    });
  } catch (error) {
    console.error('Erreur lors du calcul des statistiques :', error);
    res.status(500).json({ message: 'Erreur lors du calcul des statistiques.' });
  }
};
