import { Router } from 'express';
import { router as userRoute } from './UserRoute.js';
import { router as activityRoute } from './ActivityRoute.js';
import { router as roleRoute } from './RoleRoute.js';
import { router as categoryRoute } from './CategoryRoute.js';
import { router as reviewRoute } from './ReviewRoute.js'; 
import { router as bookingRoute } from './ReservationRoute.js';
import { router as periodRoute } from './PeriodRoute.js';
import { router as paymentRoute } from './PaymentRoute.js';
import { router as authRoute } from './AuthRoute.js';
import { statsRouter } from './StatsRoute.js';

export const router = Router();

// Route racine
router.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API Zombieland !');
});

// Autres routes
router.use('/users', userRoute);
router.use('/activities', activityRoute);
router.use('/roles', roleRoute);
router.use('/categories', categoryRoute);
router.use('/reviews', reviewRoute);
router.use('/bookings', bookingRoute);
router.use('/periods', periodRoute);
router.use('/payments', paymentRoute);
router.use('/auth', authRoute);
router.use('/reservations/stats', statsRouter);
