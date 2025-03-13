// Dossier : src/validators
// Fichier : quoteEquipmentValidator.js
// Schémas Zod pour valider les Équipements dans un Devis

const { z } = require('zod');

/**
 * Schéma pour une association équipement dans un devis.
 */
const quoteEquipmentSchema = z.object({
  equipment_id: z.number().int().positive(),
  quantity: z.number().int().positive(),
  unit_price_ht: z.number().nonnegative().refine((val) => !isNaN(val), { message: "Le prix unitaire HT doit être un nombre." }),
  is_first_unit_free: z.boolean().optional()
});

/**
 * Schéma pour la mise à jour d'une association équipement dans un devis.
 */
const quoteEquipmentUpdateSchema = z.object({
  quantity: z.number().int().positive().optional(),
  unit_price_ht: z.number().min(0).optional(),
  is_first_unit_free: z.boolean().optional()
});

module.exports = {
  quoteEquipmentSchema,
  quoteEquipmentUpdateSchema
};
