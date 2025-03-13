// Dossier: src/validators
// Fichier: interlocutorCompanyValidator.js
// Validation de la relation entre Interlocutor et Company.

const { z } = require('zod');

/**
 * Schéma Zod pour valider la relation entre Interlocutor et Company.
 */
const interlocutorCompanySchema = z.object({
  interlocutor_id: z.number().int().positive(),
  company_id: z.number().int().positive(),
  is_principal: z.boolean().optional()
});

module.exports = {
  interlocutorCompanySchema
};
