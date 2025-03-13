// Dossier: src/controllers
// Fichier: functioningController.js
// Contrôleurs pour la gestion des fonctionnements des entreprises

const { Functioning, Company } = require('../models/indexModels');
const { z } = require('zod');
const { functioningSchema } = require('../validators/functioningValidator');
const logger = require('../utils/logger');

const createFunctioning = async (req, res) => {
  try {
    // Valide les données de création du fonctionnement
    const data = functioningSchema.parse(req.body);
    // Vérifie l'existence de l'entreprise associée
    const company = await Company.findByPk(data.companyId);
    if (!company) return res.status(404).json({ error: 'Entreprise non trouvée' });
    const newFunctioning = await Functioning.create(data);
    res.status(201).json({ message: 'Fonctionnement créé avec succès', functioning: newFunctioning });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res.status(400).json({ errors: error.errors });
    logger.error(`Erreur création fonctionnement: ${error.message}`);
    res.status(500).json({ error: 'Erreur lors de la création du fonctionnement' });
  }
};

const getAllFunctionings = async (req, res) => {
  try {
    const functionings = await Functioning.findAll({
      include: [{ model: Company, as: 'company', attributes: ['id', 'name'] }],
    });
    res.status(200).json(functionings);
  } catch (error) {
    logger.error(`Erreur récupération fonctionnements: ${error.message}`);
    res.status(500).json({ error: 'Erreur lors de la récupération des fonctionnements' });
  }
};

const getFunctioningById = async (req, res) => {
  try {
    const { id } = req.params;
    const functioning = await Functioning.findByPk(id, {
      include: [{ model: Company, as: 'company', attributes: ['id', 'name'] }],
    });
    if (!functioning)
      return res.status(404).json({ error: 'Fonctionnement non trouvé' });
    res.status(200).json(functioning);
  } catch (error) {
    logger.error(`Erreur récupération fonctionnement: ${error.message}`);
    res.status(500).json({ error: 'Erreur lors de la récupération du fonctionnement' });
  }
};

const updateFunctioning = async (req, res) => {
  try {
    const { id } = req.params;
    // Utilise la validation partielle pour la mise à jour
    const data = functioningSchema.partial().parse(req.body);
    const functioning = await Functioning.findByPk(id);
    if (!functioning)
      return res.status(404).json({ error: 'Fonctionnement non trouvé' });
    if (data.companyId) {
      const company = await Company.findByPk(data.companyId);
      if (!company)
        return res.status(404).json({ error: 'Entreprise non trouvée' });
    }
    await functioning.update(data);
    res.status(200).json({ message: 'Fonctionnement mis à jour avec succès', functioning });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res.status(400).json({ errors: error.errors });
    logger.error(`Erreur mise à jour fonctionnement: ${error.message}`);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du fonctionnement' });
  }
};

const deleteFunctioning = async (req, res) => {
  try {
    const { id } = req.params;
    const functioning = await Functioning.findByPk(id);
    if (!functioning)
      return res.status(404).json({ error: 'Fonctionnement non trouvé' });
    await functioning.destroy();
    res.status(200).json({ message: 'Fonctionnement supprimé avec succès' });
  } catch (error) {
    logger.error(`Erreur suppression fonctionnement: ${error.message}`);
    res.status(500).json({ error: 'Erreur lors de la suppression du fonctionnement' });
  }
};

module.exports = {
  createFunctioning,
  getAllFunctionings,
  getFunctioningById,
  updateFunctioning,
  deleteFunctioning,
};
