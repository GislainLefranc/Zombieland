
const express = require('express');
const passport = require('passport');
const { authorizeRoles } = require('../middlewares/authorization');
const { getDashboardData } = require('../controllers/dashboardController');

const router = express.Router();

/**
 * @route GET /api/dashboard
 * @desc Récupérer les données du dashboard en fonction du rôle de l'utilisateur
 * @access Rôles 1 (Admin), 2 (Sales_User)
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1, 2),
  getDashboardData
);

module.exports = router;
