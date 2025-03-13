// Dossier : src/controllers
// Fichier : formulaOptionsController.js

const formulaOptionsService = require('../services/formulaOptionsService');
const logger = require('../utils/logger');

/**
 * Associe une option à une formule.
 */
const associateOption = async (req, res, next) => {
  try {
    const result = await formulaOptionsService.associateOption(req.body);
    return res.status(201).json({ success: true, message: "Option associée à la formule avec succès", data: result });
  } catch (error) {
    logger.error(`Erreur dans associateOption: ${error.message}`, { stack: error.stack });
    const status = error.status || 500;
    return res.status(status).json({ success: false, error: error.message, details: error.details || null });
  }
};

/**
 * Retire une option d'une formule.
 */
const removeOption = async (req, res, next) => {
  try {
    const { formula_id, option_id } = req.params;
    const result = await formulaOptionsService.removeOption(Number(formula_id), Number(option_id));
    return res.status(200).json({ success: true, message: "Option retirée de la formule avec succès", data: result });
  } catch (error) {
    logger.error(`Erreur dans removeOption: ${error.message}`, { stack: error.stack });
    const status = error.status || 500;
    return res.status(status).json({ success: false, error: error.message, details: error.details || null });
  }
};

module.exports = { associateOption, removeOption };
