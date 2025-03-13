// Dossier : src/validators
// Fichier : userValidator.js
// Schémas Zod pour les Utilisateurs

const { z } = require('zod');

const userSchema = z.object({
  firstName: z.string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères.')
    .max(50, 'Le prénom ne doit pas dépasser 50 caractères.'),
  lastName: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères.')
    .max(50, 'Le nom ne doit pas dépasser 50 caractères.'),
  email: z.string()
    .email("Le format de l'email est invalide.")
    .max(100, "L'email ne doit pas dépasser 100 caractères."),
  password: z.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères.'),
  phone: z.string().nullable().optional(),
  position: z.string().nullable().optional(),
  roleId: z.number()
    .int({ message: "Le rôle doit être un entier." })
    .positive('Le rôle est requis et doit être positif.')
});

const userUpdateSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  phone: z.string().nullable().optional(),
  position: z.string().nullable().optional()
});

module.exports = { userSchema, userUpdateSchema };
