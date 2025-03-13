// Dossier: controllers
// Fichier: quotesInterlocutorsController.js
// Contrôleur pour les fonctions de gestion des interlocuteurs dans les devis.

const { Quote, InterlocutorCompany, QuotesInterlocutors } = require('../models/indexModels');
const { sequelize } = require('../config/sequelize');
const logger = require('../utils/logger');

class QuotesInterlocutorsService {
  /**
   * Ajouter plusieurs interlocuteurs à un devis.
   */
  static async addInterlocutorsToQuote(quoteId, interlocutorIds, transaction) {
    try {
      const quote = await Quote.findByPk(quoteId, { transaction });
      if (!quote) {
        throw new Error('Devis non trouvé');
      }
      for (const interlocutorId of interlocutorIds) {
        const isLinked = await InterlocutorCompany.findOne({
          where: {
            interlocutor_id: interlocutorId,
            company_id: quote.company_id
          },
          transaction
        });
        if (!isLinked) {
          throw new Error(`L'interlocuteur ${interlocutorId} n'est pas lié à l'entreprise du devis`);
        }
      }
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
}

module.exports = QuotesInterlocutorsService;
