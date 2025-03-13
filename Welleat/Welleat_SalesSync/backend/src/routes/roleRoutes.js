// src/routes/roleRoutes.js

const express = require('express');
const passport = require('passport');
const { authorizeRoles } = require('../middlewares/authorization');
const {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
} = require('../controllers/roleController');

const router = express.Router();

/**
 * @route POST /api/roles
 * @desc Créer un nouveau rôle
 * @access Admin
 */
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1), // Admin seulement
  createRole
);

/**
 * @route GET /api/roles
 * @desc Récupérer tous les rôles
 * @access Admin
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1), // Admin seulement
  getAllRoles
);

/**
 * @route GET /api/roles/:id
 * @desc Récupérer un rôle par ID
 * @access Admin
 */
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1),
  getRoleById
);

/**
 * @route PUT /api/roles/:id
 * @desc Mettre à jour un rôle
 * @access Admin
 */
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1),
  updateRole
);

/**
 * @route DELETE /api/roles/:id
 * @desc Supprimer un rôle
 * @access Admin
 */
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1),
  deleteRole
);

module.exports = router;
