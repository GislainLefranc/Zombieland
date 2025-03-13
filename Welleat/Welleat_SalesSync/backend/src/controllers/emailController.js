// Dossier: src/controllers
// Fichier: emailController.js

const { sendEmail } = require('./../services/utils/emailConfigService');
const { z } = require('zod');
const logger = require('../utils/logger');

// Schéma de validation pour l'envoi d'email de simulation
const sendSimulationEmailSchema = z.object({
  toEmails: z.array(z.string().email()).nonempty('Au moins un email est requis'),
  simulationData: z.object({
    costPerDish: z.number().positive(),
    dishesPerDay: z.number().int().positive(),
    wastePercentage: z.number().positive(),
    dailyProductionSavings: z.number().positive(),
    monthlyProductionSavings: z.number().positive(),
    dailyWasteSavings: z.number().positive(),
    monthlyWasteSavings: z.number().positive(),
  }),
});

/**
 * Envoi d'un email de simulation.
 */
const sendSimulationEmail = async (req, res) => {
  try {
    const { toEmails, simulationData } = sendSimulationEmailSchema.parse(req.body);
    const user = req.user;

    // Préparation du contenu HTML de l'email
    const simulationDetails = `
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr>
          <th style="text-align: left; padding: 12px; background-color: #13674e; color: #ffffff;" colspan="2">Détails de la Simulation</th>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #ddd; color: #333333;">Coût par plat</td>
          <td style="padding: 12px; border-bottom: 1px solid #ddd; color: #333333;">${simulationData.costPerDish} €</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #ddd; color: #333333;">Plats par jour</td>
          <td style="padding: 12px; border-bottom: 1px solid #ddd; color: #333333;">${simulationData.dishesPerDay} plats /jrs</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #ddd; color: #333333;">Pourcentage de gaspillage</td>
          <td style="padding: 12px; border-bottom: 1px solid #ddd; color: #333333;">${simulationData.wastePercentage} %</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #ddd; color: #333333;">Économies sur la production</td>
          <td style="padding: 12px; border-bottom: 1px solid #ddd; color: #333333;">${simulationData.dailyProductionSavings} € /jour, soit ${simulationData.monthlyProductionSavings} € /mois</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #ddd; color: #333333;">Économies sur le gaspillage</td>
          <td style="padding: 12px; border-bottom: 1px solid #ddd; color: #333333;">${simulationData.dailyWasteSavings} € /jour, soit ${simulationData.monthlyWasteSavings} € /mois</td>
        </tr>
      </table>
    `;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: toEmails.join(','),
      subject: 'Simulation Welleat',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <div style="background-color: #13674e; padding: 20px; text-align: center;">
              <img src="https://welleat.fr/wp-content/uploads/2024/11/Logo-300x300.png" alt="Logo Welleat" style="max-width: 75px; height: auto;">
            </div>
            <div style="padding: 20px;">
              <p style="color: #333333; font-size: 16px;">Bonjour,</p>
              <p style="color: #333333; font-size: 16px;">Voici les détails de votre simulation Welleat demandée :</p>
              ${simulationDetails}
              <p style="color: #333333; font-size: 16px;">
                Cordialement,<br/>
                <strong>${user.firstName} ${user.lastName}</strong>
              </p>
              <p style="color: #333333; font-size: 14px;">
                Email : ${user.email}<br/>
                Téléphone : ${user.phone}<br/>
                Poste : ${user.position}
              </p>
            </div>
            <div style="background-color: #13674e; padding: 10px; text-align: center;">
              <p style="color: #ffffff; font-size: 12px; margin: 0;">
                &copy; ${new Date().getFullYear()} Welleat. Tous droits réservés.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    // Envoi de l'email avec la configuration préalablement définie
    await sendEmail(mailOptions);
    res.status(200).json({ message: 'Email envoyé avec succès.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    logger.error(`Erreur lors de l'envoi de l'email : ${error.message}`);
    res.status(500).json({ error: "Erreur lors de l'envoi de l'email." });
  }
};

module.exports = {
  sendSimulationEmail,
};
