
const express = require('express');
const passport = require('passport');
const { authorizeRoles } = require('../middlewares/authorization');
const {
  createSimulation,
  getAllSimulations,
  getSimulationById,
  updateSimulation,
  deleteSimulation,
  assignSimulation,
} = require('../controllers/simulationController');

const router = express.Router();

/**
 * @route POST /api/simulations
 * @desc Créer une nouvelle simulation
 * @access Rôles 1, 2
 */
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1, 2),
  createSimulation
);

/**
 * @route GET /api/simulations
 * @desc Récupérer toutes les simulations
 * @access Rôles 1, 2
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1, 2),
  getAllSimulations
);

/**
 * @route GET /api/simulations/:id
 * @desc Récupérer une simulation par ID
 * @access Rôles 1, 2
 */
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1, 2),
  getSimulationById
);

/**
 * @route PUT /api/simulations/:id
 * @desc Mettre à jour une simulation
 * @access Rôles 1, 2
 */
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1, 2),
  updateSimulation
);

/**
 * @route DELETE /api/simulations/:id
 * @desc Supprimer une simulation
 * @access Rôles 1, 2
 */
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1, 2),
  deleteSimulation
);

/**
 *  @route POST /api/simulations/:id
 * @desc Récupérer une simulation par ID
 * @access Rôles 1, 2
 */
router.post(
  '/assign/:simulationId',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1, 2),
  assignSimulation
);

module.exports = router;
