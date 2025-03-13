// Dossier: src/validators
// Fichier: formulaOptionsValidator.js
// Validation des données associant une option à une formule.

const { z } = require('zod');

/**
 * Schéma Zod pour associer une option à une formule.
 */
const formulaOptionsSchema = z.object({
  formula_id: z.number()
    .int()
    .positive({ message: "ID de formule invalide (positif attendu)." }),
  option_id: z.number()
    .int()
    .positive({ message: "ID d'option invalide (positif attendu)." })
});

module.exports = {
  formulaOptionsSchema
};
