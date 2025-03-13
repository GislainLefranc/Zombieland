// Dossier : src/services
// Fichier : equipmentService.js
// Service pour les équipements.

const { sequelize } = require('../config/sequelize');
const { equipmentSchema } = require('../validators/equipmentValidator'); // Schéma de validation
const { validateRouteParams } = require('./routeValidation'); // Validation des paramètres de la route
const logger = require('../utils/logger');
const { recalculateTotals, calculateTotalWithDiscount, calculateSubTotal, calculatePriceTTC } = require('./utils/Calculator');

const { Quote, Equipment, QuoteEquipment, EquipmentCategory } = require('../models/indexModels');

/**
 * Crée un nouvel équipement.
 *
 * @param {object} data - Données de l'équipement.
 * @returns {Promise<object>} Équipement créé.
 */
async function createEquipment(data) {
  const transaction = await sequelize.transaction();
  try {
    const validatedData = equipmentSchema.parse(data);
    
    // Calcul automatique du prix TTC à partir du prix HT
    if (validatedData.price_ht !== undefined) {
      validatedData.price_ttc = calculatePriceTTC(validatedData.price_ht);
    }
    
    const equipment = await Equipment.create(validatedData, { transaction });
    await transaction.commit();
    logger.info(`Équipement créé : ${equipment.name}`);
    return equipment;
  } catch (error) {
    await transaction.rollback();
    logger.error(`Erreur création équipement : ${error.message}`);
    throw error;
  }
}

/**
 * Met à jour un équipement existant.
 *
 * @param {number} equipmentId - ID de l'équipement.
 * @param {object} updateData - Données à mettre à jour.
 * @returns {Promise<object>} Équipement mis à jour.
 */
async function updateEquipment(equipmentId, updateData) {
  const t = await sequelize.transaction();
  try {
    logger.info(`Mise à jour de l'équipement ID ${equipmentId} avec les données :`, updateData);

    // Recalcul du prix TTC si le prix HT est fourni
    if (updateData.price_ht !== undefined) {
      updateData.price_ttc = calculatePriceTTC(updateData.price_ht);
    }

    if (updateData.removeFromCategory) {
      updateData.category_id = null;
      delete updateData.removeFromCategory;
    }
    
    if (updateData.category_id !== undefined) {
      updateData.category_id = updateData.category_id === null ? null : Number(updateData.category_id);
    }
    
    const equipment = await Equipment.findByPk(equipmentId, { transaction: t });
    if (!equipment) {
      throw new Error('Équipement non trouvé');
    }
    
    await equipment.update(updateData, { transaction: t });
    await t.commit();
    
    const updatedEquipment = await Equipment.findByPk(equipmentId, {
      include: [{ model: EquipmentCategory, as: 'category' }]
    });
    
    return updatedEquipment;
  } catch (error) {
    await t.rollback();
    logger.error(`Erreur lors de la mise à jour de l'équipement ID ${equipmentId} : ${error.message}`);
    throw error;
  }
}

/**
 * Récupère tous les équipements, éventuellement filtrés par catégorie.
 *
 * @param {number} categoryId - ID de la catégorie d'équipement.
 * @returns {Promise<Array>} Liste des équipements.
 */
async function getAllEquipments(categoryId) {
  try {
    const whereClause = {};
    if (categoryId) {
      whereClause.category_id = Number(categoryId);
    }

    const equipments = await Equipment.findAll({
      where: whereClause,
      include: [{
        model: EquipmentCategory,
        as: 'category',
        attributes: ['id', 'name', 'description']
      }],
      order: [['id', 'ASC']]
    });

    return equipments.map(equipment => {
      const plainEquipment = equipment.get({ plain: true });
      return {
        ...plainEquipment,
        category_id: plainEquipment.category_id !== null ? plainEquipment.category_id : null,
        category: plainEquipment.category
      };
    });
  } catch (error) {
    logger.error('Erreur récupération équipements :', error);
    throw error;
  }
}

/**
 * Récupère un équipement par son ID.
 *
 * @param {number} equipmentId - ID de l'équipement.
 * @returns {Promise<object>} Équipement récupéré.
 */
async function getEquipmentById(equipmentId) {
  const equipment = await Equipment.findByPk(equipmentId);
  if (!equipment) {
    throw new Error('Équipement non trouvé');
  }
  return equipment;
}

/**
 * Supprime un équipement par son ID.
 *
 * @param {number} equipmentId - ID de l'équipement.
 * @returns {Promise<void>}
 */
async function deleteEquipment(equipmentId) {
  const t = await sequelize.transaction();
  try {
    const equipment = await Equipment.findByPk(equipmentId, { transaction: t });
    if (!equipment) {
      throw new Error('Équipement non trouvé');
    }

    await equipment.destroy({ transaction: t });
    await t.commit();
    logger.info(`Équipement ID ${equipmentId} supprimé`);
  } catch (error) {
    await t.rollback();
    logger.error(`Erreur lors de la suppression de l'équipement ID ${equipmentId} : ${error.message}`);
    throw error;
  }
}

/**
 * Récupère toutes les catégories d'équipements.
 *
 * @returns {Promise<Array>} Liste des catégories.
 */
async function getEquipmentCategories() {
  try {
    const categories = await EquipmentCategory.findAll({
      attributes: ['id', 'name', 'description', 'is_default'],
      order: [['name', 'ASC']]
    });
    return categories;
  } catch (error) {
    logger.error('Erreur lors de la récupération des catégories :', error);
    throw error;
  }
}

/**
 * Ajoute un équipement à un devis.
 *
 * @param {number} quote_id - ID du devis.
 * @param {object} equipmentData - Données contenant equipment_id, quantity, unit_price_ht, is_first_unit_free.
 * @returns {Promise<object>} Objet de succès.
 */
async function addEquipmentToQuote(quote_id, equipmentData) {
  const transaction = await sequelize.transaction();
  try {
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

    const equipment = await Equipment.findByPk(equipmentData.equipment_id, { transaction });
    if (!equipment) {
      throw new Error(`Équipement non trouvé : ID ${equipmentData.equipment_id}`);
    }

    const existing = await QuoteEquipment.findOne({
      where: { 
        quote_id, 
        equipment_id: equipmentData.equipment_id 
      },
      transaction
    });

    if (existing) {
      throw new Error("Cet équipement est déjà présent dans le devis. Utilisez l'édition pour modifier la quantité.");
    }

    await QuoteEquipment.create({
      quote_id,
      equipment_id: equipmentData.equipment_id,
      quantity: equipmentData.quantity,
      unit_price_ht: equipmentData.unit_price_ht,
      is_first_unit_free: equipmentData.is_first_unit_free || false
    }, { transaction });

    await recalculateTotals(quote, transaction);
    await transaction.commit();

    return { 
      success: true, 
      message: "Équipement ajouté avec succès" 
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

/**
 * Met à jour un équipement dans un devis.
 *
 * @param {number} quote_id - ID du devis.
 * @param {number} equipment_id - ID de l'équipement.
 * @param {object} updateData - Données à mettre à jour.
 * @returns {Promise<object>} Objet de succès avec l'association mise à jour.
 */
async function updateQuoteEquipment(quote_id, equipment_id, updateData) {
  const transaction = await sequelize.transaction();
  try {
    // Recherche de l'association devis-équipement
    const quoteEquip = await QuoteEquipment.findOne({
      where: { quote_id, equipment_id },
      transaction,
    });
    if (!quoteEquip) {
      const error = new Error("Association entre devis et équipement non trouvée");
      error.status = 404;
      throw error;
    }

    await quoteEquip.update(updateData, { transaction });
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
 * @param {number} quote_id - ID du devis.
 * @param {number} equipment_id - ID de l'équipement.
 * @returns {Promise<object>} Objet de succès.
 */
async function deleteQuoteEquipment(quote_id, equipment_id) {
  const transaction = await sequelize.transaction();
  try {
    logger.info(`Suppression de l'association devis-équipement : devis ${quote_id}, équipement ${equipment_id}`);
    const association = await QuoteEquipment.findOne({
      where: { quote_id, equipment_id },
      transaction,
    });
    if (!association) {
      const error = new Error("Association introuvable");
      error.status = 404;
      throw error;
    }
    await association.destroy({ transaction });
    await recalculateTotals(quote_id, transaction);
    await transaction.commit();
    logger.info(`Association supprimée pour devis ${quote_id} et équipement ${equipment_id}`);
    return { success: true, message: "Association supprimée avec succès" };
  } catch (error) {
    await transaction.rollback();
    logger.error("Erreur dans deleteQuoteEquipment :", error);
    throw error;
  }
}

module.exports = {
  createEquipment,
  getAllEquipments,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
  getEquipmentCategories,
  addEquipmentToQuote,
  updateQuoteEquipment,
  deleteQuoteEquipment,
};
