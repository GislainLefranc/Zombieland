// Dossier : src/validators
// Fichier : simulationValidator.js
// Schémas Zod pour une Simulation

const { z } = require('zod');

const simulationSchema = z.object({
  userId: z.number().int().positive(),
  companyId: z.number().int().positive(),
  costPerDish: z.number().positive().default(2.8),
  dishesPerDay: z.number().int().positive().default(1000),
  wastePercentage: z.number().min(0).max(100).default(24),
  dailyProductionSavings: z.number().nonnegative(),
  monthlyProductionSavings: z.number().nonnegative(),
  dailyWasteSavings: z.number().nonnegative(),
  monthlyWasteSavings: z.number().nonnegative(),
  status: z.enum(['projet', 'en attente', 'approuvé', 'rejeté']).default('projet'),
  createdBy: z.number().int().positive()
});

const simulationUpdateSchema = simulationSchema.partial();

module.exports = {
  simulationSchema,
  simulationUpdateSchema
};
