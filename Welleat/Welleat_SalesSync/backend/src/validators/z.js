const { z, ZodErrorCode } = require('zod');

/**
 * Personnalisation des messages d'erreur Zod.
 */
z.setErrorMap((issue, ctx) => {
  switch (issue.code) {
    case ZodErrorCode.invalid_type:
      return { message: `Type de données invalide, attendu : ${ctx.expected}, reçu : ${issue.received}` };
    case ZodErrorCode.invalid_enum_value:
      return { message: 'Valeur non autorisée.' };
    case ZodErrorCode.too_small:
      return { message: ctx.minimum !== undefined 
        ? `La valeur doit être au moins ${ctx.minimum}.`
        : "La valeur est trop petite." };
    case ZodErrorCode.too_big:
      return { message: ctx.maximum !== undefined 
        ? `La valeur ne doit pas dépasser ${ctx.maximum}.`
        : "La valeur est trop grande." };
    default:
      return { message: ctx.defaultError || "Erreur de validation" };
  }
});

module.exports = z;
