// Dossier: src/controllers
// Fichier: companyController.js

const { Op } = require('sequelize');
const { z } = require('zod');
const { sequelize } = require('../config/sequelize');
const { 
  User, 
  Company, 
  Functioning, 
  Interlocutor, 
  InterlocutorCompany, 
  Simulation 
} = require('../models/indexModels');
const { 
  companySchema, 
  assignUserToCompanySchema, 
  assignInterlocutorsToCompanySchema 
} = require('../validators/companyValidator');
const logger = require('../utils/logger');
const { assignSchema } = require('../validators/assignValidator');
const assignService = require('../services/assignService');

/**
 * Assigner des interlocuteurs à une entreprise.
 */
const assignHandler = async (req, res) => {
  try {
    // Valider le corps de la requête avec le schéma
    const validatedData = assignSchema.parse(req.body);

    // Appeler la fonction assignItems du service avec les données validées et l'objet req
    const result = await assignService.assignItems(validatedData, req);

    if (result.success) {
      return res.status(200).json({ message: result.message });
    } else {
      return res.status(400).json({ message: result.message, error: result.error });
    }
  } catch (error) {
    logger.error(`Erreur dans assignHandler: ${error.message}`, { stack: error.stack });
    if (error.message === 'Entreprise non trouvée') {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Erreur lors de l\'assignation' });
  }
};

/**
 * Créer une nouvelle entreprise.
 * (Create a new company.)
 */
const createCompany = async (req, res) => {
  try {
    // Transaction pour garantir l'intégrité lors de la création et des associations
    // (Transaction to ensure integrity during creation and associations)
    const companyId = await sequelize.transaction(async (t) => {
      // Validation des données entrantes et ajout de l'identifiant du créateur
      // (Validate incoming data and add creator id)
      const validatedData = await companySchema.parseAsync({
        ...req.body,
        createdBy: req.user.id,
      });

      const companyData = {
        name: validatedData.name,
        address: validatedData.address,
        city: validatedData.city,
        postalCode: validatedData.postalCode,
        comments: validatedData.comments,
        establishmentType: validatedData.establishmentType,
        organizationType: validatedData.organizationType,
        numberOfCanteens: validatedData.numberOfCanteens,
        numberOfCentralKitchens: validatedData.numberOfCentralKitchens,
        created_by: req.user.id,
      };

      // Création de l'entreprise
      // (Create the company)
      const company = await Company.create(companyData, { transaction: t });

      // Gestion des interlocuteurs s'ils sont fournis
      // (Handle interlocutors if provided)
      if (validatedData.interlocutors && validatedData.interlocutors.length > 0) {
        for (const iData of validatedData.interlocutors) {
          const normalizedEmail = iData.email.toLowerCase().trim();
          let existingInterlocutor = await Interlocutor.findOne({
            where: { email: normalizedEmail, userId: req.user.id },
            transaction: t,
          });
          if (!existingInterlocutor) {
            existingInterlocutor = await Interlocutor.create(
              {
                firstName: iData.firstName.trim(),
                lastName: iData.lastName.trim(),
                email: normalizedEmail,
                phone: iData.phone?.trim() || null,
                position: iData.position?.trim() || null,
                interlocutorType: validatedData.establishmentType,
                comment: iData.comment?.trim() || null,
                isPrincipal: Boolean(iData.isPrincipal),
                isIndependent: Boolean(iData.isIndependent),
                userId: req.user.id,
              },
              { transaction: t }
            );
          }
          // Association de l'interlocuteur à l'entreprise avec le statut principal défini
          // (Associate the interlocutor to the company with the specified principal status)
          await company.addInterlocutor(existingInterlocutor, {
            through: { isPrincipal: iData.isPrincipal || false },
            transaction: t,
          });
        }
      }

      return company.id;
    });

    // Récupération de l'entreprise créée avec ses associations
    // (Retrieve the created company along with its associations)
    const createdCompany = await Company.findByPk(companyId, {
      include: [
        {
          model: Interlocutor,
          as: 'interlocutors',
          through: { attributes: ['isPrincipal'] }
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'position', 'roleId']
        },
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'position', 'roleId']
        },
        {
          model: Functioning,
          as: 'functionings'
        }
      ]
    });

    res.status(201).json({
      message: 'Entreprise créée avec succès',
      company: createdCompany,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error('Erreur validation création entreprise:', error.errors);
      return res.status(400).json({
        error: 'Données invalides lors de la création de l\'entreprise',
        details: error.errors,
      });
    }
    logger.error('Erreur création entreprise:', error);
    res.status(500).json({ error: "Erreur lors de la création de l'entreprise" });
  }
};

/**
 * Récupérer toutes les entreprises.
 * (Retrieve all companies.)
 * Pour Admin, toutes les entreprises sont retournées ; pour Sales_User, seulement celles créées ou assignées.
 * (For Admin, all companies are returned; for Sales_User, only those created or assigned.)
 */
const getAllCompanies = async (req, res) => {
  try {
    let companies;
    if (req.user.roleId === 1) {
      companies = await Company.findAll({
        include: [
          { model: Interlocutor, as: 'interlocutors', through: { attributes: ['isPrincipal'] } },
          { model: User, as: 'creator' },
          { model: User, as: 'assignedUser' },
          { model: Functioning, as: 'functionings' },
        ],
      });
    } else {
      companies = await Company.findAll({
        where: { [Op.or]: [{ created_by: req.user.id }, { assigned_to: req.user.id }] },
        include: [
          { model: Interlocutor, as: 'interlocutors', through: { attributes: ['isPrincipal'] } },
          { model: User, as: 'creator' },
          { model: User, as: 'assignedUser' },
          { model: Functioning, as: 'functionings' },
        ],
      });
    }
    res.json(companies);
  } catch (error) {
    logger.error('Erreur récupération entreprises:', { error: error.message, stack: error.stack });
    res.status(500).json({
      error: 'Erreur lors de la récupération des entreprises',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Récupérer une entreprise par son ID.
 * (Retrieve a company by its ID.)
 */
const getCompanyById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID invalide' });
    }
    const company = await Company.findByPk(id, {
      include: [
        { 
          model: Interlocutor, 
          as: 'interlocutors',
          through: { attributes: ['isPrincipal'] },
          attributes: ['id', 'lastName', 'firstName', 'email', 'phone', 'position', 'interlocutorType', 'comment', 'isPrincipal', 'isIndependent']
        },
        { 
          model: User, 
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'position', 'roleId'] 
        },
        { 
          model: User, 
          as: 'assignedUser',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'position', 'roleId']
        },
        { 
          model: Functioning, 
          as: 'functionings' 
        }
      ]
    });
    if (!company) {
      return res.status(404).json({ message: 'Entreprise non trouvée' });
    }
    res.json(company);
  } catch (error) {
    logger.error(`Erreur récupération entreprise: ${error.message}`);
    res.status(500).json({ message: "Erreur serveur lors de la récupération de l'entreprise" });
  }
};

/**
 * Supprimer une entreprise.
 * (Delete a company.)
 */
const deleteCompany = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const company = await Company.findByPk(id, { transaction });
    if (!company) {
      await transaction.rollback();
      return res.status(404).json({ success: false, error: 'Entreprise non trouvée' });
    }
    // Suppression des simulations associées
    // (Delete associated simulations)
    await Simulation.destroy({
      where: { company_id: id },
      transaction
    });
    // Dissociation de tous les interlocuteurs
    // (Dissociate all interlocutors)
    await company.setInterlocutors([], { transaction });
    await company.destroy({ transaction });
    await transaction.commit();
    logger.info(`Entreprise ${id} supprimée avec succès`);
    return res.status(200).json({ success: true, message: 'Entreprise supprimée avec succès' });
  } catch (error) {
    await transaction.rollback();
    logger.error('Erreur suppression entreprise:', { error: error.message, stack: error.stack, companyId: req.params.id });
    return res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Réassigner une entreprise (Admin uniquement).
 * (Reassign a company - Admin only.)
 */
const reassignCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { newAssignedTo } = req.body;
    if (req.user.roleId !== 1) {
      return res.status(403).json({ error: 'Accès refusé' });
    }
    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(404).json({ error: 'Entreprise non trouvée' });
    }
    const user = await User.findByPk(newAssignedTo);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    await company.update({ assigned_to: newAssignedTo });
    res.status(200).json({ message: 'Entreprise réassignée avec succès', company });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    logger.error(`Erreur réassignation entreprise: ${error.message}`);
    res.status(500).json({ error: "Erreur lors de la réassignation de l'entreprise" });
  }
};

/**
 * Récupérer les entreprises de l'utilisateur connecté.
 * (Retrieve companies for the connected user.)
 */
const getMyCompanies = async (req, res) => {
  try {
    const userId = req.user.id;
    const companies = await Company.findAll({
      where: {
        [Op.or]: [{ created_by: userId }, { assigned_to: userId }],
      },
      include: [
        { 
          model: Interlocutor, 
          as: 'interlocutors',
          attributes: ['id', 'lastName', 'firstName', 'email', 'phone', 'position', 'interlocutorType', 'isPrincipal'],
          through: { attributes: ['isPrincipal'] }
        },
        { 
          model: User, 
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email', 'position'] 
        },
        { 
          model: User, 
          as: 'assignedUser',
          attributes: ['id', 'firstName', 'lastName', 'email', 'position']
        },
        { 
          model: Functioning, 
          as: 'functionings',
          attributes: ['id', 'typeOfFunctioning']
        }
      ],
      attributes: [
        'id', 'name', 'address', 'city', 'postalCode', 'comments',
        'establishmentType', 'organizationType', 'numberOfCanteens', 'numberOfCentralKitchens',
        'created_by', 'assigned_to', 'createdAt', 'updatedAt'
      ]
    });
    res.status(200).json(companies);
  } catch (error) {
    logger.error('Erreur getMyCompanies:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * Assigner des interlocuteurs à une entreprise.
 * (Assign interlocutors to a company.)
 */
const assignInterlocutorsToCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { interlocutorIds } = req.body;
    const validatedData = await assignInterlocutorsToCompanySchema.parseAsync(req.body);
    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(404).json({ error: 'Entreprise non trouvée' });
    }
    const interlocutors = await Interlocutor.findAll({
      where: { id: interlocutorIds },
    });
    if (interlocutors.length !== interlocutorIds.length) {
      return res.status(400).json({ error: "Certains interlocuteurs n'existent pas" });
    }
    await sequelize.transaction(async (t) => {
      for (const interlocutor of interlocutors) {
        await interlocutor.update({ primaryCompanyId: company.id }, { transaction: t });
      }
    });
    res.status(200).json({ message: "Interlocuteurs assignés avec succès à l'entreprise" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    logger.error(`Erreur assignation interlocuteurs: ${error.message}`);
    res.status(500).json({ error: "Erreur lors de l'assignation des interlocuteurs" });
  }
};

/**
 * Assigner un utilisateur à une entreprise (Admin uniquement).
 * (Assign a user to a company - Admin only.)
 */
const assignUserToCompany = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ error: 'Accès refusé' });
    }
    const { id } = req.params;
    const { userId } = assignUserToCompanySchema.parse(req.body);
    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(404).json({ error: 'Entreprise non trouvée' });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    await company.update({ assigned_to: userId });
    res.status(200).json({ message: 'Utilisateur assigné avec succès', company });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    logger.error(`Erreur assignation utilisateur: ${error.message}`);
    res.status(500).json({ error: "Erreur lors de l'assignation de l'utilisateur" });
  }
};

/**
 * Désassigner un utilisateur d'une entreprise (Admin uniquement).
 * (Unassign a user from a company - Admin only.)
 */
const unassignUserFromCompany = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ error: 'Accès refusé' });
    }
    const { id } = req.params;
    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(404).json({ error: 'Entreprise non trouvée.' });
    }
    await company.update({ assigned_to: null });
    res.status(200).json({ message: 'Utilisateur désassigné avec succès', company });
  } catch (error) {
    logger.error(`Erreur désassignation utilisateur: ${error.message}`);
    res.status(500).json({ error: 'Erreur lors de la désassignation de l\'utilisateur' });
  }
};

const assignCompaniesToInterlocutors = async (req, res) => {
  const { companies, assignToInterlocutorId } = req.body;
  try {
    await assignService.assignCompaniesToInterlocutors(companies, assignToInterlocutorId, req, res);
  } catch (error) {
    console.error("Error in assignCompaniesToInterlocutors:", error);
    return res.status(500).json({ error: "Failed to assign companies to interlocutors" });
  }
};

const setPrincipalInterlocutor = async (req, res) => {
  const { companyId, interlocutorId } = req.params;
  const t = await sequelize.transaction();

  try {
    // Réinitialiser tous les interlocuteurs comme non principaux
    await InterlocutorCompany.update(
      { is_principal: false },
      {
        where: { company_id: companyId },
        transaction: t
      }
    );

    // Définir le nouvel interlocuteur principal
    await InterlocutorCompany.update(
      { is_principal: true },
      {
        where: {
          company_id: companyId,
          interlocutor_id: interlocutorId
        },
        transaction: t
      }
    );

    await t.commit();
    res.json({ success: true, message: 'Interlocuteur principal mis à jour' });
  } catch (error) {
    await t.rollback();
    console.error('Erreur setPrincipalInterlocutor:', error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la mise à jour de l'interlocuteur principal" 
    });
  }
};

const getAssignedData = async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('Récupération des données pour userId:', userId);

    const userData = await User.findByPk(userId, {
      include: [
        {
          model: Company,
          as: 'companies',
          through: { attributes: [] },
          attributes: ['id', 'name', 'address', 'city', 'postalCode']
        },
        {
          model: Interlocutor,
          as: 'interlocutors',
          through: { 
            model: 'Users_Interlocutors',
            attributes: ['isPrincipal']
          },
          attributes: [
            'id',
            'firstName',
            'lastName',
            'email',
            'phone',
            'position',
            'comment',
            'isPrincipal'
          ]
        }
      ],
      attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'position']
    });

    if (!userData) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Log des données avant envoi
    console.log('Données utilisateur trouvées:', {
      id: userData.id,
      interlocutorsCount: userData.interlocutors?.length || 0,
      companiesCount: userData.companies?.length || 0
    });

    res.json(userData);
  } catch (error) {
    console.error('Erreur dans getAssignedData:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = {
  getAssignedData,
  assignHandler,
  createCompany,
  getAllCompanies,
  getCompanyById,
  deleteCompany,
  reassignCompany,
  getMyCompanies,
  assignInterlocutorsToCompany,
  assignUserToCompany,
  assignSchema,
  unassignUserFromCompany,
  assignCompaniesToInterlocutors,
  setPrincipalInterlocutor,
};
