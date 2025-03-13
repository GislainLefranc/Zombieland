// Folder: src/services
// File: quoteService.js
// Service pour les devis
const {
  Quote,
  Equipment,
  QuoteEquipment,
  Interlocutor,
  Company,
  User,
  Formula,
  Option,
  QuoteOptions,
  sequelize
} = require('../models/indexModels');
const { quoteSchema, quoteUpdateSchema } = require('../validators/quoteValidator');
const logger = require('../utils/logger');
const { recalculateTotals } = require('./utils/Calculator');
const QuotesInterlocutorsService = require('./quotesInterlocutorsService');

/**
 * Crée un nouveau devis.
 * 
 * @param {object} data - Données du devis.
 * @returns {Promise<object>} - Le devis créé avec ses associations.
 */
async function createQuote(data) {
  const transaction = await sequelize.transaction();
  try {
    // 1. Validation et création du devis
    const validatedData = quoteSchema.parse(data);
    const quote = await Quote.create(validatedData, { transaction });
    
    // 2. Ajout des équipements si fournis
    if (Array.isArray(data.equipments)) {
      for (const equipment of data.equipments) {
        await QuoteEquipment.create({
          quote_id: quote.id,
          equipment_id: parseInt(equipment.equipment_id, 10),
          quantity: parseInt(equipment.quantity, 10),
          unit_price_ht: parseFloat(equipment.unit_price_ht),
          is_first_unit_free: Boolean(equipment.is_first_unit_free)
        }, { transaction });
      }
    }
    
    // 3. Ajout des interlocuteurs
    if (Array.isArray(data.interlocutor_ids) && data.interlocutor_ids.length > 0) {
      await QuotesInterlocutorsService.addInterlocutorsToQuote(quote.id, data.interlocutor_ids, transaction);
    }

    // 4. Ajout des options de la formule si applicable
    if (validatedData.formula_id) {
      const formula = await Formula.findByPk(validatedData.formula_id, {
        include: [{
          model: Option,
          as: 'options',
          through: { attributes: [] }
        }],
        transaction
      });

      if (formula?.options?.length > 0) {
        console.log('Options trouvées dans la formule :', formula.options.length);
        
        for (const option of formula.options) {
          await QuoteOptions.create({
            quote_id: quote.id,
            option_id: option.id,
            created_at: new Date(),
            updated_at: new Date()
          }, { transaction });
        }
        
        console.log(`${formula.options.length} options ajoutées au devis ${quote.id}`);
      }
    }

    // 5. Rechargement du devis avec toutes ses associations
    const quoteWithAssociations = await Quote.findByPk(quote.id, {
      include: [
        { 
          model: Equipment, 
          as: 'equipments', 
          through: QuoteEquipment 
        },
        { 
          model: Formula, 
          as: 'formula', 
          include: [{ model: Option, as: 'options' }] 
        },
        { 
          model: Interlocutor, 
          as: 'interlocutors', 
          through: 'Quotes_Interlocutors' 
        }
      ],
      transaction
    });

    // 6. Recalcul des totaux du devis
    await recalculateTotals(quoteWithAssociations, transaction);

    // 7. Validation de la transaction
    await transaction.commit();

    // 8. Retour du devis final avec toutes ses associations
    return await Quote.findByPk(quote.id, {
      include: [
        { model: Formula, as: 'formula', include: [{ model: Option, as: 'options' }] },
        { model: Equipment, as: 'equipments', through: { attributes: ['quantity', 'unit_price_ht', 'is_first_unit_free'] } },
        { model: Interlocutor, as: 'interlocutors', through: 'Quotes_Interlocutors' },
        { model: Company, as: 'company' },
        { model: User, as: 'user' }
      ]
    });
  } catch (error) {
    if (transaction.finished !== 'commit') {
      await transaction.rollback();
    }
    console.error('Erreur dans createQuote :', error);
    throw error;
  }
}

/**
 * Récupère tous les devis en fonction du rôle de l'utilisateur.
 * 
 * @param {Object} user - Utilisateur effectuant la requête.
 * @returns {Promise<Array<object>>} - Liste des devis.
 */
async function getAllQuotes(user) {
  try {
    const whereCondition = {};
    if (user.roleId !== 1) {
      whereCondition.user_id = user.id;
    }

    const quotes = await Quote.findAll({
      where: whereCondition,
      include: [
        {
          model: Interlocutor,
          as: 'interlocutors',
          through: 'Quotes_Interlocutors'
        },
        {
          model: Company,
          as: 'company'
        },
        {
          model: User,
          as: 'user'
        },
        {
          model: Formula,
          as: 'formula',
          include: [{ model: Option, as: 'options' }]
        },
        {
          model: Equipment,
          as: 'equipments',
          through: { attributes: ['quantity', 'unit_price_ht', 'is_first_unit_free'] }
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log(`getAllQuotes - Nombre de devis récupérés : ${quotes.length}`);
    logger.info(`Récupération de ${quotes.length} devis`);
    return quotes;
  } catch (error) {
    console.error(`Erreur récupération devis : ${error.message}`);
    logger.error(`Erreur récupération devis : ${error.message}`);
    throw error;
  }
}

/**
 * Récupère un devis par son ID.
 * 
 * @param {number} quoteId - ID du devis.
 * @returns {Promise<object>} - Le devis récupéré.
 */
async function getQuoteById(quoteId) {
  console.log("getQuoteById dans quoteService a été appelée !");
  try {
    const quote = await Quote.findByPk(quoteId, {  
      include: [
        {
          model: Formula,
          as: 'formula',
          include: [{ model: Option, as: 'options' }]
        },
        {
          model: Equipment,
          as: 'equipments',
          through: { 
            model: QuoteEquipment,
            attributes: ['quantity', 'unit_price_ht', 'is_first_unit_free']
          }
        },
        {
          model: Interlocutor,
          as: 'interlocutors',
          through: 'Quotes_Interlocutors'
        },
        {
          model: Company,
          as: 'company'
        },
        {
          model: User,
          as: 'user'
        }
      ]
    });
    return quote;
  } catch (error) {
    logger.error(`Erreur récupération devis ID ${quoteId} : ${error.message}`);
    throw error;
  }
}

/**
 * Met à jour un devis existant.
 * 
 * @param {number} quoteId - ID du devis.
 * @param {object} updateData - Données de mise à jour.
 * @returns {Promise<object>} - Le devis mis à jour.
 */
async function updateQuote(quoteId, updateData) {
  const t = await sequelize.transaction();
  try {
    console.log(`updateQuote - Données reçues pour mise à jour du devis ID ${quoteId} :`, updateData);
    
    const validatedData = quoteUpdateSchema.parse(updateData);

    const quote = await Quote.findByPk(quoteId, { transaction: t });
    if (!quote) {
      throw new Error('Devis non trouvé');
    }
    await quote.update(validatedData, { transaction: t });

    if (validatedData.formula_id) {
      const formula = await Formula.findByPk(validatedData.formula_id, {
        include: [{ model: Option, as: 'options' }],
        transaction: t
      });
      if (!formula) {
        throw new Error(`Formule ${validatedData.formula_id} non trouvée`);
      }
    }

    // Mise à jour des interlocuteurs si fournis
    if (Array.isArray(validatedData.interlocutor_ids)) {
      await QuotesInterlocutorsService.addInterlocutorsToQuote(
        quote.id,
        validatedData.interlocutor_ids,
        t
      );
    }

    await recalculateTotals(quote, t);
    await t.commit();
    console.log(`updateQuote - Réponse pour le devis ID ${quoteId} :`, quote);
    logger.info(`Devis ID ${quoteId} mis à jour`);
    return quote;
  } catch (error) {
    await t.rollback();
    console.error(`Transaction rollbackée en raison de l'erreur : ${error.message}`);
    logger.error(`Erreur mise à jour devis ID ${quoteId} : ${error.message}`);
    throw error;
  }
}

/**
 * Supprime un devis par son ID.
 * 
 * @param {number} quoteId - ID du devis.
 * @returns {Promise<void>}
 */
async function deleteQuote(quoteId) {
  const t = await sequelize.transaction();
  try {
    console.log(`deleteQuote - Demande de suppression du devis ID ${quoteId}`);
    
    const quote = await Quote.findByPk(quoteId, { transaction: t });
    if (!quote) {
      throw new Error('Devis non trouvé');
    }
    await quote.destroy({ transaction: t });
    await t.commit();
    console.log(`deleteQuote - Devis ID ${quoteId} supprimé`);
    logger.info(`Devis ID ${quoteId} supprimé`);
  } catch (error) {
    await t.rollback();
    console.error(`Transaction rollbackée en raison de l'erreur : ${error.message}`);
    logger.error(`Erreur suppression devis ID ${quoteId} : ${error.message}`);
    throw error;
  }
}

/**
 * Soumet un devis en changeant son statut en 'submitted'.
 * 
 * @param {number} quoteId - ID du devis.
 * @returns {Promise<object>} - Le devis soumis.
 */
async function submitQuote(quoteId) {
  const t = await sequelize.transaction();
  try {
    console.log(`submitQuote - Demande de soumission du devis ID ${quoteId}`);
    
    const quote = await Quote.findByPk(quoteId, { transaction: t });
    if (!quote) {
      throw new Error('Devis non trouvé');
    }
    quote.status = 'submitted';
    await quote.save({ transaction: t });
    await recalculateTotals(quote, t);
    await t.commit();
    console.log(`submitQuote - Devis ID ${quoteId} soumis`);
    logger.info(`Devis ID ${quoteId} soumis`);
    return quote;
  } catch (error) {
    await t.rollback();
    console.error(`Transaction rollbackée en raison de l'erreur : ${error.message}`);
    logger.error(`Erreur soumission devis ID ${quoteId} : ${error.message}`);
    throw error;
  }
}

/**
 * Approuve un devis en changeant son statut en 'approved'.
 * 
 * @param {number} quoteId - ID du devis.
 * @returns {Promise<object>} - Le devis approuvé.
 */
async function approveQuote(quoteId) {
  const t = await sequelize.transaction();
  try {
    console.log(`approveQuote - Demande d'approbation du devis ID ${quoteId}`);
    
    const quote = await Quote.findByPk(quoteId, { transaction: t });
    if (!quote) {
      throw new Error('Devis non trouvé');
    }
    quote.status = 'approved';
    await quote.save({ transaction: t });
    await recalculateTotals(quote, t);
    await t.commit();
    console.log(`approveQuote - Devis ID ${quoteId} approuvé`);
    logger.info(`Devis ID ${quoteId} approuvé`);
    return quote;
  } catch (error) {
    await t.rollback();
    console.error(`Transaction rollbackée en raison de l'erreur : ${error.message}`);
    logger.error(`Erreur approbation devis ID ${quoteId} : ${error.message}`);
    throw error;
  }
}

/**
 * Rejette un devis en changeant son statut en 'rejected' et en ajoutant une raison.
 * 
 * @param {number} quoteId - ID du devis.
 * @param {string} reason - Raison du rejet.
 * @returns {Promise<object>} - Le devis rejeté.
 */
async function rejectQuote(quoteId, reason) {
  const t = await sequelize.transaction();
  try {
    console.log(`rejectQuote - Demande de rejet du devis ID ${quoteId} pour la raison : ${reason}`);
    
    const quote = await Quote.findByPk(quoteId, { transaction: t });
    if (!quote) {
      throw new Error('Devis non trouvé');
    }
    quote.status = 'rejected';
    quote.rejection_reason = reason;
    await quote.save({ transaction: t });
    await recalculateTotals(quote, t);
    await t.commit();
    console.log(`rejectQuote - Devis ID ${quoteId} rejeté`);
    logger.info(`Devis ID ${quoteId} rejeté`);
    return quote;
  } catch (error) {
    await t.rollback();
    console.error(`Transaction rollbackée en raison de l'erreur : ${error.message}`);
    logger.error(`Erreur rejet devis ID ${quoteId} : ${error.message}`);
    throw error;
  }
}

/**
 * Ajoute une option à un devis.
 * 
 * @param {number} quoteId - ID du devis.
 * @param {number} optionId - ID de l'option.
 * @param {number} userId - ID de l'utilisateur effectuant l'action.
 * @returns {Promise<void>}
 */
async function addOptionToQuote(quoteId, optionId, userId) {
  const t = await sequelize.transaction();
  try {
    console.log(`addOptionToQuote - Demande d'ajout de l'option ID ${optionId} au devis ID ${quoteId}`);
    
    const quote = await Quote.findByPk(quoteId, { transaction: t });
    if (!quote) {
      throw new Error('Devis non trouvé');
    }

    const option = await Option.findByPk(optionId, { transaction: t });
    if (!option) {
      throw new Error('Option non trouvée');
    }

    await quote.addOption(option, { transaction: t });
    await recalculateTotals(quote, t);
    await t.commit();
    console.log(`addOptionToQuote - Option ID ${optionId} ajoutée au devis ID ${quoteId}`);
    logger.info(`Option ID ${optionId} ajoutée au devis ID ${quoteId} par utilisateur ID ${userId}`);
  } catch (error) {
    await t.rollback();
    console.error(`Transaction rollbackée en raison de l'erreur : ${error.message}`);
    logger.error(`Erreur ajout option ID ${optionId} au devis ID ${quoteId} : ${error.message}`);
    throw error;
  }
}

module.exports = {
  createQuote,
  getAllQuotes,
  getQuoteById,
  updateQuote,
  deleteQuote,
  submitQuote,
  approveQuote,
  rejectQuote,
  addOptionToQuote,
};
