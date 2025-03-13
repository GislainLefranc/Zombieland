// Dossier: src/validators
// Fichier: companyValidator.js
// Validation des données d'entreprise.

const { z } = require('zod');

/**
 * Schémas Zod pour valider les données d'une entreprise.
 */
const companySchema = z.object({
  name: z.string()
    .min(1, { message: "Le nom de l'entreprise est requis." })
    .max(255, { message: "Le nom de l'entreprise ne doit pas dépasser 255 caractères." }),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  comments: z.string().optional(),
  establishmentType: z.string().optional(),
  organizationType: z.string().optional(),
  numberOfCanteens: z.number().int().min(0).optional(),
  numberOfCentralKitchens: z.number().int().min(0).optional(),
  interlocutors: z.array(
    z.object({
      firstName: z.string().min(1, { message: 'Le prénom est requis.' }),
      lastName: z.string().min(1, { message: 'Le nom est requis.' }),
      email: z.string().email({ message: 'Email invalide.' }),
      phone: z.string().optional(),
      position: z.string().optional(),
      comment: z.string().optional(),
      isPrincipal: z.boolean().optional(),
      isIndependent: z.boolean().optional()
    })
  ).optional()
});

const companyUpdateSchema = companySchema.partial();

module.exports = {
  companySchema,
  companyUpdateSchema
};
