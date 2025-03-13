// Dossier : src/services
// Fichier : formulaOptionsService.js
// Service pour les associations formule-option

const { sequelize } = require('../config/sequelize');
const { formulaOptionsSchema } = require('../validators/formulaOptionsValidator');
const logger = require('../utils/logger');
const { Formula, Option, Formula_Options } = require('../models/indexModels');

/**
 * Associe une option à une formule.
 *
 * @param {object} data - Données contenant formula_id et option_id.
 * @returns {Promise<object>} Objet indiquant le succès de l'association.
 */
async function associateOption(data) {
  const transaction = await sequelize.transaction();
  try {
    const validatedData = formulaOptionsSchema.parse(data);
    const { formula_id, option_id } = validatedData;

    // Vérifier que la formule et l'option existent
    const [formula, option] = await Promise.all([
      Formula.findByPk(formula_id, { transaction }),
      Option.findByPk(option_id, { transaction })
    ]);

    if (!formula) {
      throw { status: 404, message: "Formule non trouvée" };
    }
    if (!option) {
      throw { status: 404, message: "Option non trouvée" };
    }

    // Vérifier si l'association existe déjà
    const [association, created] = await Formula_Options.findOrCreate({
      where: { formula_id, option_id },
      transaction
    });

    if (!created) {
      throw { status: 409, message: "Cette option est déjà associée à cette formule" };
    }

    await transaction.commit();
    return {
      success: true,
      formula_id,
      option_id,
      message: "Option associée avec succès"
    };

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

/**
 * Retire l'association entre une formule et une option.
 *
 * @param {number} formula_id - ID de la formule.
 * @param {number} option_id - ID de l'option.
 * @returns {Promise<object>} Objet indiquant le succès de la dissociation.
 */
async function removeOption(formula_id, option_id) {
  const transaction = await sequelize.transaction();
  try {
    if (isNaN(formula_id) || isNaN(option_id)) {
      const error = new Error("IDs invalides pour la formule ou l'option");
      error.status = 400;
      throw error;
    }
    const deleted = await Formula_Options.destroy({
      where: { formula_id, option_id },
      transaction
    });
    if (!deleted) {
      const error = new Error("Association non trouvée");
      error.status = 404;
      throw error;
    }
    await transaction.commit();
    logger.info(`Option ${option_id} retirée de la formule ${formula_id}`);
    return { success: true, message: "Option dissociée de la formule avec succès" };
  } catch (error) {
    await transaction.rollback();
    logger.error(`Erreur removeOption : ${error.message}`, { stack: error.stack });
    throw error;
  }
}

module.exports = { associateOption, removeOption };
