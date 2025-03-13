// Dossier : src/validators
// Fichier : roleValidator.js
// Schémas Zod pour un Rôle

const { z } = require('zod');

const roleSchema = z.object({
  name: z.string().min(1, "Le nom est requis.").max(255, "Le nom ne doit pas dépasser 255 caractères."),
  description: z.string().optional()
});

module.exports = {
  roleSchema
};
