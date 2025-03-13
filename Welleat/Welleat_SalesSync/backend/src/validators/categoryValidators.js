// Dossier: validators
// fichier: categoryValidators.js
// Validation les données de catégorie.

const { z } = require('zod');

/**
 * Schéma Zod pour une catégorie générique.
 * Ce schéma vérifie uniquement que le nom n'est pas vide.
 * On ne force pas la limite de 50 caractères ici pour éviter une erreur 400 côté utilisateur.
 */
const categorySchema = z.object({
  name: z.string()
    .min(1, { message: "Le nom de la catégorie est requis." }),
  description: z.string().optional(),
  is_default: z.boolean().optional()
});

module.exports = {
  categorySchema
};
