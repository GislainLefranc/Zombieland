// Dossier : src/controllers
// Fichier : companyController.js

const { Op } = require('sequelize');
const { z } = require('zod');
const { sequelize } = require('../config/sequelize');
const { User, Company, Functioning, Interlocutor, InterlocutorCompany, Simulation } = require('../models/indexModels');
const {
  companySchema,
  companyUpdateSchema,
} = require('../validators/companyValidator');
const {
  assignSchema,
  assignUserToCompanySchema,
  assignCompaniesToInterlocutorsSchema,
  assignInterlocutorsToCompaniesSchema,
  setPrincipalInterlocutorSchema,
} = require('../validators/assignValidator');
const logger = require('../utils/logger');

/**
 * Crée une nouvelle entreprise ainsi que ses associations avec des interlocuteurs si fournis.
 * L'opération est réalisée dans une transaction pour garantir l'intégrité.
 */
const createCompany = async (req, res) => {
  try {
    const companyId = await sequelize.transaction(async (t) => {
      // Validation des données et ajout de l'identifiant du créateur
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
      const company = await Company.create(companyData, { transaction: t });

      // Association avec les interlocuteurs s'ils sont renseignés
      if (validatedData.interlocutors && validatedData.interlocutors.length > 0) {
        for (const iData of validatedData.interlocutors) {
          const normalizedEmail = iData.email.toLowerCase().trim();
          let existingInterlocutor = await Interlocutor.findOne({
            where: { email: normalizedEmail, userId: req.user.id },
            transaction: t,
          });
          if (!existingInterlocutor) {
            existingInterlocutor = await Interlocutor.create({
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
            }, { transaction: t });
          }
          // Association de l'interlocuteur à l'entreprise avec le statut principal
          await company.addInterlocutor(existingInterlocutor, {
            through: { isPrincipal: iData.isPrincipal || false },
            transaction: t,
          });
        }
      }
      return company.id;
    });

    // Récupération de l'entreprise créée avec ses associations
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
      logger.error('Erreur validation création entreprise :', error.errors);
      return res.status(400).json({
        error: 'Données invalides lors de la création de l\'entreprise',
        details: error.errors,
      });
    }
    logger.error('Erreur création entreprise :', error);
    res.status(500).json({ error: "Erreur lors de la création de l'entreprise" });
  }
};

/**
 * Récupère toutes les entreprises.
 * Pour l'administrateur, toutes les entreprises sont renvoyées.
 * Pour un Sales_User, seules les entreprises créées ou assignées à l'utilisateur sont récupérées.
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
    logger.error('Erreur récupération entreprises :', { error: error.message, stack: error.stack });
    res.status(500).json({
      error: 'Erreur lors de la récupération des entreprises',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Récupère une entreprise par son ID.
 */
const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findByPk(id, {
      include: [{
        model: Interlocutor,
        as: 'interlocutors',
        through: { attributes: ['isPrincipal'] },
        attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'position', 'comment']
      }]
    });

    if (!company) {
      return res.status(404).json({ error: 'Entreprise non trouvée' });
    }

    res.status(200).json(company);
  } catch (error) {
    logger.error(`Erreur dans getCompanyById : ${error.message}`);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'entreprise' });
  }
};

/**
 * Met à jour une entreprise et ses associations avec les interlocuteurs.
 * La mise à jour se fait dans une transaction pour garantir la cohérence.
 */
const updateCompany = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { id } = req.params;
    const validatedData = await companySchema.partial().parseAsync(req.body);

    const company = await Company.findByPk(id, {
      include: [{
        model: Interlocutor,
        as: 'interlocutors',
        through: { attributes: ['isPrincipal'] }
      }],
      transaction
    });

    if (!company) {
      throw new Error('Entreprise non trouvée');
    }

    // Mise à jour des informations de l'entreprise
    await company.update(validatedData, { transaction });

    // Si des interlocuteurs sont fournis, mettre à jour les associations
    if (Object.prototype.hasOwnProperty.call(validatedData, 'interlocutors')) {
      const existingInterlocutors = company.interlocutors;
      const newInterlocutorData = validatedData.interlocutors || [];

      // Suppression des associations absentes du nouveau payload
      for (const existingInterlocutor of existingInterlocutors) {
        const shouldRemove = !newInterlocutorData.find(
          (newInterlocutor) => newInterlocutor.id === existingInterlocutor.id
        );
        if (shouldRemove) {
          await InterlocutorCompany.destroy({
            where: { company_id: company.id, interlocutor_id: existingInterlocutor.id },
            transaction
          });
          console.log(`Interlocutor ${existingInterlocutor.id} supprimé de l'entreprise ${company.id}`);
        }
      }

      // Ajout ou mise à jour des associations existantes
      const validNewInterlocutors = newInterlocutorData.filter(interlocutor => interlocutor.id);
      for (const interlocutorData of validNewInterlocutors) {
        const existingAssociation = await InterlocutorCompany.findOne({
          where: { company_id: company.id, interlocutor_id: interlocutorData.id },
          transaction
        });

        if (!existingAssociation) {
          await InterlocutorCompany.create({
            company_id: company.id,
            interlocutor_id: interlocutorData.id,
            is_principal: interlocutorData.isPrincipal || false
          }, { transaction });
          console.log(`Interlocutor ${interlocutorData.id} ajouté à l'entreprise ${company.id}`);
        } else {
          await existingAssociation.update(
            { is_principal: interlocutorData.isPrincipal || false },
            { transaction }
          );
          console.log(`Interlocutor ${interlocutorData.id} mis à jour dans l'entreprise ${company.id}`);
        }
      }
    }

    await transaction.commit();

    const updatedCompany = await Company.findByPk(id, {
      include: [
        { model: Interlocutor, as: 'interlocutors', through: { attributes: ['isPrincipal'] } },
      ]
    });

    return res.status(200).json({
      message: "Entreprise mise à jour",
      company: updatedCompany
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    logger.error('Erreur mise à jour entreprise :', error);
    return res.status(500).json({
      error: error.message || "Erreur lors de la mise à jour de l'entreprise"
    });
  }
};

/**
 * Supprime une entreprise.
 * Si l'entreprise a des associations, elle est seulement dissociée (soft delete).
 * Sinon, elle est supprimée définitivement.
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
    // Vérifier les associations existantes
    const associatedInterlocutors = await company.getInterlocutors();
    const associatedUsers = await company.getUsers();

    if (associatedInterlocutors.length > 0 || associatedUsers.length > 0) {
      // Dissociation des interlocuteurs et utilisateurs
      await company.setInterlocutors([]);
      await company.setUsers([]);
      await transaction.commit();
      logger.info(`Entreprise ${id} dissociée des interlocuteurs et utilisateurs`);
      return res.status(200).json({ success: true, message: 'Entreprise dissociée (soft delete)' });
    } else {
      // Suppression définitive si aucune association
      await Simulation.destroy({
        where: { company_id: id },
        transaction
      });
      await company.destroy({ transaction, force: true });
      await transaction.commit();
      logger.info(`Entreprise ${id} supprimée définitivement`);
      return res.status(200).json({ success: true, message: 'Entreprise supprimée définitivement' });
    }
  } catch (error) {
    await transaction.rollback();
    logger.error('Erreur suppression entreprise :', { error: error.message, stack: error.stack, companyId: req.params.id });
    return res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Réassigne une entreprise à un autre utilisateur (Admin uniquement).
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
    logger.error(`Erreur réassignation entreprise : ${error.message}`);
    res.status(500).json({ error: "Erreur lors de la réassignation de l'entreprise" });
  }
};

/**
 * Récupère les entreprises associées à l'utilisateur connecté.
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
    logger.error('Erreur getMyCompanies :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * Assigne des interlocuteurs à une entreprise.
 */
const assignInterlocutorsToCompany = async (req, res) => {
  try {
    // Validation des données de la requête
    const validatedData = assignInterlocutorsToCompaniesSchema.parse({
      companyId: parseInt(req.params.id, 10),
      interlocutorIds: req.body.interlocutorIds,
    });

    const { companyId, interlocutorIds } = validatedData;
    // Appel du service pour réaliser l'assignation
    const result = await assignService.assignInterlocutorsToCompanies(interlocutorIds, companyId, req);

    if (result.success) {
      return res.status(200).json({ message: result.message });
    } else {
      return res.status(400).json({ message: result.message, error: result.error });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    logger.error(`Erreur assignation interlocuteurs : ${error.message}`, { stack: error.stack });
    return res.status(500).json({ error: 'Erreur lors de l\'assignation des interlocuteurs' });
  }
};

/**
 * Assigne un utilisateur à une entreprise (Admin uniquement).
 */
const assignUserToCompany = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ error: 'Accès refusé' });
    }
    const { id } = req.params;
    const { userId } = req.body;
    await assignUserToCompanySchema.parseAsync(req.body);
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
    logger.error(`Erreur assignation utilisateur : ${error.message}`);
    res.status(500).json({ error: "Erreur lors de l'assignation de l'utilisateur" });
  }
};

/**
 * Désassignation d'un utilisateur d'une entreprise (Admin uniquement).
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
    logger.error(`Erreur désassignation utilisateur : ${error.message}`);
    res.status(500).json({ error: 'Erreur lors de la désassignation de l\'utilisateur' });
  }
};

module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  reassignCompany,
  getMyCompanies,
  assignInterlocutorsToCompany,
  assignUserToCompany,
  unassignUserFromCompany,
};
