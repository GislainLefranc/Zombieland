// Dossier : src/controllers
// Fichier : interlocutorCompanyController.js
// Contrôleurs pour la gestion des associations interlocuteurs-entreprises


const { Interlocutor, Company, InterlocutorCompany, sequelize } = require('../models/indexModels');
const { z } = require('zod');
const { assignInterlocutorToCompanySchema } = require('../validators/interlocutorCompanyValidator');
const logger = require('../utils/logger');

/**
 * Assigner un interlocuteur à une entreprise.
 */
const assignInterlocutorToCompany = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    if (!req.user || ![1, 2].includes(req.user.roleId)) {
      await t.rollback();
      return res.status(403).json({ error: 'Accès non autorisé' });
    }
    const data = assignInterlocutorToCompanySchema.parse(req.body);
    const { interlocutorId, companyId, isPrincipal } = data;
    logger.info(`Assignation de l'interlocuteur ${interlocutorId} à l'entreprise ${companyId} (isPrincipal: ${isPrincipal})`);
    const interlocutor = await Interlocutor.findByPk(interlocutorId, { transaction: t });
    if (!interlocutor) {
      logger.warn(`Interlocuteur non trouvé : ${interlocutorId}`);
      await t.rollback();
      return res.status(404).json({ error: 'Interlocuteur non trouvé.' });
    }
    const company = await Company.findByPk(companyId, { transaction: t });
    if (!company) {
      logger.warn(`Entreprise non trouvée : ${companyId}`);
      await t.rollback();
      return res.status(404).json({ error: 'Entreprise non trouvée.' });
    }
    const existingAssociation = await InterlocutorCompany.findOne({
      where: { interlocutor_id: interlocutorId, company_id: companyId },
      transaction: t,
    });
    if (existingAssociation) {
      logger.warn(`Association existante entre interlocuteur ${interlocutorId} et entreprise ${companyId}`);
      await t.rollback();
      return res.status(400).json({ error: 'Cet interlocuteur est déjà associé à cette entreprise.' });
    }
    const association = await InterlocutorCompany.create(
      { interlocutor_id: interlocutorId, company_id: companyId, isPrincipal: isPrincipal || false },
      { transaction: t }
    );
    await t.commit();
    res.status(201).json({ message: 'Interlocuteur assigné avec succès', association });
  } catch (error) {
    await t.rollback();
    if (error instanceof z.ZodError)
      return res.status(400).json({ errors: error.errors });
    logger.error(`Erreur assignation interlocuteur à entreprise : ${error.message}`);
    res.status(500).json({ error: "Erreur serveur lors de l'assignation de l'interlocuteur." });
  }
};

/**
 * Supprimer l'association d'un interlocuteur à une entreprise.
 */
const removeInterlocutorFromCompany = async (req, res) => {
  try {
    const { interlocutorId, companyId } = req.params;
    logger.info(`Désassignation de l'interlocuteur ${interlocutorId} de l'entreprise ${companyId}`);
    const association = await InterlocutorCompany.findOne({
      where: { interlocutor_id: interlocutorId, company_id: companyId },
    });
    if (!association) {
      logger.warn(`Association non trouvée pour interlocuteur ${interlocutorId} et entreprise ${companyId}`);
      return res.status(404).json({ error: 'Association non trouvée.' });
    }
    await association.destroy();
    logger.info(`Association supprimée pour interlocuteur ${interlocutorId} et entreprise ${companyId}`);
    res.status(200).json({ message: "Interlocuteur désassigné de l'entreprise avec succès." });
  } catch (error) {
    logger.error(`Erreur désassignation interlocuteur : ${error.message}`);
    res.status(500).json({ error: "Erreur serveur lors de la désassignation de l'interlocuteur." });
  }
};

/**
 * Mettre à jour le statut principal d'une association.
 */
const updatePrincipalStatus = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { interlocutorId, companyId } = req.params;
    const { isPrincipal } = req.body;
    if (isPrincipal === true) {
      await InterlocutorCompany.update(
        { isPrincipal: false },
        { where: { company_id: companyId }, transaction: t }
      );
    }
    const [updatedCount] = await InterlocutorCompany.update(
      { isPrincipal },
      { where: { interlocutor_id: interlocutorId, company_id: companyId }, transaction: t }
    );
    if (updatedCount === 0) {
      await t.rollback();
      return res.status(404).json({ error: "Aucune association mise à jour" });
    }
    await t.commit();
    return res.status(200).json({ message: "Statut principal mis à jour avec succès" });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ error: "Erreur lors de la mise à jour du statut principal" });
  }
};

/**
 * Récupérer les interlocuteurs associés à une entreprise.
 */
const getInterlocutorsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    logger.info(`Récupération des interlocuteurs pour l'entreprise ${companyId}`);
    const rawAssociations = await sequelize.query(
      'SELECT * FROM "Interlocutors_Companies" WHERE company_id = :companyId',
      {
        replacements: { companyId },
        type: sequelize.QueryTypes.SELECT
      }
    );
    logger.info(`Associations brutes trouvées : ${JSON.stringify(rawAssociations)}`);
    const company = await Company.findByPk(companyId, {
      include: [{
        model: Interlocutor,
        as: 'interlocutors',
        through: { model: InterlocutorCompany, attributes: ['isPrincipal'] },
        attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'position', 'interlocutorType']
      }],
      logging: console.log
    });
    if (!company) {
      logger.warn(`Entreprise ${companyId} non trouvée`);
      return res.status(404).json({ error: 'Entreprise non trouvée' });
    }
    logger.info('Détails complets de l\'entreprise :', JSON.stringify(company.toJSON(), null, 2));
    res.status(200).json(company.interlocutors || []);
  } catch (error) {
    logger.error(`Erreur récupération interlocuteurs : ${error.message}`);
    logger.error(error.stack);
    res.status(500).json({ error: 'Erreur lors de la récupération des interlocuteurs.' });
  }
};

module.exports = {
  assignInterlocutorToCompany,
  removeInterlocutorFromCompany,
  getInterlocutorsByCompany,
  updatePrincipalStatus,
};
