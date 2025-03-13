// Dossier: validators
// Fichier: equipmentBaseValidator.js
// Validation des données d'équipement.

const { z } = require('zod');

/**
 * Schéma de base pour un équipement.
 */
const equipmentBaseSchema = z.object({
  // Le nom est requis et ne doit pas dépasser 255 caractères.
  name: z.string()
    .min(1, { message: "Le nom de l'équipement est requis." })
    .max(255, { message: "Le nom de l'équipement ne doit pas dépasser 255 caractères." }),
  
  description: z.string().nullable().optional(),
  
  // L'indicateur free_equipment doit être un booléen.
  free_equipment: z.preprocess(
    (val) => val === 'true' || val === true,
    z.boolean({ required_error: "L'indicateur d'équipement gratuit est requis." })
  ).optional(),
  
  // Le prix HT doit être un nombre non négatif.
  price_ht: z.preprocess(
    (val) => parseFloat(String(val)),
    z.number().nonnegative({ message: "Le prix HT doit être un nombre non négatif." })
  ).optional(),
  
  // Le type de remise peut être 'percentage' ou 'fixed_amount'.
  discount_type: z.enum(['percentage', 'fixed_amount']).optional(),
  
  // La valeur de la remise doit être non négative.
  discount_value: z.number().nonnegative().optional(),
  
  discount_reason: z.string().nullable().optional(),
  
  // Clé étrangère vers equipment_category_id (optionnel).
  equipment_category_id: z.number().int().positive().or(z.null()).optional(),
   
  formula_compatible: z.boolean().default(true),
  formula_discount: z.number().nonnegative({ message: "La remise sur formule doit être ≥ 0." }).default(0),
  
  notes: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  is_default: z.boolean().optional()
});

/**
 * Schéma pour l'association équipement-devise.
 */
const quoteEquipmentSchema = z.object({
  equipment_id: z.number().int().positive(),
  quantity: z.number().int().min(1),
  unit_price_ht: z.number().nonnegative(),
  is_first_unit_free: z.boolean().default(false)
});

/**
 * Schéma partiel pour la mise à jour d'un équipement.
 */
const equipmentUpdateSchema = equipmentBaseSchema.partial();

/**
 * Schéma partiel pour la mise à jour d'un équipement dans un devis.
 */
const quoteEquipmentUpdateSchema = z.object({
  quantity: z.number().int().positive("La quantité doit être un entier positif").optional(),
  unit_price_ht: z.number().min(0, "Le prix unitaire HT doit être positif").optional(),
  is_first_unit_free: z.boolean().optional()
});

module.exports = {
  equipmentBaseSchema,
  quoteEquipmentSchema,
  equipmentUpdateSchema,
  quoteEquipmentUpdateSchema
};
