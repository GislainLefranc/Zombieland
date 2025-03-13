// Dossier: src/validators
// Fichier: assignValidator.js
// Validation des données d'assignation.

const { z } = require('zod');

/**
 * Schéma principal d'assignation.
 */
const assignSchema = z.object({
  itemType: z.string(), // Type d'assignation
  users: z.array(z.number().int().positive()).optional().default([]),
  companies: z.array(z.number().int().positive()).optional().default([]),
  interlocutors: z.array(z.number().int().positive()).optional().default([]),
}).refine(
  (data) => data.users.length + data.companies.length + data.interlocutors.length > 0,
  { message: 'Vous devez sélectionner au moins un élément à assigner.' }
);

/**
 * Schéma pour assigner un utilisateur à une entreprise et un interlocuteur.
 */
const assignUserToCompanySchema = z.object({
  userIds: z.array(z.number()),
  assignToCompanyId: z.number(),
  assignToInterlocutorId: z.number().nullable() 
});

/**
 * Schéma pour assigner plusieurs entreprises à plusieurs interlocuteurs.
 */
const assignCompaniesToInterlocutorsSchema = z.object({
  companyId: z.number().int().positive(),
  interlocutorIds: z.array(z.number().int().positive()).min(1),
});

/**
 * Schéma pour assigner plusieurs interlocuteurs à une entreprise.
 */
const assignInterlocutorsToCompaniesSchema = z.object({
  companyId: z.number().int().positive(),
  interlocutorIds: z.array(z.number().int().positive()).min(1),
});

/**
 * Schéma pour définir un interlocuteur principal.
 */
const setPrincipalInterlocutorSchema = z.object({
  isPrincipal: z.boolean({
    required_error: "Le statut principal est requis",
    invalid_type_error: "Le statut principal doit être un booléen"
  })
});

module.exports = {
  assignSchema,
  assignUserToCompanySchema,
  assignCompaniesToInterlocutorsSchema,
  assignInterlocutorsToCompaniesSchema,
  setPrincipalInterlocutorSchema,
};
