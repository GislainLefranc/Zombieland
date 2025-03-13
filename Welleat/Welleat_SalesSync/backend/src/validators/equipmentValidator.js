// Dossier: src/validators
// Fichier: equipmentValidator.js
// Validation des données d'équipement.

const { z } = require('zod');

/**
 * Schéma Zod pour la création d'un équipement.
 */
const equipmentSchema = z.object({
  name: z.string()
    .min(1, "Le nom de l'équipement est requis.")
    .max(255, "Le nom de l'équipement ne doit pas dépasser 255 caractères."),
  
  description: z.string().nullable().optional(),
  
  free_equipment: z.preprocess(
    (val) => val === 'true' || val === true,
    z.boolean({ required_error: "Indiquez si l'équipement est gratuit (true/false)." })
  ).optional(),
  
  price_ht: z.preprocess(
    (val) => parseFloat(String(val)),
    z.number().nonnegative({ message: "Le prix HT doit être un nombre non négatif." })
  ).optional(),
  
  discount_type: z.enum(['percentage', 'fixed_amount']).optional(),
  discount_value: z.number().nonnegative().optional(),
  discount_reason: z.string().nullable().optional(),
  
  equipment_category_id: z.preprocess(val => {
    const num = Number(val);
    return num > 0 ? num : null;
  }, z.number().nullable()),
  
  formula_compatible: z.boolean().default(true),
  formula_discount: z.number().nonnegative().default(0),
  
  image: z.string().nullable().optional(),
  is_default: z.boolean().optional()
});

const equipmentUpdateSchema = equipmentSchema.partial();

module.exports = {
  equipmentSchema,
  equipmentUpdateSchema
};
