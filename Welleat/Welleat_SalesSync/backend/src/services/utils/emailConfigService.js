// Dossier : src/services/utils
// Fichier : emailConfigService.js
// Service pour la configuration des emails

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const logger = require('../../utils/logger');

dotenv.config();

/**
 * Crée et retourne un transporteur SMTP.
 *
 * @returns {object} Transporteur Nodemailer.
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Utile en développement
    },
  });
};

/**
 * Envoie un email avec les options spécifiées.
 *
 * @param {object} mailOptions - Options de l'email (to, subject, text, etc.).
 * @returns {Promise<void>}
 */
const sendEmail = async (mailOptions) => {
  const transporter = createTransporter();
  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email envoyé avec succès aux destinataires : ${mailOptions.to}`);
    logger.debug("Réponse SMTP :", info);
  } catch (error) {
    logger.error(`Erreur lors de l'envoi de l'email : ${error.message}`, {
      destinataires: mailOptions.to,
      stack: error.stack,
    });
    throw error;
  }
};

module.exports = { sendEmail };
