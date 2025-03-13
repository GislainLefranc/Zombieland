const express = require('express');
const router = express.Router();
const passport = require('passport');
const { authorizeRoles } = require('../middlewares/authorization');
const equipmentCategoryController = require('../controllers/equipmentCategoryController');

/**
 * @route POST /api/equipment-categories
 * @desc Créer une nouvelle catégorie d'équipements
 * @access Rôle 1
 */
router.post('/',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1),
  equipmentCategoryController.createCategory
);

/**
 * @route GET /api/equipment-categories
 * @desc Récupérer toutes les catégories d'équipements
 * @access Rôles 1, 2
 */
router.get('/',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1, 2),
  equipmentCategoryController.getAllCategories
);

/**
 * @route GET /api/equipment-categories/:id
 * @desc Récupérer une catégorie d'équipements par ID
 * @access Rôles 1, 2
 */
router.get('/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1, 2),
  equipmentCategoryController.getCategoryById
);

/**
 * @route PUT /api/equipment-categories/:id
 * @desc Mettre à jour une catégorie d'équipements
 * @access Rôle 1
 */
router.put('/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1),
  equipmentCategoryController.updateCategory
);

/**
 * @route DELETE /api/equipment-categories/:id
 * @desc Supprimer une catégorie d'équipements
 * @access Rôle 1
 */
router.delete('/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1),
  equipmentCategoryController.deleteCategory
);

module.exports = router;