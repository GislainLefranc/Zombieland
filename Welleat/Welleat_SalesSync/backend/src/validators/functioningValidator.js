// Dossier: validators
// Fichier: functioningValidator.js
// Validation des données de fonctionnement.

const { z } = require('zod');

/**
 * Schéma Zod pour le modèle "Functioning".
 */
const functioningSchema = z.object({
  company_id: z.number().int().positive(),
  type_of_functioning: z.string().min(1, "Le type de fonctionnement est requis.")
});

module.exports = {
  functioningSchema
};
