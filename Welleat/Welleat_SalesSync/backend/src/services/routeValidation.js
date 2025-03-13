// Dossier : src/services/utils
// Fichier : routeValidation.js
// Service de validation des paramètres de route.

const { z } = require('zod');

/**
 * Schéma de validation des paramètres de route.
 */
const routeParamsSchema = z.object({
  formula_id: z.preprocess(
    (val) => Number(val),
    z.number().int().positive({ message: "L'ID de la formule doit être un entier positif." })
  ),
  option_id: z.preprocess(
    (val) => Number(val),
    z.number().int().positive({ message: "L'ID de l'option doit être un entier positif." })
  ),
  quote_id: z.preprocess(
    (val) => Number(val),
    z.number().int().positive({ message: "L'ID du devis doit être un entier positif." })
  ),
  equipment_id: z.preprocess(
    (val) => Number(val),
    z.number().int().positive({ message: "L'ID de l'équipement doit être un entier positif." })
  )
});

/**
 * Valide les paramètres de la route partiellement et les retourne.
 *
 * @param {object} params - Paramètres à valider.
 * @returns {object} Paramètres validés.
 */
function validateRouteParams(params) {
  return routeParamsSchema.partial().parse(params);
}

/**
 * Formate les erreurs de validation Zod.
 *
 * @param {Error} error - Erreur Zod.
 * @returns {object} Objet contenant le message d'erreur et les détails.
 */
function formatZodError(error) {
  return {
    success: false,
    error: "Erreur de validation",
    details: error.errors.map(e => ({
      path: e.path.join('.'),
      message: e.message
    }))
  };
}

module.exports = {
  validateRouteParams,
  routeParamsSchema,
  formatZodError,
};
