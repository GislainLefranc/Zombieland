const express = require('express');
const passport = require('passport');
const { authorizeRoles } = require('../middlewares/authorization');
const { sendSimulationEmail } = require('../controllers/emailController');
const { sendQuoteEmail } = require('../controllers/quoteEmailController');

const router = express.Router();

/**
 * @route POST /api/emails/send-simulation
 * @desc Envoyer un email de simulation
 * @access Rôles 1, 2
 */
router.post(
  '/send-simulation',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1, 2),
  sendSimulationEmail
);

/**
 * @route POST /api/emails/send-quote/:id
 * @desc Envoyer un email de devis
 * @access Rôles 1, 2
 */
router.post(
  '/send-quote/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1, 2),
  sendQuoteEmail
);

module.exports = router;