// Dossier : src/validators
// Fichier : optionValidator.js
// Schémas Zod pour les Options

const { z } = require('zod');

/**
 * Schéma pour une Option.
 */
const optionSchema = z.object({
  name: z.string().min(1, "Le nom de l'option est requis."),
  description: z.string().optional(),
  price_ht: z.number().nonnegative({ message: "Le prix HT doit être ≥ 0." }),
  category_id: z.number()
    .int()
    .positive({ message: "L'ID de la catégorie doit être un entier positif." })
    .nullable()
    .optional(),
  notes: z.string().optional(),
  discount_type: z.string().optional(),
  discount_value: z.number().optional()
});

const optionUpdateSchema = optionSchema.partial();

module.exports = {
  optionSchema,
  optionUpdateSchema
};
