// Dossier: backend/src/services/emails
// Fichier: notification.service.js
// Service de notification par email

const nodemailer = require('nodemailer');
const logger = require('./../../middlewares/requestLogger');

class NotificationService {
  /**
   * Initialise le service de notification avec un transporteur SMTP
   */
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  /**
   * Récupère le template d'email en fonction du type
   * @param {string} type - Type de notification
   * @param {Object} user - Utilisateur destinataire
   * @param {Object} data - Données supplémentaires pour le template
   * @returns {Object} Template d'email
   */
  getTemplate(type, user, data = {}) {
    const templates = {
      ACCOUNT_CREATION: {
        subject: 'Bienvenue sur Welleat Sales Sync.',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
              <div style="background-color: #13674e; padding: 20px; text-align: center;">
                <img src="https://welleat.fr/wp-content/uploads/2024/11/Logo-300x300.png" alt="Logo Welleat" style="max-width: 75px; height: auto;">
              </div>
              <div style="padding: 20px; text-align: center;">
                <h1 style="color: #333333;">Bienvenue ${user.firstName}</h1>
                <p style="color: #333333;">Votre compte a été créé. Veuillez cliquer sur le lien suivant pour définir votre mot de passe :</p>
                <a href="${process.env.CLIENT_URL}/reset-password?token=${data.resetToken}" style="display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #13674e; text-decoration: none; border-radius: 5px;">Définir mon mot de passe</a>
              </div>
              <div style="background-color: #13674e; padding: 10px; text-align: center;">
                <p style="color: #ffffff; font-size: 12px; margin: 0;">
                  &copy; ${new Date().getFullYear()} Welleat. Tous droits réservés.
                </p>
              </div>
            </div>
          </div>
        `,
      },
      COMPANY_ASSIGNMENT: {
        subject: 'Nouvelle entreprise assignée',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
              <div style="background-color: #13674e; padding: 20px; text-align: center;">
                <img src="https://welleat.fr/wp-content/uploads/2024/11/Logo-300x300.png" alt="Logo Welleat" style="max-width: 75px; height: auto;">
              </div>
              <div style="padding: 20px;">
                <h1 style="color: #333333;">Nouvelle assignation</h1>
                <p style="color: #333333;">L'entreprise ${data.companyName} vous a été assignée.</p>
              </div>
              <div style="background-color: #13674e; padding: 10px; text-align: center;">
                <p style="color: #ffffff; font-size: 12px; margin: 0;">
                  &copy; ${new Date().getFullYear()} Welleat. Tous droits réservés.
                </p>
              </div>
            </div>
          </div>
        `,
      },
      SIMULATION_STATUS: {
        subject: `Simulation ${data.status}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
              <div style="background-color: #13674e; padding: 20px; text-align: center;">
                <img src="https://welleat.fr/wp-content/uploads/2024/11/Logo-300x300.png" alt="Logo Welleat" style="max-width: 75px; height: auto;">
              </div>
              <div style="padding: 20px;">
                <h1 style="color: #333333;">Mise à jour de simulation</h1>
                <p style="color: #333333;">Votre simulation a été ${data.status}.</p>
              </div>
              <div style="background-color: #13674e; padding: 10px; text-align: center;">
                <p style="color: #ffffff; font-size: 12px; margin: 0;">
                  &copy; ${new Date().getFullYear()} Welleat. Tous droits réservés.
                </p>
              </div>
            </div>
          </div>
        `,
      },
    };

    return templates[type];
  }

  /**
   * Envoie une notification par email
   * @param {string} to - Adresse email du destinataire
   * @param {string} type - Type de notification
   * @param {Object} user - Utilisateur destinataire
   * @param {Object} data - Données supplémentaires pour le template
   */
  async sendNotification(to, type, user, data = {}) {
    try {
      const template = this.getTemplate(type, user, data);
      if (!template) {
        throw new Error(`Template pour le type ${type} non trouvé.`);
      }

      await this.transporter.sendMail({
        to,
        subject: template.subject,
        html: template.html,
      });
      logger.info(`📧 Notification ${type} envoyée à ${to}`);
    } catch (error) {
      logger.error(`❌ Erreur d'envoi de notification: ${error.message}`, { stack: error.stack });
      throw error;
    }
  }

  /**
   * Envoie une notification de création de compte
   * @param {Object} user - Utilisateur destinataire
   * @param {string} type - Type de notification
   * @param {string} resetToken - Token de réinitialisation de mot de passe
   */
  async sendAccountNotification(user, type, resetToken) {
    await this.sendNotification(user.email, type, user, { resetToken });
  }
}

module.exports = new NotificationService();
