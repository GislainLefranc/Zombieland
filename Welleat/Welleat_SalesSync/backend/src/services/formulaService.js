// Dossier : src/services
// Fichier : formulaService.js
// Service pour les formules

const { Formula, Option, Formula_Options } = require('../models/indexModels');
const { formulaSchema, formulaUpdateSchema } = require('../validators/formulaValidator');
const { sequelize } = require('../config/sequelize');
const logger = require('../utils/logger');
const { calculateFormulaTotals, calculateTotals } = require('./utils/Calculator');

/**
 * Crée une nouvelle formule.
 *
 * @param {object} data - Données de la formule.
 * @returns {Promise<object>} Formule créée.
 */
async function createFormula(data) {
  const transaction = await sequelize.transaction();
  try {
    // Validation des données de la formule
    const validatedData = formulaSchema.parse(data);

    // Récupération des options si option_ids est fourni
    let options = [];
    if (validatedData.option_ids && validatedData.option_ids.length > 0) {
      options = await Option.findAll({ where: { id: validatedData.option_ids }, transaction });
    }

    // Récupération du taux de TVA (ou utilisation de 20 par défaut)
    const taxRate = validatedData.tax_rate !== undefined ? validatedData.tax_rate : 20;

    // Calcul du prix de base
    const installationPrice = parseFloat(validatedData.installation_price) || 0;
    const maintenancePrice = parseFloat(validatedData.maintenance_price) || 0;
    const hotlinePrice = parseFloat(validatedData.hotline_price) || 0;
    const basePrice = installationPrice + maintenancePrice + hotlinePrice;

    // Calcul de la somme des options
    const optionsSum = options.reduce((sum, opt) => {
      return sum + (parseFloat(opt.price_ht) || 0);
    }, 0);

    const totalHT = basePrice + optionsSum;
    const totalTTC = totalHT * (1 + taxRate / 100);

    // Création de la formule
    const formula = await Formula.create({
      name: validatedData.name,
      description: validatedData.description,
      price_ht: totalHT,
      installation_price: validatedData.installation_price,
      maintenance_price: validatedData.maintenance_price,
      hotline_price: validatedData.hotline_price,
    }, { transaction });

    // Association des options si présentes
    if (validatedData.option_ids?.length) {
      await formula.addOptions(validatedData.option_ids, { transaction });
    }

    await transaction.commit();

    // Rechargement de la formule avec ses options associées
    const formulaWithOptions = await Formula.findByPk(formula.id, {
      include: [{ model: Option, as: 'options' }]
    });
    return formulaWithOptions;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

/**
 * Met à jour une formule existante.
 *
 * @param {number} id - ID de la formule.
 * @param {object} updateData - Données à mettre à jour.
 * @returns {Promise<object>} Formule mise à jour.
 */
async function updateFormula(id, updateData) {
  const transaction = await sequelize.transaction();
  try {
    const validatedData = await formulaUpdateSchema.parseAsync(updateData);
    let options = [];
    if (updateData.option_ids && updateData.option_ids.length > 0) {
      options = await Option.findAll({ where: { id: updateData.option_ids }, transaction });
    }
    // Utilisation de calculateFormulaTotals pour inclure les options dans le calcul
    const totals = calculateFormulaTotals(validatedData, options);
    const dataToUpdate = { 
      ...validatedData, 
      price_ht: totals.base_total_ht, 
      price_ttc: totals.total_ttc 
    };
    const formula = await Formula.findByPk(id, { transaction });
    if (!formula) {
      throw new Error('Formule non trouvée');
    }
    await formula.update(dataToUpdate, { transaction });
    if (updateData.option_ids) await formula.setOptions(options, { transaction });
    await transaction.commit();
    return await Formula.findByPk(id, { include: [{ model: Option, as: 'options' }] });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

/**
 * Récupère toutes les formules avec pagination et recherche.
 *
 * @param {object} params - Paramètres de pagination et de recherche.
 * @returns {Promise<object>} Objet contenant les formules et les informations de pagination.
 */
async function getAllFormulas({ page = 1, limit = 10, search = "" } = {}) {
  try {
    // Validation et calcul des paramètres de pagination
    page = Number.isInteger(Number(page)) ? Number(page) : 1;
    limit = Number.isInteger(Number(limit)) ? Number(limit) : 10;
    const offset = (page - 1) * limit;
    const whereClause = search ? { name: { [Op.iLike]: `%${search}%` } } : {};

    // Récupération des formules avec leurs options associées
    const { count, rows } = await Formula.findAndCountAll({
      where: whereClause,
      include: [{ model: Option, as: 'options' }],
      order: [['id', 'ASC']],
      limit,
      offset
    });
    logger.info(`Récupération de ${rows.length} formules sur ${count}`);
    return {
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  } catch (error) {
    logger.error(`Erreur récupération formules : ${error.message}`, { stack: error.stack });
    throw error;
  }
}

/**
 * Récupère une formule par son ID.
 *
 * @param {number} id - ID de la formule.
 * @returns {Promise<object>} Formule récupérée.
 */
async function getFormulaById(id) {
  try {
    if (Number.isNaN(Number(id))) throw new Error("ID invalide");
    // Recherche de la formule avec ses options associées
    const formula = await Formula.findByPk(Number(id), { include: [{ model: Option, as: 'options' }] });
    if (!formula) {
      const error = new Error("Formule non trouvée");
      error.status = 404;
      throw error;
    }
    logger.info(`Formule ID ${id} récupérée`);
    return formula;
  } catch (error) {
    logger.error(`Erreur récupération formule ID ${id} : ${error.message}`, { stack: error.stack });
    throw error;
  }
}

/**
 * Supprime une formule par son ID.
 *
 * @param {number} id - ID de la formule.
 * @returns {Promise<object>} Objet avec un message de succès.
 */
async function deleteFormula(id) {
  const transaction = await sequelize.transaction();
  try {
    // Recherche de la formule à supprimer
    const formula = await Formula.findByPk(id, { transaction });
    if (!formula) {
      const error = new Error("Formule non trouvée");
      error.status = 404;
      throw error;
    }
    // Suppression des associations entre la formule et les options
    await Formula_Options.destroy({ where: { formula_id: id }, transaction });
    // Suppression de la formule
    await formula.destroy({ transaction });
    await transaction.commit();
    logger.info(`Formule ID ${id} supprimée`);
    return { message: "Formule supprimée avec succès" };
  } catch (error) {
    await transaction.rollback();
    logger.error(`Erreur suppression formule ID ${id} : ${error.message}`, { stack: error.stack });
    throw error;
  }
}

module.exports = {
  createFormula,
  getAllFormulas,
  getFormulaById,
  deleteFormula,
  updateFormula
};
