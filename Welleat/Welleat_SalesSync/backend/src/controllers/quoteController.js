// Dossier: src/controllers/quoteController.js
// fichier: quoteController.js
// Contrôleur des fonctions de gestion des devis.

const {
  Quote,
  Interlocutor,
  Company,
  Equipment,
  QuoteEquipment,
  User,
  Formula,
  Option
} = require('../models/indexModels');
const logger = require('../utils/logger');
const { ZodError } = require('zod');
const quoteService = require('../services/quoteService');

/**
 * Crée un nouveau devis.
 */
const createQuote = async (req, res) => {
  try {
    // Appel de la fonction de création du devis dans le service
    const quote = await quoteService.createQuote(req.body);
    return res.status(201).json({ success: true, data: quote });
  } catch (error) {
    logger.error('Erreur création devis:', error);
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation des données',
        errors: error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Récupère tous les devis selon le rôle de l'utilisateur.
 */
const getAllQuotes = async (req, res) => {
  try {
    logger.info(`Utilisateur ID ${req.user.id} demande la récupération de tous les devis.`);
    const quotes = await quoteService.getAllQuotes(req.user);
    return res.status(200).json({ success: true, data: quotes });
  } catch (error) {
    logger.error(`Erreur récupération devis: ${error.message}`);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Récupère un devis par son ID.
 */
const getQuoteById = async (req, res) => {
  logger.info("getQuoteById a été appelée !");
  try {
    const quoteId = parseInt(req.params.id, 10);
    if (isNaN(quoteId)) {
      logger.warn(`ID de devis invalide fourni pour récupération: ${req.params.id}`);
      return res
        .status(400)
        .json({ success: false, error: "L'ID du devis doit être un nombre valide." });
    }

    logger.info(`Début getQuoteById pour quote #${quoteId}`);
    
    // Appel de la fonction de récupération du devis dans le service
    const quote = await quoteService.getQuoteById(quoteId);
    console.log('Quote récupéré dans le controller:', JSON.stringify(quote, null, 2));

    if (!quote) {
      return res.status(404).json({ success: false, error: 'Devis non trouvé' });
    }

    // Calculs éventuels (affichage, additionnel )
    const formulaTotal =
      (quote.installation_included ? Number(quote.installation_price || 0) : 0) +
      (quote.maintenance_included ? Number(quote.maintenance_price || 0) : 0) +
      (quote.hotline_included ? Number(quote.hotline_price || 0) : 0);

    const equipmentTotal = (quote.equipments || []).reduce((sum, eq) => {
      const qty = Number(eq.QuoteEquipment?.quantity || 0);
      const price = Number(eq.QuoteEquipment?.unit_price_ht || 0);
      const firstFree = eq.QuoteEquipment?.is_first_unit_free;
      return sum + price * (firstFree ? Math.max(0, qty - 1) : qty);
    }, 0);

    const subTotal = formulaTotal + equipmentTotal;
    const discountAmount = (subTotal * Number(quote.discount_value || 0)) / 100;
    const totalHT = subTotal - discountAmount;
    const taxRate = Number(quote.tax_rate || 20);
    const totalTTC = totalHT * (1 + taxRate / 100);
    const monthlyHT = totalHT;
    const monthlyTTC = totalTTC;
    const yearlyHT = monthlyHT * 12;
    const yearlyTTC = monthlyTTC * 12;

    const enrichedQuote = {
      ...quote.toJSON(),
      formula_total: formulaTotal,
      equipment_total: equipmentTotal,
      sub_total: subTotal,
      discount_amount: discountAmount,
      total_ht: totalHT,
      total_ttc: totalTTC,
      monthly_ht: monthlyHT,
      monthly_ttc: monthlyTTC,
      yearly_ht: yearlyHT,
      yearly_ttc: yearlyTTC,
      tax_rate: taxRate
    };
    logger.debug('Devis unitaire renvoyé au front:', JSON.stringify(enrichedQuote, null, 2));

    return res.status(200).json({
      success: true,
      data: enrichedQuote
    });
  } catch (error) {
    logger.error('Erreur dans getQuoteById:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Met à jour un devis existant.
 */
const updateQuote = async (req, res, next) => {
  try {
    const quoteId = parseInt(req.params.id, 10);
    if (isNaN(quoteId)) {
      logger.warn(`ID de devis invalide fourni pour mise à jour: ${req.params.id}`);
      return res
        .status(400)
        .json({ success: false, error: "L'ID du devis doit être un nombre valide." });
    }

    logger.info(`Utilisateur ID ${req.user.id} demande la mise à jour du devis ID ${quoteId}`);
    const updatedQuote = await quoteService.updateQuote(quoteId, req.body);
    return res
      .status(200)
      .json({ success: true, data: updatedQuote, message: 'Devis mis à jour avec succès' });
  } catch (error) {
    logger.error(`Erreur mise à jour devis: ${error.message}`);
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation des données',
        errors: error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    if (error.message === 'Devis non trouvé') {
      return res.status(404).json({ success: false, error: 'Devis non trouvé' });
    }
    next(error);
  }
};

/**
 * Supprime un devis par son ID.
 */
const deleteQuote = async (req, res, next) => {
  try {
    const quoteId = parseInt(req.params.id, 10);
    if (isNaN(quoteId)) {
      logger.warn(`ID de devis invalide fourni pour suppression: ${req.params.id}`);
      return res
        .status(400)
        .json({ success: false, error: "L'ID du devis doit être un nombre valide." });
    }

    logger.info(`Utilisateur ID ${req.user.id} demande la suppression du devis ID ${quoteId}`);
    await quoteService.deleteQuote(quoteId);
    logger.info(`Devis ID ${quoteId} supprimé avec succès par l'utilisateur ID ${req.user.id}`);
    return res.status(200).json({ success: true, message: 'Devis supprimé avec succès' });
  } catch (error) {
    logger.error(`Erreur suppression devis: ${error.message}`);
    if (error.message === 'Devis non trouvé') {
      return res.status(404).json({ success: false, error: 'Devis non trouvé' });
    }
    next(error);
  }
};

/**
 * Soumet un devis en changeant son statut à 'submitted'.
 */
const submitQuote = async (req, res, next) => {
  try {
    const quoteId = parseInt(req.params.id, 10);
    if (isNaN(quoteId)) {
      logger.warn(`ID de devis invalide fourni pour soumission: ${req.params.id}`);
      return res
        .status(400)
        .json({ success: false, error: "L'ID du devis doit être un nombre valide." });
    }

    logger.info(`Utilisateur ID ${req.user.id} demande la soumission du devis ID ${quoteId}`);
    const submittedQuote = await quoteService.submitQuote(quoteId);
    return res
      .status(200)
      .json({ success: true, data: submittedQuote, message: 'Devis soumis pour approbation' });
  } catch (error) {
    logger.error(`Erreur soumission devis: ${error.message}`);
    if (error.message === 'Devis non trouvé') {
      return res.status(404).json({ success: false, error: 'Devis non trouvé' });
    }
    next(error);
  }
};

/**
 * Approuve un devis en changeant son statut à 'approved'.
 */
const approveQuote = async (req, res, next) => {
  try {
    const quoteId = parseInt(req.params.id, 10);
    if (isNaN(quoteId)) {
      logger.warn(`ID de devis invalide fourni pour approbation: ${req.params.id}`);
      return res
        .status(400)
        .json({ success: false, error: "L'ID du devis doit être un nombre valide." });
    }

    logger.info(`Utilisateur ID ${req.user.id} demande l'approbation du devis ID ${quoteId}`);
    const approvedQuote = await quoteService.approveQuote(quoteId);
    return res
      .status(200)
      .json({ success: true, data: approvedQuote, message: 'Devis approuvé avec succès' });
  } catch (error) {
    logger.error(`Erreur approbation devis: ${error.message}`);
    if (error.message === 'Devis non trouvé') {
      return res.status(404).json({ success: false, error: 'Devis non trouvé' });
    }
    next(error);
  }
};

/**
 * Rejette un devis en changeant son statut à 'rejected' et en ajoutant une raison.
 */
const rejectQuote = async (req, res, next) => {
  try {
    const quoteId = parseInt(req.params.id, 10);
    if (isNaN(quoteId)) {
      logger.warn(`ID de devis invalide fourni pour rejet: ${req.params.id}`);
      return res
        .status(400)
        .json({ success: false, error: "L'ID du devis doit être un nombre valide." });
    }

    const { reason } = req.body;
    if (!reason) {
      logger.warn(`Motif de rejet non fourni pour le devis ID ${quoteId}`);
      return res
        .status(400)
        .json({ success: false, error: 'Le motif de rejet est requis.' });
    }

    logger.info(`Utilisateur ID ${req.user.id} demande le rejet du devis ID ${quoteId} pour raison: ${reason}`);
    const rejectedQuote = await quoteService.rejectQuote(quoteId, reason);
    return res
      .status(200)
      .json({ success: true, data: rejectedQuote, message: 'Devis rejeté avec succès' });
  } catch (error) {
    logger.error(`Erreur rejet devis: ${error.message}`);
    if (error.message === 'Devis non trouvé') {
      return res.status(404).json({ success: false, error: 'Devis non trouvé' });
    }
    next(error);
  }
};

/**
 * Ajoute une option à un devis.
 */
const addOptionToQuote = async (req, res, next) => {
  try {
    const quoteId = parseInt(req.params.quote_id, 10);
    if (isNaN(quoteId)) {
      logger.warn(`ID de devis invalide fourni pour ajout d'option: ${req.params.quote_id}`);
      return res
        .status(400)
        .json({ success: false, error: "L'ID du devis doit être un nombre valide." });
    }

    const { option_id } = req.body;
    if (!option_id || isNaN(parseInt(option_id, 10))) {
      logger.warn(`ID d'option invalide fourni pour ajout au devis ID ${quoteId}: ${option_id}`);
      return res
        .status(400)
        .json({ success: false, error: "L'ID de l'option doit être un nombre valide." });
    }

    const optionId = parseInt(option_id, 10);
    const userId = req.user?.id || 'non authentifié';
    logger.info(`Utilisateur ID ${userId} demande l'ajout de l'option ID ${optionId} au devis ID ${quoteId}`);
    await quoteService.addOptionToQuote(quoteId, optionId, userId);
    return res
      .status(201)
      .json({ success: true, message: 'Option ajoutée avec succès au devis' });
  } catch (error) {
    logger.error(`Erreur ajout option au devis: ${error.message}`);
    if (error.message === 'Devis non trouvé' || error.message === 'Option non trouvée') {
      return res.status(404).json({ success: false, error: error.message });
    }
    next(error);
  }
};

module.exports = {
  createQuote,
  getAllQuotes,
  getQuoteById,
  updateQuote,
  deleteQuote,
  submitQuote,
  approveQuote,
  rejectQuote,
  addOptionToQuote
};
