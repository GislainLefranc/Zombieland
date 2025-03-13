// Dossier: src/validators
// Fichier: emailNotificationValidator.js
// Validation des notifications par e-mail.

const { z } = require('zod');

/**
 * Schéma Zod pour les notifications par e-mail.
 */
const emailNotificationSchema = z.object({
  to: z.array(z.string().email({ message: "Adresse email invalide." })),
  subject: z.string().min(1, { message: "Le sujet est requis." }),
  body: z.string().min(1, { message: "Le contenu de l'email est requis." })
});

module.exports = {
  emailNotificationSchema
};
