//Dossier: src/controllers
//Fichier: interlocutorController.js
//Contrôleur pour les interlocuteurs


const { Interlocutor, Company, User, InterlocutorCompany } = require('../models/indexModels');
const { z } = require('zod');
const { interlocutorSchema, emailCheckSchema } = require('../validators/interlocutorValidator');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

/**
 * Créer un nouvel interlocuteur.
 */
const createInterlocutor = async (req, res) => {
  try {
    const data = interlocutorSchema.parse({ ...req.body, userId: req.user.id });
    if (data.primaryCompanyId) {
      const company = await Company.findByPk(data.primaryCompanyId);
      if (!company) {
        return res.status(400).json({ error: 'Entreprise non trouvée' });
      }
    }
    const newInterlocutor = await Interlocutor.create(data);
    return res.status(201).json({ message: 'Interlocuteur créé avec succès', interlocutor: newInterlocutor });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Interlocuteur déjà existant' });
    }
    logger.error(`Erreur création interlocuteur : ${error.message}`);
    return res.status(500).json({ error: "Erreur lors de la création de l'interlocuteur" });
  }
};

/**
 * Récupérer tous les interlocuteurs selon le rôle de l'utilisateur.
 */
const getAllInterlocutors = async (req, res) => {
  try {
    const user = req.user;
    let interlocutors;
    if (user.roleId === 1) {
      interlocutors = await Interlocutor.findAll({
        include: [{
          model: Company,
          as: 'companies',
          attributes: ['id', 'name'],
          include: [{
            model: User,
            as: 'users',
            attributes: ['id', 'firstName', 'lastName'],
            through: { attributes: [] }
          }]
        }],
      });
    } else if (user.roleId === 2) {
      interlocutors = await Interlocutor.findAll({
        include: [{
          model: Company,
          as: 'companies',
          attributes: ['id', 'name'],
          where: { [Op.or]: [{ created_by: user.id }, { assigned_to: user.id }] },
          required: false,
        }],
        distinct: true,
      });
    } else {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    return res.status(200).json(interlocutors);
  } catch (error) {
    logger.error(`Erreur récupération interlocuteurs : ${error.message}`);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Récupérer un interlocuteur par son ID.
 */
const getInterlocutorById = async (req, res) => {
  try {
    const { id } = req.params;
    const interlocutor = await Interlocutor.findByPk(id, {
      include: [{
        model: Company,
        as: 'companies',
        attributes: ['id', 'name'],
        include: [{
          model: User,
          as: 'users',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }]
      }],
    });
    if (!interlocutor) {
      return res.status(404).json({ error: 'Interlocuteur non trouvé' });
    }
    const user = req.user;
    if (user.roleId === 2) {
      const isCreator = interlocutor.companies.some(company => company.created_by === user.id);
      const isAssigned = interlocutor.companies.some(company => company.users.some(u => u.id === user.id));
      if (!isCreator && !isAssigned) {
        return res.status(403).json({ message: 'Accès refusé' });
      }
    }
    return res.status(200).json(interlocutor);
  } catch (error) {
    logger.error(`Erreur récupération interlocuteur par ID : ${error.message}`);
    return res.status(500).json({ error: "Erreur lors de la récupération de l'interlocuteur" });
  }
};

/**
 * Mettre à jour un interlocuteur.
 */
const updateInterlocutor = async (req, res) => {
  try {
    const { id } = req.params;
    const data = interlocutorSchema.partial().parse(req.body);
    const interlocutor = await Interlocutor.findByPk(id);
    if (!interlocutor) {
      return res.status(404).json({ error: 'Interlocuteur non trouvé' });
    }
    if (interlocutor.primaryCompanyId) {
      const count = await Interlocutor.count({ where: { primaryCompanyId: interlocutor.primaryCompanyId } });
      if (count === 1) {
        await interlocutor.update({ isPrincipal: true });
      }
    }
    await interlocutor.update(data);
    return res.status(200).json({ message: 'Interlocuteur mis à jour avec succès', interlocutor });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Un interlocuteur avec cet email existe déjà.' });
    }
    logger.error(`Erreur mise à jour interlocuteur : ${error.message}`);
    return res.status(500).json({ error: "Erreur lors de la mise à jour de l'interlocuteur" });
  }
};

/**
 * Supprimer un interlocuteur (soft delete si associations, sinon suppression définitive).
 */
const deleteInterlocutor = async (req, res) => {
  try {
    const { id } = req.params;
    const interlocutor = await Interlocutor.findByPk(id);
    if (!interlocutor) return res.status(404).json({ error: 'Interlocuteur non trouvé' });
    const associatedCompanies = await interlocutor.getCompanies();
    const associatedUsers = await interlocutor.getUsers();
    if (associatedCompanies.length > 0 || associatedUsers.length > 0) {
      await interlocutor.update({ deleted: true });
      return res.status(200).json({ message: 'Interlocuteur marqué comme supprimé (soft delete)' });
    } else {
      await interlocutor.destroy({ force: true });
      return res.status(200).json({ message: 'Interlocuteur supprimé définitivement' });
    }
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de la suppression de l'interlocuteur" });
  }
};

/**
 * Récupérer les interlocuteurs indépendants.
 */
const getIndependentInterlocutors = async (req, res) => {
  try {
    const independentInterlocutors = await Interlocutor.findAll({
      where: { isIndependent: true },
      include: [
        { model: Company, as: 'companies', attributes: ['id', 'name'] },
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
      ],
    });
    return res.status(200).json(independentInterlocutors);
  } catch (error) {
    logger.error(`Erreur récupération interlocuteurs indépendants : ${error.message}`);
    return res.status(500).json({ error: 'Erreur lors de la récupération des interlocuteurs indépendants', details: error.message });
  }
};

/**
 * Vérifier l'existence d'emails parmi les interlocuteurs.
 */
const checkInterlocutorEmails = async (req, res) => {
  try {
    const { emails } = req.body;
    const existingInterlocutors = await Interlocutor.findAll({
      where: { email: { [Op.in]: emails }, userId: req.user.id },
      include: [{ model: Company, as: 'companies', attributes: ['name'] }],
    });
    const existingEmails = existingInterlocutors.map(i => ({
      email: i.email,
      name: `${i.firstName} ${i.lastName}`,
      companies: i.companies.map(c => c.name).join(', '),
    }));
    return res.status(200).json({
      existingEmails,
      message: existingEmails.length > 0
        ? `Ces emails sont déjà utilisés : ${existingEmails.map(e => `${e.name} (${e.email}) - ${e.companies || 'Aucune entreprise'}`).join(', ')}`
        : 'Aucun email en doublon',
    });
  } catch (error) {
    logger.error(`Erreur vérification emails : ${error.message}`);
    return res.status(500).json({ error: 'Erreur lors de la vérification des emails' });
  }
};

/**
 * Mettre à jour le statut principal d'un interlocuteur pour une entreprise.
 */
const updateInterlocutorPrincipal = async (req, res) => {
  try {
    const { id } = req.params; // ID de l'interlocuteur
    const { companyId, isPrincipal } = req.body;
    let association = await InterlocutorCompany.findOne({ where: { interlocutor_id: id, company_id: companyId } });
    if (!association) {
      association = await InterlocutorCompany.create({
        interlocutor_id: id,
        company_id: companyId,
        isPrincipal: !!isPrincipal,
      });
      return res.status(201).json({ message: 'Association créée avec succès', association });
    }
    if (isPrincipal) {
      const oldPrincipal = await InterlocutorCompany.findOne({
        where: { company_id: companyId, isPrincipal: true, interlocutor_id: { [Op.ne]: id } },
      });
      if (oldPrincipal) {
        oldPrincipal.isPrincipal = false;
        await oldPrincipal.save();
      }
    }
    association.isPrincipal = !!isPrincipal;
    await association.save();
    return res.status(200).json({ message: 'Statut principal mis à jour', association });
  } catch (error) {
    logger.error(`Erreur updateInterlocutorPrincipal : ${error.message}`);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = {
  createInterlocutor,
  getAllInterlocutors,
  getInterlocutorById,
  updateInterlocutor,
  deleteInterlocutor,
  getIndependentInterlocutors,
  checkInterlocutorEmails,
  updateInterlocutorPrincipal,
};
