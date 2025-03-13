
const express = require('express');
const passport = require('passport');
const { authorizeRoles } = require('../middlewares/authorization');
const {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  reassignCompany,
  getMyCompanies,
  assignInterlocutorsToCompany,
  assignUserToCompany,
  unassignUserFromCompany,
} = require('../controllers/companyController');

const router = express.Router();

/**
 * @route   POST /api/companies
 * @desc    Créer une nouvelle entreprise avec ses interlocuteurs
 * @access  Rôles 1 (Admin), 2 (Sales_User)
 */
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1, 2), // Admin et Sales_User
  createCompany
);

/**
 * @route   GET /api/companies
 * @desc    Récupérer toutes les entreprises
 * @access  Admin (Rôle 1)
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1), // Admin seulement
  getAllCompanies
);

/**
 * @route   GET /api/companies/my-companies
 * @desc    Récupérer les entreprises créées ou assignées à l'utilisateur connecté
 * @access  Tous les utilisateurs authentifiés
 */
router.get(
  '/my-companies',
  passport.authenticate('jwt', { session: false }),
  getMyCompanies
);

/**
 * @route   GET /api/companies/:id
 * @desc    Récupérer une entreprise par ID
 * @access  Rôles 1 (Admin), 2 (Sales_User)
 */
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1, 2),
  getCompanyById
);

/**
 * @route   PUT /api/companies/:id
 * @desc    Mettre à jour une entreprise
 * @access  Rôles 1 (Admin), 2 (Sales_User)
 */
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1, 2),
  updateCompany
);

/**
 * @route   DELETE /api/companies/:id
 * @desc    Supprimer une entreprise
 * @access  Rôles 1 (Admin), 2 (Sales_User)
 */
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1, 2),
  deleteCompany
);

/**
 * @route   PUT /api/companies/:id/reassign
 * @desc    Réassigner une entreprise à un autre utilisateur
 * @access  Admin (Rôle 1)
 */
router.put(
  '/:id/reassign',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1),
  reassignCompany
);

/**
 * @route   POST /api/companies/:id/assign-interlocutors
 * @desc    Assigner des interlocuteurs à une entreprise
 * @access  Rôles 1 (Admin), 2 (Sales_User)
 */
router.post(
  '/companies/:id/assign-interlocutors',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(['admin', 'gestionnaire']),
  assignInterlocutorsToCompany // Add this route
);

/**
 * @route   POST /api/companies/:id/assign-user
 * @desc    Assigner un utilisateur à une entreprise 
 * @access  Admin (Rôle 1)
 */
router.post(
  '/:id/assign-user',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1),
  assignUserToCompany
);

/**
 * @route   PUT /api/companies/:id/unassign-user
 * @desc    Désassigner un utilisateur d'une entreprise
 * @access  Admin (Rôle 1)
 */
router.put(
  '/:id/unassign-user',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1),
  unassignUserFromCompany
);

/**
 * @route   DELETE /:id
 * @desc    Supprimer une entreprise
 * @access  Admin (Rôle 1)
 */
router.delete('/:id', deleteCompany);


module.exports = router;
