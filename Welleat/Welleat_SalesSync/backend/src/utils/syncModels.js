// Dossier: src/utils
// Fichier: syncModels.js
// Utilitaire pour synchroniser les modèles Sequelize.

const { sequelize } = require('../config/sequelize');
const models = {
  Role: require('../models/roleModel'),
  User: require('../models/userModel'),
  Company: require('../models/companyModel'),
  Interlocutor: require('../models/interlocutorModel'),
  Functioning: require('../models/functioningModel'),
  Simulation: require('../models/simulationModel'),
  Equipment: require('../models/equipmentModel'),
  Quote: require('../models/quoteModel'),
  QuoteEquipment: require('../models/quoteEquipmentModel'),
  Formula: require('../models/formulaModel'),
  Option: require('../models/optionModel'),
  Formula_Options: require('../models/formulaOptionModel'),
};

const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("🔄 Modèles synchronisés avec succès");
  } catch (error) {
    console.error("⚠️ Erreur lors de la synchronisation des modèles :", error);
    throw error;
  }
};

const verifyAssociations = () => {
  Object.entries(models).forEach(([name, model]) => {
    if (!model) {
      throw new Error(`❌ Modèle ${name} non défini`);
    }
  });
  console.log("✅ Associations vérifiées");
};

module.exports = {
  sequelize,
  ...models,
  syncModels,
  verifyAssociations
};