
const express = require('express');
const passport = require('passport');
const { authorizeRoles } = require('../middlewares/authorization');
const {
  createFunctioning,
  getAllFunctionings,
  getFunctioningById,
  updateFunctioning,
  deleteFunctioning,
} = require('../controllers/functioningController');

const router = express.Router();

/**
 * @route POST /api/functionings
 * @desc Créer un nouveau fonctionnement
 * @access Rôles 1, 2
 */
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1, 2),
  createFunctioning
);

/**
 * @route GET /api/functionings
 * @desc Récupérer tous les fonctionnements
 * @access Rôles 1, 2
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1, 2),
  getAllFunctionings
);

/**
 * @route GET /api/functionings/:id
 * @desc Récupérer un fonctionnement par ID
 * @access Rôles 1, 2
 */
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1, 2),
  getFunctioningById
);

/**
 * @route PUT /api/functionings/:id
 * @desc Mettre à jour un fonctionnement
 * @access Rôles 1, 2
 */
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1, 2),
  updateFunctioning
);

/**
 * @route DELETE /api/functionings/:id
 * @desc Supprimer un fonctionnement
 * @access Rôles 1, 2
 */
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1, 2),
  deleteFunctioning
);

module.exports = router;
