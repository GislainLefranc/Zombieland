// Dossier : src/controllers
// Fichier : quoteEmailController.js
// Contrôleur pour l'envoi d'email de devis.

const { Quote, Company, Interlocutor, User, Formula, Equipment, Option } = require('../models/indexModels');
const quoteEmailService = require('../services/emails/quoteEmailService');
const logger = require('../utils/logger');
const { z } = require('zod');

// On valide que req.body contient une propriété "toEmails" qui est un tableau non vide d'emails
const emailSchema = z
  .object({ 
    toEmails: z.array(z.string().email("Format d'email invalide")).nonempty("Au moins un email est requis") 
  });

async function sendQuoteEmail(req, res) {
  try {
    const { id } = req.params;
    // Extraction de la propriété attendue
    const { toEmails } = req.body;

    logger.info(`Tentative d'envoi du devis #${id}`);
    logger.info(`Destinataires reçus : ${JSON.stringify(toEmails)}`);

    // Validation du payload
    try {
      emailSchema.parse({ toEmails });
    } catch (validationError) {
      logger.error("Validation des emails échouée :", validationError.errors);
      return res.status(400).json({
        error: "Emails invalides",
        details: validationError.errors,
      });
    }

    // Chargement du devis et de ses relations
    const quote = await Quote.findOne({
      where: { id },
      include: [
        { model: Company, as: 'company', required: true },
        { model: Interlocutor, as: 'interlocutors', through: { attributes: [] } },
        { 
          model: Formula, 
          as: 'formula', 
          include: [{ model: Option, as: 'options' }] 
        },
        { 
          model: Equipment, 
          as: 'equipments', 
          through: { attributes: ['quantity', 'unit_price_ht', 'is_first_unit_free'] }
        },
      ],
    });

    if (!quote || !quote.company) {
      logger.warn(`Devis #${id} ou entreprise introuvable`);
      return res.status(404).json({ error: "Devis ou entreprise introuvable" });
    }

    // Récupération du profil de l'utilisateur (expéditeur)
    const user = await User.findByPk(req.user.id);
    if (!user) {
      logger.warn(`Utilisateur ${req.user.id} introuvable`);
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }
    const profileData = {
      nom: user.lastName,
      prenom: user.firstName,
      email: user.email,
      phone: user.phone,
      position: user.position,
    };

    // Envoi de l'email via le service dédié (le service formate toEmails en une chaîne pour Nodemailer)
    try {
      await quoteEmailService.sendDetailedQuoteEmail(toEmails, quote, profileData);
      logger.info(`Email envoyé avec succès aux destinataires : ${toEmails.join(', ')}`);
      return res.status(200).json({
        success: true,
        message: `Email envoyé avec succès aux destinataires : ${toEmails.join(', ')}`,
      });
    } catch (emailError) {
      logger.error("Erreur lors de l'envoi de l'email :", emailError);
      throw emailError;
    }
  } catch (error) {
    logger.error("Erreur lors du traitement de la requête :", error);
    return res.status(500).json({
      error: "Erreur lors de l'envoi de l'email",
      details: error.message,
    });
  }
}

module.exports = {
  sendQuoteEmail,
};
