
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { authorizeRoles } = require('../middlewares/authorization');
const optionCategoryController = require('../controllers/optionCategoryController');

/**
 * @route GET /api/option-categories
 * @desc Récupérer toutes les catégories d'options
 * @access Rôles 1, 2
 */
router.get('/', passport.authenticate('jwt', { session: false }), authorizeRoles(1, 2), optionCategoryController.getAllCategories);

/**
 * @route POST /api/option-categories
 * @desc Créer une nouvelle catégorie d'option
 * @access Rôle 1
 */
router.post('/', passport.authenticate('jwt', { session: false }), authorizeRoles(1), optionCategoryController.createCategory);

/**
 * @route GET /api/option-categories/:id(\\d+)
 * @desc Récupérer une catégorie par ID
 * @access Rôles 1, 2
 */
router.get('/:id(\\d+)', passport.authenticate('jwt', { session: false }), authorizeRoles(1, 2), optionCategoryController.getCategoryById);

/**
 * @route PUT /api/option-categories/:id(\\d+)
 * @desc Mettre à jour une catégorie d'option
 * @access Rôle 1
 */
router.put('/:id(\\d+)', passport.authenticate('jwt', { session: false }), authorizeRoles(1), optionCategoryController.updateCategory);

/**
 * @route DELETE /api/option-categories/:id(\\d+)
 * @desc Supprimer une catégorie d'option
 * @access Rôle 1
 */
router.delete('/:id(\\d+)', passport.authenticate('jwt', { session: false }), authorizeRoles(1), optionCategoryController.deleteCategory);

module.exports = router;