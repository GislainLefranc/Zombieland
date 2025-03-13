
const express = require('express');
const quoteEquipmentController = require('../controllers/quoteEquipmentController');
const passport = require('passport');
const { authorizeRoles } = require('../middlewares/authorization');

const router = express.Router({ mergeParams: true });

/**
 * @route POST /api/quotes/:quote_id/equipments
 * @desc Ajouter un équipement à un devis
 * @access Rôles 1, 2
 */
router.post('/', passport.authenticate('jwt', { session: false }), authorizeRoles(1, 2), quoteEquipmentController.addEquipmentToQuote);

/**
 * @route GET /api/quotes/:quote_id/equipments
 * @desc Récupérer tous les équipements d'un devis
 * @access Rôles 1, 2
 */
router.get('/', passport.authenticate('jwt', { session: false }), authorizeRoles(1, 2), quoteEquipmentController.getQuoteEquipments);

/**
 * @route PUT /api/quotes/:quote_id/equipments/:equipment_id
 * @desc Mettre à jour un équipement d'un devis
 * @access Rôles 1, 2
 */
router.put('/:equipment_id', passport.authenticate('jwt', { session: false }), authorizeRoles(1, 2), quoteEquipmentController.updateQuoteEquipment);

/**
 * @route DELETE /api/quotes/:quote_id/equipments/:equipment_id
 * @desc Supprimer un équipement d'un devis
 * @access Rôles 1, 2
 */
router.delete('/:equipment_id', passport.authenticate('jwt', { session: false }), authorizeRoles(1, 2), quoteEquipmentController.deleteQuoteEquipment);

/**
 * @route POST /api/quotes/:quote_id/equipments/:quote_id/options
 * @desc Ajouter une option à un devis
 * @access Rôles 1, 2
 */
router.post('/:quote_id/options', passport.authenticate('jwt', { session: false }), authorizeRoles(1, 2), quoteEquipmentController.addOption);

/**
 * @route DELETE /api/quotes/:quote_id/equipments/:quote_id/options/:option_id
 * @desc Supprimer une option d'un devis
 * @access Rôles 1, 2
 */
router.delete('/:quote_id/options/:option_id', passport.authenticate('jwt', { session: false }), authorizeRoles(1, 2), quoteEquipmentController.removeOption);

module.exports = router;