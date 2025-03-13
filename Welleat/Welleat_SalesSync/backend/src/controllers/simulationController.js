// Dossier: controllers
// Fichier: simulationController.js
// Contrôleur pour les fonctions de gestion des simulations.

const { Simulation, Company } = require('../models/indexModels');
const { z } = require('zod');
const { simulationSchema } = require('../validators/simulationValidator');
const { sequelize } = require('../config/sequelize');
const logger = require('../utils/logger');

/**
 * Créer une simulation.
 */
const createSimulation = async (req, res) => {
  try {
    const validatedData = await simulationSchema.parseAsync(req.body);
    logger.info(`Données simulation validées : ${JSON.stringify(validatedData)}`);
    const simulation = await Simulation.create(validatedData);
    return res.status(201).json(simulation);
  } catch (error) {
    logger.error(`Erreur création simulation : ${error}`);
    return res.status(500).json({ 
      message: "Erreur lors de la création de la simulation",
      error: error.toString()
    });
  }
};

/**
 * Récupérer toutes les simulations.
 */
const getAllSimulations = async (req, res) => {
  try {
    const { companyId } = req.query;
    const simulations = await Simulation.findAll({
      where: companyId ? { companyId } : {},
      include: [{ model: Company, as: 'company', attributes: ['id', 'name'] }],
    });
    res.json(simulations);
  } catch (error) {
    logger.error(`Erreur récupération simulations : ${error.message}`);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des simulations' });
  }
};

/**
 * Récupérer une simulation par son ID.
 */
const getSimulationById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(parseInt(id)))
      return res.status(400).json({ message: 'ID de simulation invalide' });
    const simulation = await Simulation.findByPk(id, {
      include: [{ model: Company, as: 'company', attributes: ['id', 'name'] }],
    });
    if (!simulation)
      return res.status(404).json({ message: 'Simulation non trouvée' });
    res.json(simulation);
  } catch (error) {
    logger.error(`Erreur récupération simulation : ${error.message}`);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération de la simulation' });
  }
};

/**
 * Mettre à jour une simulation.
 */
const updateSimulation = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = simulationSchema.partial().parse(req.body);
    const simulation = await Simulation.findByPk(id);
    if (!simulation)
      return res.status(404).json({ message: 'Simulation non trouvée' });
    await simulation.update(validatedData);
    res.json(simulation);
  } catch (error) {
    if (error instanceof z.ZodError)
      return res.status(400).json({ errors: error.errors });
    logger.error(`Erreur mise à jour simulation : ${error.message}`);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de la simulation' });
  }
};

/**
 * Supprimer une simulation.
 */
const deleteSimulation = async (req, res) => {
  try {
    const { id } = req.params;
    const simulation = await Simulation.findByPk(id);
    if (!simulation)
      return res.status(404).json({ message: 'Simulation non trouvée' });
    await simulation.destroy();
    res.json({ message: 'Simulation supprimée avec succès' });
  } catch (error) {
    logger.error(`Erreur suppression simulation : ${error.message}`);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression de la simulation' });
  }
};

/**
 * Assigner une simulation à une entreprise.
 */
const assignSimulation = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { simulationId } = req.params;
    const { companyId } = req.body;
    if (!simulationId || !companyId) {
      await t.rollback();
      return res.status(400).json({ message: "ID de simulation ou ID d'entreprise manquant" });
    }
    const simulation = await Simulation.findByPk(simulationId, { transaction: t });
    if (!simulation) {
      await t.rollback();
      return res.status(404).json({ message: 'Simulation non trouvée' });
    }
    const company = await Company.findByPk(companyId, { transaction: t });
    if (!company) {
      await t.rollback();
      return res.status(404).json({ message: 'Entreprise non trouvée' });
    }
    await simulation.update({ companyId, status: 'assigned' }, { transaction: t });
    await t.commit();
    return res.status(200).json(simulation);
  } catch (error) {
    await t.rollback();
    logger.error(`Erreur assignation simulation : ${error.message}`);
    return res.status(500).json({ message: "Erreur lors de l'assignation", error: error.message });
  }
};

module.exports = {
  createSimulation,
  getAllSimulations,
  getSimulationById,
  updateSimulation,
  deleteSimulation,
  assignSimulation,
};
