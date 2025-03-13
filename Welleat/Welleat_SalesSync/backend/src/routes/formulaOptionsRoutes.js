const express = require('express');
const router = express.Router();
const passport = require('passport');
const { authorizeRoles } = require('../middlewares/authorization');
const formulaOptionsController = require('../controllers/formulaOptionsController');

/**
 * @route POST /api/formula-options
 * @desc Associer une option à une formule
 * @access Rôles 1, 2
 */
router.post('/',
    passport.authenticate('jwt', { session: false }),
    authorizeRoles(1, 2),
    async (req, res) => {
        await formulaOptionsController.associateOption(req, res);
    }
);

/**
 * @route DELETE /api/formula-options/:formula_id/:option_id
 * @desc Retirer une option d'une formule
 * @access Rôle 1
 */
router.delete('/:formula_id/:option_id',
    passport.authenticate('jwt', { session: false }),
    authorizeRoles(1),
    async (req, res) => {
        await formulaOptionsController.removeOption(req, res);
    }
);

module.exports = router;