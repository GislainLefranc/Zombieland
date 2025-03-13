
const express = require('express');
const passport = require('passport');
const { authorizeRoles } = require('../middlewares/authorization');
const {
  registerUser,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getUserDetail,
  getUserAssignedData,
  createUser,
  checkEmails,
  getUserCompanies, 
  getUserInterlocutors,
} = require('../controllers/userController');

const router = express.Router();

/**
 * @route POST /api/users/register
 * @desc Inscrire un nouvel utilisateur
 * @access Rôle 1
 */
router.post('/register', passport.authenticate('jwt', { session: false }), authorizeRoles(1), registerUser);

/**
 * @route POST /api/users/create
 * @desc Créer un utilisateur (par admin)
 * @access Rôle 1
 */
router.post('/create', passport.authenticate('jwt', { session: false }), authorizeRoles(1), createUser);

/**
 * @route POST /api/users/check-emails
 * @desc Vérifier les emails des utilisateurs
 * @access Rôles 1, 2
 */
router.post('/check-emails', passport.authenticate('jwt', { session: false }), authorizeRoles(1, 2), checkEmails);

/**
 * @route GET /api/users
 * @desc Récupérer tous les utilisateurs
 * @access Rôle 1
 */
router.get('/', passport.authenticate('jwt', { session: false }), authorizeRoles(1), getAllUsers);

/**
 * @route GET /api/users/me
 * @desc Récupérer le profil de l'utilisateur connecté
 * @access Authentifié
 */
router.get('/me', passport.authenticate('jwt', { session: false }), getUserProfile);

/**
 * @route PUT /api/users/me
 * @desc Mettre à jour le profil de l'utilisateur connecté
 * @access Authentifié
 */
router.put('/me', passport.authenticate('jwt', { session: false }), updateUserProfile);

/**
 * @route GET /api/users/:id
 * @desc Récupérer les détails d'un utilisateur par ID
 * @access Rôle 1
 */
router.get('/:id', passport.authenticate('jwt', { session: false }), authorizeRoles(1), getUserDetail);

/**
 * @route GET /api/users/:id/assignedData
 * @desc Récupérer les données assignées à un utilisateur
 * @access Rôle 1
 */
router.get('/:id/assignedData', passport.authenticate('jwt', { session: false }), authorizeRoles(1), (req, res, next) => {
  console.log('Route assignedData appelée, token:', req.headers.authorization);
  next();
}, getUserAssignedData);

/**
 * @route DELETE /api/users/:id
 * @desc Supprimer un utilisateur
 * @access Rôle 1
 */
router.delete('/:id', passport.authenticate('jwt', { session: false }), authorizeRoles(1), deleteUser);

/**
 * @route GET /api/users/me/companies
 * @desc Obtenir les entreprises de l'utilisateur connecté
 * @access Rôles 1, 2
 */
router.get('/me/companies', passport.authenticate('jwt', { session: false }), authorizeRoles(1, 2), getUserCompanies);

/**
 * @route GET /api/users/me/interlocutors
 * @desc Obtenir les interlocuteurs de l'utilisateur connecté
 * @access Rôles 1, 2
 */
router.get('/me/interlocutors', passport.authenticate('jwt', { session: false }), authorizeRoles(1, 2), getUserInterlocutors);

module.exports = router;