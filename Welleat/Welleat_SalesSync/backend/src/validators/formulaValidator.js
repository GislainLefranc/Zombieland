// Dossier: src/validators
// Fichier: formulaValidator.js
// Validation des données de formule.

const { z } = require('zod');

/**
 * Schéma Zod pour la création d'une formule.
 */
const formulaSchema = z.object({
  name: z.string({
    required_error: "Le nom est requis",
    invalid_type_error: "Le nom doit être une chaîne de caractères"
  }),
  description: z.string().optional(),
  // Le champ price_ht sera recalculé, il n'est donc pas imposé ici
  price_ht: z.number().min(0).optional(),
  installation_price: z.number().default(0),
  maintenance_price: z.number().default(0),
  hotline_price: z.number().default(0),
  option_ids: z.array(z.number()).optional()
});

/**
 * Schéma Zod pour la mise à jour d'une formule.
 */
const formulaUpdateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  price_ht: z.number().min(0).optional(),
  installation_price: z.number().min(0).optional(),
  maintenance_price: z.number().min(0).optional(),
  hotline_price: z.number().min(0).optional(),
  option_ids: z.array(z.number().positive()).optional()
});

module.exports = {
  formulaSchema,
  formulaUpdateSchema
};
