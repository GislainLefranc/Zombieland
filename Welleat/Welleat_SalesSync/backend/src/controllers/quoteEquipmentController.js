// Dossier: src/controllers
// Fichier: quoteEquipmentController.js
// Contrôleur pour les fonctions de gestion des équipements dans les devis.


const quoteEquipmentService = require('../services/quoteEquipmentService');
const logger = require('../utils/logger');
const { ZodError } = require('zod');
const { validateRouteParams, formatZodError } = require('../services/routeValidation');

const quoteEquipmentController = {
  /**
   * Ajouter un équipement à un devis.
   */
  addEquipmentToQuote: async (req, res, next) => {
    try {
      const quote_id = parseInt(req.params.quote_id, 10);
      if (isNaN(quote_id))
        return res.status(400).json({ success: false, error: "L'ID du devis doit être un nombre valide." });
      
      const equipmentData = {
        equipment_id: parseInt(req.body.equipment_id),
        quantity: parseInt(req.body.quantity),
        unit_price_ht: parseFloat(req.body.unit_price_ht),
        is_first_unit_free: req.body.is_first_unit_free || false
      };
  
      const userId = req.user?.id || 'non authentifié';
      const result = await quoteEquipmentService.addEquipmentToQuote(quote_id, equipmentData, userId);
      return res.status(201).json({ success: true, message: result.message, data: result });
    } catch (error) {
      logger.error(`Erreur addEquipmentToQuote : ${error.message}`);
      if (error instanceof ZodError)
        return res.status(400).json(formatZodError(error));
      next(error);
    }
  },

  /**
   * Récupérer les équipements d'un devis.
   */
  getQuoteEquipments: async (req, res, next) => {
    try {
      const quoteId = parseInt(req.params.quote_id, 10);
      if (isNaN(quoteId))
        return res.status(400).json({ success: false, error: "L'ID du devis doit être un nombre valide." });
      const equipments = await quoteEquipmentService.getQuoteEquipments(quoteId);
      return res.status(200).json({ success: true, data: equipments });
    } catch (error) {
      logger.error(`Erreur getQuoteEquipments : ${error.message}`, { stack: error.stack });
      next(error);
    }
  },

  /**
   * Mettre à jour un équipement associé à un devis.
   */
  updateQuoteEquipment: async (req, res, next) => {
    try {
      const { quote_id, equipment_id } = validateRouteParams(req.params);
      const userId = req.user?.id || 'non authentifié';
      const result = await quoteEquipmentService.updateQuoteEquipment(quote_id, equipment_id, req.body, userId);
      return res.status(200).json({ success: true, message: result.message, data: result.quoteEquipment });
    } catch (error) {
      logger.error(`Erreur updateQuoteEquipment : ${error.message}`, { stack: error.stack });
      if (error instanceof ZodError)
        return res.status(400).json(formatZodError(error));
      next(error);
    }
  },

  /**
   * Supprimer un équipement d'un devis.
   */
  deleteQuoteEquipment: async (req, res, next) => {
    try {
      const { quote_id, equipment_id } = validateRouteParams(req.params);
      const userId = req.user?.id || 'non authentifié';
      const result = await quoteEquipmentService.deleteQuoteEquipment(quote_id, equipment_id, userId);
      return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      logger.error(`Erreur deleteQuoteEquipment : ${error.message}`, { stack: error.stack });
      next(error);
    }
  },

  /**
   * Ajouter une option à un devis.
   */
  addOption: async (req, res, next) => {
    try {
      const { quoteId } = validateRouteParams({ quoteId: req.params.quoteId });
      const { option_id } = req.body;
      const userId = req.user?.id || 'non authentifié';
      const result = await quoteEquipmentService.addOptionToQuote(quoteId, option_id, userId);
      return res.status(201).json({ success: true, message: result.message, data: result });
    } catch (error) {
      logger.error(`Erreur addOption : ${error.message}`, { stack: error.stack });
      if (error instanceof ZodError)
        return res.status(400).json(formatZodError(error));
      next(error);
    }
  },

  /**
   * Retirer une option d'un devis.
   */
  removeOption: async (req, res, next) => {
    try {
      const { quoteId, optionId } = validateRouteParams({ quoteId: req.params.quoteId, optionId: req.params.optionId });
      const userId = req.user?.id || 'non authentifié';
      const result = await quoteEquipmentService.removeOptionFromQuote(quoteId, optionId, userId);
      return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      logger.error(`Erreur removeOption : ${error.message}`, { stack: error.stack });
      next(error);
    }
  },
};

module.exports = quoteEquipmentController;
