
const express = require('express');
const router = express.Router();
const {
  reportByTypeEtablissement,
  reportByTypeOrganisation,
  detailedCompanyReport,
} = require('../controllers/reportController');
const {
  authenticate,
  authorizeRoles,
} = require('../middlewares/authorization');

// Middleware d'authentification et d'autorisation (Admin uniquement)
router.use(authenticate);
router.use(authorizeRoles(1));

/**
 * @route GET /api/reports/type-establishment
 * @desc Rapport par Type d'Établissement
 * @access Admin uniquement
 */
router.get('/type-establishment', reportByTypeEtablissement);

/**
 * @route GET /api/reports/type-organisation
 * @desc Rapport par Type d'Organisation
 * @access Admin uniquement
 */
router.get('/type-organisation', reportByTypeOrganisation);

/**
 * @route GET /api/reports/detailed-company
 * @desc Rapport Détaillé par Entreprise
 * @access Admin uniquement
 */
router.get('/detailed-company', detailedCompanyReport);

module.exports = router;
