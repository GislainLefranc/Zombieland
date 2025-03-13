// Dossier : src/services
// Fichier : quoteEquipmentService.js
// Service pour les associations devis-équipement

const { sequelize } = require('../config/sequelize'); // Configuration de Sequelize
const { quoteEquipmentSchema, quoteEquipmentUpdateSchema } = require('../validators/equipmentBaseValidator'); // Schémas de validation
const { validateRouteParams } = require('./routeValidation'); // Validation des paramètres de la route
const logger = require('../utils/logger'); // Utilitaire de journalisation
const { recalculateTotals } = require('./quoteService'); // Fonction de recalcul des totaux

const { Quote, Equipment, QuoteEquipment } = require('../models/indexModels'); // Modèles Sequelize

/**
 * Ajoute une association équipement à un devis.
 *
 * @param {number|string} quote_id - ID du devis.
 * @param {object} equipmentData - Données de l'équipement à ajouter.
 * @param {number|string} userId - ID de l'utilisateur effectuant l'action.
 * @returns {Promise<object>} Réponse de succès avec un message.
 */
async function addEquipmentToQuote(quote_id, equipmentData, userId) {
  const transaction = await sequelize.transaction(); // Démarrage d'une transaction Sequelize
  try {
    // Validation des données de l'équipement
    const validatedData = quoteEquipmentSchema.parse(equipmentData);

    // Récupération du devis avec ses équipements associés
    const quote = await Quote.findByPk(quote_id, { 
      include: [{
        model: Equipment,
        as: 'equipments',
        through: { model: QuoteEquipment },
        attributes: ['id', 'name', 'price_ht']
      }],
      transaction 
    });

    if (!quote) {
      throw new Error(`Devis non trouvé : ID ${quote_id}`);
    }

    // Vérification de l'existence de l'équipement
    const equipment = await Equipment.findByPk(validatedData.equipment_id, { transaction });
    if (!equipment) {
      throw new Error(`Équipement non trouvé : ID ${validatedData.equipment_id}`);
    }

    // Vérification si l'équipement est déjà associé au devis
    const existing = await QuoteEquipment.findOne({
      where: { 
        quote_id, 
        equipment_id: validatedData.equipment_id 
      },
      transaction
    });

    if (existing) {
      throw new Error("Cet équipement est déjà présent dans le devis. Utilisez l'édition pour modifier la quantité.");
    }

    // Création de l'association entre le devis et l'équipement
    await QuoteEquipment.create({
      quote_id,
      equipment_id: validatedData.equipment_id,
      quantity: validatedData.quantity,
      unit_price_ht: validatedData.unit_price_ht,
      is_first_unit_free: validatedData.is_first_unit_free || false
    }, { transaction });

    // Recalcul des totaux du devis
    await recalculateTotals(quote.id, transaction);

    await transaction.commit();
    logger.info(`Équipement (ID ${validatedData.equipment_id}) ajouté au devis (ID ${quote_id}) par l'utilisateur ${userId}.`);
    return { success: true, message: "Équipement ajouté avec succès" };
  } catch (error) {
    await transaction.rollback();
    logger.error(`Erreur dans addEquipmentToQuote : ${error.message}`);
    throw error;
  }
}

/**
 * Récupère toutes les associations d'équipements pour un devis donné ainsi que les totaux calculés.
 *
 * @param {number|string} quote_id - ID du devis.
 * @returns {Promise<object>} Objet contenant les équipements et les informations de totaux.
 */
async function getQuoteEquipments(quote_id) {
  try {
    // Validation des paramètres de la route
    const { quote_id: validatedQuoteId } = validateRouteParams({ quote_id });

    // Récupération du devis avec ses équipements associés
    const quote = await Quote.findByPk(validatedQuoteId, {
      include: [{
        model: Equipment,
        as: 'equipments',
        through: { attributes: ['quantity', 'unit_price_ht', 'is_first_unit_free'] },
        attributes: ['id', 'name', 'price_ht'],
      }],
    });

    if (!quote) {
      const error = new Error(`Devis non trouvé : ID ${validatedQuoteId}`);
      error.status = 404;
      throw error;
    }

    // Calcul du sous-total et du total avec remise
    const equipments = quote.equipments;
    const subTotal = calculateSubTotal(equipments);
    const totalWithDiscount = calculateTotalWithDiscount(subTotal, quote.discount_type, quote.discount_value);

    // Enregistrement des totaux calculés
    logger.info(`Totaux pour le devis ${validatedQuoteId} : sous-total = ${subTotal}, total avec remise = ${totalWithDiscount}`);

    return {
      equipments,
      subTotal,
      discount: {
        type: quote.discount_type,
        value: quote.discount_value,
        reason: quote.discount_reason,
      },
      totalWithDiscount,
    };
  } catch (error) {
    logger.error(`Erreur dans getQuoteEquipments : ${error.message}`, { stack: error.stack });
    throw error;
  }
}

/**
 * Met à jour une association équipement dans un devis.
 *
 * @param {number|string} quote_id - ID du devis.
 * @param {number|string} equipment_id - ID de l'équipement.
 * @param {object} updateData - Données à mettre à jour.
 * @returns {Promise<object>} Renvoie l'association mise à jour.
 */
async function updateQuoteEquipment(quote_id, equipment_id, updateData) {
  const transaction = await sequelize.transaction(); // Démarrage d'une transaction Sequelize
  try {
    // Validation des données de mise à jour
    const validatedData = quoteEquipmentUpdateSchema.parse(updateData);

    // Récupération de l'association devis-équipement
    const quoteEquip = await QuoteEquipment.findOne({
      where: { quote_id, equipment_id },
      transaction,
    });

    if (!quoteEquip) {
      const error = new Error("Association entre devis et équipement non trouvée");
      error.status = 404;
      throw error;
    }

    // Mise à jour de l'association
    await quoteEquip.update(validatedData, { transaction });

    // Recalcul des totaux du devis
    await recalculateTotals(quote_id, transaction);

    await transaction.commit();
    logger.info(`Équipement (ID ${equipment_id}) du devis (ID ${quote_id}) mis à jour.`);
    return { success: true, message: "Équipement mis à jour avec succès", quoteEquipment: quoteEquip };
  } catch (error) {
    await transaction.rollback();
    logger.error("Erreur dans updateQuoteEquipment :", error);
    throw error;
  }
}

/**
 * Supprime une association entre un devis et un équipement.
 *
 * @param {number|string} quote_id - ID du devis.
 * @param {number|string} equipment_id - ID de l'équipement.
 * @param {number|string} userId - ID de l'utilisateur effectuant l'action.
 * @returns {Promise<object>} Objet indiquant le succès.
 */
async function deleteQuoteEquipment(quote_id, equipment_id, userId) {
  const transaction = await sequelize.transaction(); // Démarrage d'une transaction Sequelize
  try {
    // Validation des paramètres de la route
    const { quote_id: validatedQuoteId, equipment_id: validatedEquipmentId } = validateRouteParams({ quote_id, equipment_id });

    // Récupération de l'association devis-équipement
    const association = await QuoteEquipment.findOne({
      where: { quote_id: validatedQuoteId, equipment_id: validatedEquipmentId },
      transaction,
    });

    if (!association) {
      const error = new Error('Association introuvable');
      error.status = 404;
      throw error;
    }

    // Suppression de l'association
    await association.destroy({ transaction });

    // Recalcul des totaux du devis
    await recalculateTotals(quote_id, transaction);

    await transaction.commit();
    logger.info(`Équipement ID ${validatedEquipmentId} supprimé du devis ${validatedQuoteId} par l'utilisateur ${userId}`);
    return { success: true, message: 'Équipement supprimé avec succès' };
  } catch (error) {
    await transaction.rollback();
    logger.error(`Erreur deleteQuoteEquipment : ${error.message}`, { stack: error.stack });
    throw error;
  }
}

module.exports = {
  addEquipmentToQuote,
  getQuoteEquipments,
  updateQuoteEquipment,
  deleteQuoteEquipment,
};

// Fonctions utilitaires locales

/**
 * Calcule le sous-total des équipements.
 *
 * @param {Array} equipments - Liste des équipements.
 * @returns {number} Sous-total calculé.
 */
function calculateSubTotal(equipments) {
  if (!equipments || !Array.isArray(equipments)) {
    return 0;
  }
  return equipments.reduce((total, item) => {
    const unitPrice = parseFloat(item.price_ht) || 0;
    const quantity = item.QuoteEquipment 
      ? (item.QuoteEquipment.is_first_unit_free 
          ? Math.max(0, item.QuoteEquipment.quantity - 1) 
          : item.QuoteEquipment.quantity)
      : 0;
    return total + unitPrice * quantity;
  }, 0);
}

/**
 * Calcule le total après application de la remise.
 *
 * @param {number} subTotal - Sous-total.
 * @param {string} discountType - Type de remise ('percentage' ou 'fixed_amount').
 * @param {number} discountValue - Valeur de la remise.
 * @returns {number} Total après remise.
 */
function calculateTotalWithDiscount(subTotal, discountType, discountValue) {
  if (!discountType || discountValue === undefined) return subTotal;
  if (discountType === 'percentage') {
    return subTotal * (1 - discountValue / 100);
  }
  if (discountType === 'fixed_amount') {
    return Math.max(0, subTotal - parseFloat(discountValue));
  }
  return subTotal;
}
