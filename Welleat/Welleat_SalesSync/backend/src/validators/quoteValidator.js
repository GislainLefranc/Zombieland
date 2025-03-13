// Dossier : src/validators
// Fichier : quoteValidator.js
// Schémas Zod pour valider les devis

const { z } = require('zod');

/**
 * Schéma pour la création d'un devis.
 */
const quoteSchema = z.object({
  user_id: z.number(),
  company_id: z.number(),
  interlocutor_ids: z.array(z.number()),
  status: z.string(),
  valid_until: z.string().optional(),
  engagement_duration: z.number(),
  formula_id: z.number(),
  installation_included: z.boolean(),
  maintenance_included: z.boolean(),
  hotline_included: z.boolean(),
  notes: z.string().optional(),
  discount_type: z.string().optional(),
  discount_value: z.number().optional(),
  discount_reason: z.string().nullable().optional(),
  tax_rate: z.number(),
  installation_price: z.number().optional(),
  maintenance_price: z.number().optional(),
  hotline_price: z.number().optional(),
  total_ht: z.number().optional(),
  total_ttc: z.number().optional(),
  calculated_price: z.number().optional(),
});

/**
 * Schéma pour la mise à jour d'un devis.
 * Permet la mise à jour de certains champs, y compris la liste des interlocuteurs et équipements.
 */
const quoteUpdateSchema = z.object({
  status: z.string().optional(),
  valid_until: z.union([z.string(), z.date()]).optional(),
  engagement_duration: z.number().int().positive().optional(),
  formula_id: z.number().int().positive().optional(),
  notes: z.string().optional(),
  installation_included: z.boolean().optional(),
  maintenance_included: z.boolean().optional(),
  hotline_included: z.boolean().optional(),
  tax_rate: z.number().positive().optional(),
  discount_type: z.enum(['percentage', 'fixed_amount']).optional(),
  discount_value: z.number().positive().optional(),
  discount_reason: z.string().nullable().optional(),
  interlocutor_ids: z.array(z.number().int().positive()).optional(),
  equipments: z.array(
    z.object({
      equipment_id: z.number().int().positive(),
      quantity: z.number().int().positive(),
      unit_price_ht: z.number().nonnegative(),
      is_first_unit_free: z.boolean().optional()
    })
  ).optional(),
  option_ids: z.array(z.number().int().positive()).optional()
});

module.exports = {
  quoteSchema,
  quoteUpdateSchema
};
