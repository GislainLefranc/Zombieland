
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { authorizeRoles } = require('../middlewares/authorization');
const optionController = require('../controllers/optionController');

/**
 * @route GET /api/options
 * @desc Récupérer toutes les options
 * @access Rôles 1, 2
 */
router.get('/', passport.authenticate('jwt', { session: false }), authorizeRoles(1, 2), optionController.getAllOptions);

/**
 * @route POST /api/options
 * @desc Créer une nouvelle option
 * @access Rôle 1
 */
router.post('/', passport.authenticate('jwt', { session: false }), authorizeRoles(1), optionController.createOption);

/**
 * @route GET /api/options/:id(\\d+)
 * @desc Récupérer une option par ID
 * @access Rôles 1, 2
 */
router.get('/:id(\\d+)', passport.authenticate('jwt', { session: false }), authorizeRoles(1, 2), optionController.getOptionById);

/**
 * @route PUT /api/options/:id(\\d+)
 * @desc Mettre à jour une option
 * @access Rôle 1
 */
router.put('/:id(\\d+)', passport.authenticate('jwt', { session: false }), authorizeRoles(1), optionController.updateOption);

/**
 * @route DELETE /api/options/:id(\\d+)
 * @desc Supprimer une option
 * @access Rôle 1
 */
router.delete('/:id(\\d+)', passport.authenticate('jwt', { session: false }), authorizeRoles(1), optionController.deleteOption);

/**
 * @route PUT /api/options/:id(\\d+)/remove-category
 * @desc Retirer une catégorie d'une option
 * @access Rôle 1
 */
router.put('/:id(\\d+)/remove-category', passport.authenticate('jwt', { session: false }), authorizeRoles(1), optionController.removeFromCategory);

module.exports = router;