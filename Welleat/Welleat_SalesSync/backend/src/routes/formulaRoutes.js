const express = require('express');
const router = express.Router();
const passport = require('passport');
const formulaController = require('../controllers/formulaController');
const optionRoutes = require('./optionRoutes');
const { authorizeRoles } = require('../middlewares/authorization');

/**
 * @route Use /api/formulas/:formula_id/options
 * @desc Utilise les routes d'options pour une formule spécifique
 * @access Rôles 1, 2 (hérités des routes d'options)
 */
router.use('/:formula_id/options', optionRoutes);

/**
 * @route POST /api/formulas
 * @desc Créer une nouvelle formule
 * @access Authentifié
 */
router.post('/', 
    passport.authenticate('jwt', { session: false }), 
    formulaController.createFormula
);

/**
 * @route GET /api/formulas
 * @desc Récupérer toutes les formules
 * @access Authentifié
 */
router.get('/', 
    passport.authenticate('jwt', { session: false }), 
    formulaController.getAllFormulas
);

/**
 * @route GET /api/formulas/:id
 * @desc Récupérer une formule par ID
 * @access Authentifié
 */
router.get('/:id', 
    passport.authenticate('jwt', { session: false }), 
    formulaController.getFormulaById
);

/**
 * @route PUT /api/formulas/:id/prices
 * @desc Mettre à jour les prix d'une formule
 * @access Rôles 1, 2
 */
router.put('/:id/prices', 
    passport.authenticate('jwt', { session: false }),
    authorizeRoles(1, 2), 
    formulaController.updateFormulaPrices
);

/**
 * @route PUT /api/formulas/:id
 * @desc Mettre à jour une formule par ID
 * @access Rôles 1, 2
 */
router.put('/:id', 
    passport.authenticate('jwt', { session: false }),
    authorizeRoles(1, 2), 
    formulaController.updateFormulaById 
);

/**
 * @route DELETE /api/formulas/:id
 * @desc Supprimer une formule
 * @access Authentifié
 */
router.delete('/:id', 
    passport.authenticate('jwt', { session: false }), 
    formulaController.deleteFormula
);

module.exports = router;