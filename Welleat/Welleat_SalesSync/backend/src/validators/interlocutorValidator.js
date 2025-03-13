// Dossier : src/validators
// Fichier : interlocutorValidator.js
// Schémas Zod pour un Interlocuteur

const { z } = require('zod');

/**
 * Schéma pour un Interlocuteur.
 * Utilise le camelCase pour correspondre aux attributs du modèle Sequelize.
 */
const interlocutorSchema = z.object({
  lastName: z.string().min(1, "Le nom est requis."),               // Nom requis
  firstName: z.string().min(1, "Le prénom est requis."),             // Prénom requis
  email: z.string().email("Email invalide."),                        // Email invalide
  phone: z.string().optional(),                                      // Numéro de téléphone optionnel
  position: z.string().optional(),                                   // Poste optionnel
  interlocutorType: z.enum(['client potentiel', 'partenaire', 'fournisseur']).default('client potentiel'),
  comment: z.string().optional(),                                    // Commentaire optionnel
  isPrincipal: z.boolean().optional(),                               // Indicateur de principal optionnel
  isIndependent: z.boolean().optional(),                             // Indicateur d'indépendance optionnel
  userId: z.number().int().positive().optional(),                    // ID utilisateur optionnel
  primaryCompanyId: z.number().int().positive().optional()           // ID de l'entreprise principale optionnel
});

const interlocutorUpdateSchema = interlocutorSchema.partial();

module.exports = {
  interlocutorSchema,
  interlocutorUpdateSchema
};
