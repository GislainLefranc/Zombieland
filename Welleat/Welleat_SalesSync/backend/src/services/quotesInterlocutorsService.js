// Dossier: services
// Fichier: quotesInterlocutorsService.js
// Service pour les associations devis-interlocuteurs

const { Quote, InterlocutorCompany, QuotesInterlocutors } = require('../models/indexModels');
const { sequelize } = require('../config/sequelize');
const logger = require('../utils/logger');
const { ErrorService } = require('./utils/errorService');

class QuotesInterlocutorsService {
  /**
   * Ajoute des interlocuteurs à un devis.
   * 
   * @param {number} quoteId - ID du devis.
   * @param {number[]} interlocutorIds - Liste des IDs des interlocuteurs à ajouter.
   * @param {import('sequelize').Transaction} [transaction] - Transaction Sequelize (optionnelle).
   * @returns {Promise<void>}
   */
  static async addInterlocutorsToQuote(quoteId, interlocutorIds, transaction) {
    try {
      // Récupération du devis par son ID
      const quote = await Quote.findByPk(quoteId, { transaction });
      if (!quote) {
        throw new Error('Devis non trouvé');
      }

      // Vérification de l'affiliation de chaque interlocuteur à l'entreprise du devis
      for (const interlocutorId of interlocutorIds) {
        const isLinked = await InterlocutorCompany.findOne({
          where: {
            interlocutor_id: interlocutorId,
            company_id: quote.company_id
          },
          transaction
        });

        if (!isLinked) {
          logger.warn(`Attention : L'interlocuteur ${interlocutorId} n'est pas lié à l'entreprise du devis ${quoteId}`);
        }
      }

      // Création des associations avec indication de l'interlocuteur principal (le premier de la liste)
      const interlocutorsToAdd = interlocutorIds.map((interlocutorId, index) => ({
        quote_id: quoteId,
        interlocutor_id: interlocutorId,
        is_primary: index === 0
      }));

      await QuotesInterlocutors.bulkCreate(interlocutorsToAdd, { transaction });
      logger.info(`Interlocuteurs ${interlocutorIds.join(', ')} ajoutés au devis ${quoteId}`);
    } catch (error) {
      logger.error(`Erreur lors de l'ajout des interlocuteurs au devis : ${error.message}`);
      throw error;
    }
  }

  /**
   * Valide que l'interlocuteur est bien lié à l'entreprise du devis.
   * 
   * @param {number} quoteId - ID du devis.
   * @param {number} interlocutorId - ID de l'interlocuteur.
   * @returns {Promise<void>}
   */
  static async validateInterlocutorCompany(quoteId, interlocutorId) {
    const quote = await Quotes.findByPk(quoteId);
    if (!quote) {
      throw new ErrorService('Devis non trouvé', 404);
    }

    const isLinked = await InterlocutorsCompanies.findOne({
      where: {
        company_id: quote.company_id,
        interlocutor_id: interlocutorId
      }
    });

    if (!isLinked) {
      throw new ErrorService("L'interlocuteur doit être lié à l'entreprise du devis", 400);
    }
  }

  /**
   * Crée une nouvelle association entre un devis et un interlocuteur.
   * 
   * @param {object} data - Objet contenant quote_id, interlocutor_id, is_primary.
   * @returns {Promise<object>} - L'association créée.
   */
  static async create(data) {
    const transaction = await sequelize.transaction();
    try {
      const { quote_id, interlocutor_id, is_primary } = data;

      // Validation de l'affiliation de l'interlocuteur avec l'entreprise du devis
      await this.validateInterlocutorCompany(quote_id, interlocutor_id);

      // Si l'interlocuteur est principal, on désactive les autres
      if (is_primary) {
        await QuotesInterlocutors.update(
          { is_primary: false },
          { where: { quote_id }, transaction }
        );
      }

      const association = await QuotesInterlocutors.create({
        quote_id,
        interlocutor_id,
        is_primary
      }, { transaction });

      await transaction.commit();
      logger.info(`Association créée entre le devis ${quote_id} et l'interlocuteur ${interlocutor_id}`);
      return association;
    } catch (error) {
      await transaction.rollback();
      logger.error(`Erreur lors de la création de l'association Quotes_Interlocutors : ${error.message}`);
      throw error;
    }
  }

  /**
   * Met à jour une association existante entre un devis et un interlocuteur.
   * 
   * @param {number} quoteId - ID du devis.
   * @param {number} interlocutorId - ID de l'interlocuteur.
   * @param {object} data - Objet contenant les champs à mettre à jour.
   * @returns {Promise<void>}
   */
  static async update(quoteId, interlocutorId, data) {
    const transaction = await sequelize.transaction();
    try {
      // Validation de l'affiliation de l'interlocuteur avec l'entreprise du devis
      await this.validateInterlocutorCompany(quoteId, interlocutorId);

      // Si is_primary est mis à true, désactiver les autres interlocuteurs principaux
      if (data.is_primary) {
        await QuotesInterlocutors.update(
          { is_primary: false },
          { where: { quote_id: quoteId }, transaction }
        );
      }

      const [updatedRows] = await QuotesInterlocutors.update(data, {
        where: { quote_id: quoteId, interlocutor_id: interlocutorId },
        transaction
      });

      if (updatedRows === 0) {
        throw new ErrorService('Association non trouvée', 404);
      }

      await transaction.commit();
      logger.info(`Association mise à jour entre le devis ${quoteId} et l'interlocuteur ${interlocutorId}`);
    } catch (error) {
      await transaction.rollback();
      logger.error(`Erreur lors de la mise à jour de l'association Quotes_Interlocutors : ${error.message}`);
      throw error;
    }
  }

  /**
   * Supprime une association entre un devis et un interlocuteur.
   * 
   * @param {number} quoteId - ID du devis.
   * @param {number} interlocutorId - ID de l'interlocuteur.
   * @returns {Promise<void>}
   */
  static async delete(quoteId, interlocutorId) {
    const transaction = await sequelize.transaction();
    try {
      const deletedRows = await QuotesInterlocutors.destroy({
        where: { quote_id: quoteId, interlocutor_id: interlocutorId },
        transaction
      });

      if (deletedRows === 0) {
        throw new ErrorService('Association non trouvée', 404);
      }

      await transaction.commit();
      logger.info(`Association supprimée entre le devis ${quoteId} et l'interlocuteur ${interlocutorId}`);
    } catch (error) {
      await transaction.rollback();
      logger.error(`Erreur lors de la suppression de l'association Quotes_Interlocutors : ${error.message}`);
      throw error;
    }
  }

  /**
   * Récupère toutes les associations pour un devis donné.
   * 
   * @param {number} quoteId - ID du devis.
   * @returns {Promise<Array<object>>} - Liste des associations.
   */
  static async getByQuote(quoteId) {
    const associations = await QuotesInterlocutors.findAll({
      where: { quote_id: quoteId },
      include: [
        { model: Interlocutors, as: 'interlocutor' }
      ]
    });
    return associations;
  }
}

module.exports = QuotesInterlocutorsService;
