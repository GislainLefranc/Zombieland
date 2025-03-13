
const express = require('express');
const passport = require('passport');
const { authorizeRoles } = require('../middlewares/authorization');
const {
  createInterlocutor,
  getAllInterlocutors,
  getInterlocutorById,
  updateInterlocutor,
  deleteInterlocutor,
  getIndependentInterlocutors,
  checkInterlocutorEmails, 
  updateInterlocutorPrincipal,
} = require('../controllers/interlocutorController');

const router = express.Router();

/**
 * @route POST /api/interlocutors/create
 * @desc Créer un interlocuteur (spécifique à l'admin)
 * @access Rôle 1
 */
router.post('/create', passport.authenticate('jwt', { session: false }), authorizeRoles(1), createInterlocutor);

/**
 * @route POST /api/interlocutors/check-emails
 * @desc Vérifier les emails des interlocuteurs
 * @access Rôles 1, 2
 */
router.post('/check-emails', passport.authenticate('jwt', { session: false }), authorizeRoles(1, 2), checkInterlocutorEmails);

/**
 * @route POST /api/interlocutors
 * @desc Créer un interlocuteur
 * @access Rôles 1, 2
 */
router.post('/', passport.authenticate('jwt', { session: false }), authorizeRoles(1, 2), createInterlocutor);

/**
 * @route GET /api/interlocutors
 * @desc Récupérer tous les interlocuteurs
 * @access Rôles 1, 2
 */
router.get('/', passport.authenticate('jwt', { session: false }), authorizeRoles(1, 2), getAllInterlocutors);

/**
 * @route GET /api/interlocutors/independent
 * @desc Récupérer tous les interlocuteurs indépendants
 * @access Rôles 1, 2
 */
router.get('/independent', passport.authenticate('jwt', { session: false }), authorizeRoles(1, 2), getIndependentInterlocutors);

/**
 * @route GET /api/interlocutors/:id
 * @desc Récupérer un interlocuteur par ID
 * @access Rôles 1, 2
 */
router.get('/:id', passport.authenticate('jwt', { session: false }), authorizeRoles(1, 2), getInterlocutorById);

/**
 * @route PUT /api/interlocutors/:id
 * @desc Mettre à jour un interlocuteur
 * @access Rôles 1, 2
 */
router.put('/:id', passport.authenticate('jwt', { session: false }), authorizeRoles(1, 2), updateInterlocutor);

/**
 * @route DELETE /api/interlocutors/:id
 * @desc Supprimer un interlocuteur
 * @access Rôles 1, 2
 */
router.delete('/:id', passport.authenticate('jwt', { session: false }), authorizeRoles(1, 2), deleteInterlocutor);

/**
 * @route PUT /api/interlocutors/:id/set-principal
 * @desc Mettre à jour le statut principal d'un interlocuteur
 * @access Rôles 1, 2
 */
router.put('/:id/set-principal', passport.authenticate('jwt', { session: false }), authorizeRoles(1, 2), updateInterlocutorPrincipal);

module.exports = router;