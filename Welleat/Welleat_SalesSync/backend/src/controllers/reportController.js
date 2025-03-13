// Dossier: src/controllers
// Fichier: reportController.js
// Contrôleur pour les fonctions de génération de rapports.

const { Company, User, Interlocutor } = require('../models/indexModels');
const logger = require('../utils/logger');

/**
 * Générer un rapport par type d'établissement.
 */
const reportByTypeEtablissement = async (req, res) => {
  try {
    const results = await Company.findAll({ /* regrouper par type, attributs, etc. */ });
    res.status(200).json({ data: results });
  } catch (error) {
    logger.error(`Erreur rapport par type établissement : ${error.message}`);
    res.status(500).json({ error: 'Erreur lors de la génération du rapport par type établissement' });
  }
};

/**
 * Générer un rapport par type d'organisation.
 */
const reportByTypeOrganisation = async (req, res) => {
  try {
    const results = await Company.findAll({ /* regrouper par type, attributs, etc. */ });
    res.status(200).json({ data: results });
  } catch (error) {
    logger.error(`Erreur rapport par type organisation : ${error.message}`);
    res.status(500).json({ error: 'Erreur lors de la génération du rapport par type organisation' });
  }
};

/**
 * Générer un rapport détaillé des entreprises.
 */
const detailedCompanyReport = async (req, res) => {
  try {
    const companies = await Company.findAll({
      include: [
        { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Interlocutor, as: 'interlocutors', attributes: ['id', 'firstName', 'lastName', 'email'] },
      ],
    });
    res.status(200).json(companies);
  } catch (error) {
    logger.error(`Erreur rapport détaillé : ${error.message}`);
    res.status(500).json({ error: 'Erreur lors de la génération du rapport' });
  }
};

module.exports = { reportByTypeEtablissement, reportByTypeOrganisation, detailedCompanyReport };
