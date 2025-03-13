
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { authorizeRoles } = require('../middlewares/authorization');
const categoryController = require('../controllers/categoryController');

/**
 * @route   POST /api/categories?categoryType=option OR =equipment
 * @desc    Créer une nouvelle catégorie
 * @access  Admin (Rôle 1)
 */
router.post('/',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1),
  categoryController.createCategory
);

/**
 * @route   GET /api/categories?categoryType=option OR =equipment
 * @desc    Récupérer toutes les catégories
 * @access  Admin et Utilisateur (Rôles 1, 2)
 */
router.get('/',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1, 2),
  categoryController.getAllCategories
);

/**
 * @route   GET /api/categories/:id?categoryType=option OR =equipment
 * @desc    Récupérer une catégorie par son ID
 * @access  Admin et Utilisateur (Rôles 1, 2)
 */
router.get('/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1, 2),
  categoryController.getCategoryById
);

/**
 * @route   PUT /api/categories/:id?categoryType=option OR =equipment
 * @desc    Mettre à jour une catégorie
 * @access  Admin (Rôle 1)
 */
router.put('/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1),
  categoryController.updateCategory
);

/**
 * @route   DELETE /api/categories/:id?categoryType=option OR =equipment
 * @desc    Supprimer une catégorie
 * @access  Admin (Rôle 1)
 */
router.delete('/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1),
  categoryController.deleteCategory
);

module.exports = router;
