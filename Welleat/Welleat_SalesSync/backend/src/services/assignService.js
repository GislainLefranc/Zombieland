// Dossier : src/services
// Fichier : assignService.js
// Service d'assignation multiple.

const { Op } = require('sequelize');
const { sequelize } = require('../config/sequelize');
const {
  User,
  Company,
  Interlocutor,
  InterlocutorCompany,
  UserInterlocutor,
  UserCompany,
} = require('../models/indexModels');
const logger = require('../utils/logger');

/**
 * Service d'assignation multiple.
 */
class AssignService {
  /**
   * Point d'entrée principal pour l'assignation multiple.
   * Le payload doit contenir un itemType ('multiple') et éventuellement des tableaux de
   * user IDs, company IDs et interlocuteur IDs.
   *
   * @param {object} data - Données de l'assignation.
   * @param {object} req - Requête.
   * @returns {Promise<object>} Objet indiquant le succès de l'assignation.
   */
  async assignItems(data, req) {
    try {
      const { itemType, users, companies, interlocutors } = data;
      logger.debug(`assignItems appelé avec les données : ${JSON.stringify(data)}`);

      if (itemType !== 'multiple') {
        throw new Error("Type d'assignation non supporté");
      }

      if (companies && companies.length > 0) {
        if (users && users.length > 0) {
          for (const companyId of companies) {
            await this.assignUserToCompany(users, companyId, req);
          }
        }
        if (interlocutors && interlocutors.length > 0) {
          for (const companyId of companies) {
            await this.assignInterlocutorsToCompanies(interlocutors, companyId, req);
          }
        }
      } else if (interlocutors && interlocutors.length > 0) {
        await this.assignInterlocutorsToUser(interlocutors, req);
      }

      return { success: true, message: "Assignation réussie" };
    } catch (error) {
      logger.error(`Erreur dans assignItems : ${error.message}`, { stack: error.stack });
      throw error;
    }
  }

  /**
   * Assigne un ensemble d'interlocuteurs à un établissement et crée l'association entre l'utilisateur cible et chacun des interlocuteurs.
   *
   * @param {Array<number>} interlocutorIds - Liste des IDs des interlocuteurs.
   * @param {number} companyId - ID de l'établissement.
   * @param {object} req - Requête.
   * @returns {Promise<object>} Objet de succès.
   */
  async assignInterlocutorsToCompanies(interlocutorIds, companyId, req) {
    const t = await sequelize.transaction();
    try {
      const targetUserId = req.body.userId || req.user.id;
      for (const interlocutorId of interlocutorIds) {
        await InterlocutorCompany.findOrCreate({
          where: { interlocutor_id: interlocutorId, company_id: companyId },
          defaults: { interlocutor_id: interlocutorId, company_id: companyId },
          transaction: t,
        });
  
        await UserInterlocutor.findOrCreate({
          where: { user_id: targetUserId, interlocutor_id: interlocutorId },
          defaults: { user_id: targetUserId, interlocutor_id: interlocutorId },
          transaction: t,
        });
      }
  
      await t.commit();
      return { success: true, message: "Interlocuteurs assignés correctement" };
    } catch (error) {
      if (!t.finished) await t.rollback();
      logger.error(`Erreur dans assignInterlocutorsToCompanies : ${error.message}`, { stack: error.stack });
      throw error;
    }
  }

  /**
   * Assigne un ensemble d'interlocuteurs directement à un utilisateur.
   *
   * @param {Array<number>} interlocutorIds - Liste des IDs des interlocuteurs.
   * @param {object} req - Requête.
   * @returns {Promise<object>} Objet de succès avec l'ID de l'utilisateur.
   */
  async assignInterlocutorsToUser(interlocutorIds, req) {
    const t = await sequelize.transaction();
    try {
      const targetUserId = req.body.userId || req.user.id;
      
      if (!targetUserId) {
        throw new Error('ID utilisateur manquant');
      }
  
      for (const interlocutorId of interlocutorIds) {
        await UserInterlocutor.findOrCreate({
          where: { 
            user_id: targetUserId, 
            interlocutor_id: interlocutorId 
          },
          defaults: { 
            user_id: targetUserId, 
            interlocutor_id: interlocutorId,
            is_principal: false 
          },
          transaction: t
        });
  
        logger.info(`Interlocuteur ${interlocutorId} assigné à l'utilisateur ${targetUserId}`);
      }
  
      await t.commit();
      return { 
        success: true, 
        message: "Assignation réussie (User <-> Interlocutor)",
        userId: targetUserId 
      };
    } catch (error) {
      if (!t.finished) await t.rollback();
      logger.error(`Erreur dans assignInterlocutorsToUser : ${error.message}`, { 
        stack: error.stack,
        requestBody: req.body 
      });
      throw error;
    }
  }

  /**
   * Assigne un ensemble d'établissements à un interlocuteur.
   *
   * @param {Array<number>} companyIds - Liste des IDs des établissements.
   * @param {number} interlocutorId - ID de l'interlocuteur.
   * @param {object} req - Requête.
   * @returns {Promise<object>} Objet de succès.
   */
  async assignCompaniesToInterlocutors(companyIds, interlocutorId, req) {
    const t = await sequelize.transaction();
    try {
      logger.debug({ companyIds, interlocutorId });
      const interlocuteur = await Interlocutor.findByPk(interlocutorId, { transaction: t });
      if (!interlocuteur) {
        throw new Error('Interlocuteur non trouvé');
      }
      for (const companyId of companyIds) {
        const company = await Company.findByPk(companyId, { transaction: t });
        if (!company) {
          throw new Error(`Entreprise non trouvée : ${companyId}`);
        }
        const existingAssociation = await InterlocutorCompany.findOne({
          where: { interlocutorId, companyId },
          transaction: t,
        });
        if (!existingAssociation) {
          await InterlocutorCompany.create({
            interlocutorId,
            companyId,
            isPrincipal: false,
          }, { transaction: t });
        } else {
          logger.warn(`Association existante pour interlocuteur ${interlocutorId} et entreprise ${companyId}`);
        }
      }
      await t.commit();
      return { success: true, message: 'Assignation réussie' };
    } catch (error) {
      if (!t.finished) await t.rollback();
      logger.error(`Erreur dans assignCompaniesToInterlocutors : ${error.message}`, { stack: error.stack });
      throw error;
    }
  }

  /**
   * Assigne un ensemble d'utilisateurs à un établissement.
   *
   * @param {Array<number>} userIds - Liste des IDs des utilisateurs.
   * @param {number} companyId - ID de l'établissement.
   * @param {object} req - Requête.
   * @returns {Promise<object>} Objet de succès incluant l'établissement mis à jour.
   */
  async assignUserToCompany(userIds, companyId, req) {
    const t = await sequelize.transaction();
    try {
      logger.debug({ userIds, companyId });
      const company = await Company.findByPk(companyId, { transaction: t });
      if (!company) {
        throw new Error('Entreprise non trouvée');
      }
      for (const userId of userIds) {
        await company.addUser(userId, { transaction: t });
      }
      await t.commit();
      const updatedCompany = await Company.findByPk(companyId, {
        include: [{ model: User, as: 'users', through: { attributes: [] } }],
      });
      logger.info(`Assignation des utilisateurs à l'entreprise ${companyId} réussie`);
      return { success: true, message: 'Assignation réussie', company: updatedCompany };
    } catch (error) {
      if (!t.finished) await t.rollback();
      logger.error(`Erreur dans assignUserToCompany : ${error.message}`, { stack: error.stack });
      throw error;
    }
  }

  /**
   * Définit un interlocuteur comme principal pour un établissement.
   * Réinitialise le statut isPrincipal pour toutes les associations de l'établissement.
   *
   * @param {number} companyId - ID de l'établissement.
   * @param {number} interlocutorId - ID de l'interlocuteur.
   * @returns {Promise<object>} Objet de succès.
   */
  async setPrincipalInterlocutor(companyId, interlocutorId) {
    const t = await sequelize.transaction();
    try {
      // Réinitialiser tous les interlocuteurs comme non principaux
      await InterlocutorCompany.update(
        { isPrincipal: false },
        {
          where: { company_id: companyId },
          transaction: t
        }
      );
  
      // Mettre à jour ou créer la relation avec isPrincipal à true
      const [interlocutorCompany] = await InterlocutorCompany.findOrCreate({
        where: {
          company_id: companyId,
          interlocutor_id: interlocutorId
        },
        defaults: {
          isPrincipal: true,
          company_id: companyId,
          interlocutor_id: interlocutorId
        },
        transaction: t
      });
  
      await interlocutorCompany.update({ isPrincipal: true }, { transaction: t });
  
      await t.commit();
      return {
        success: true,
        message: "Interlocuteur principal mis à jour avec succès"
      };
  
    } catch (error) {
      await t.rollback();
      console.error("Erreur setPrincipalInterlocutor :", error);
      throw error;
    }
  }
}

module.exports = new AssignService();
