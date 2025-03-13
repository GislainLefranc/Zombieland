// Dossier : src/controllers
// Fichier : equipmentController.js

const equipmentService = require('../services/equipmentService');
const logger = require('../utils/logger');

/**
 * Crée un nouvel équipement.
 */
const createEquipment = async (req, res, next) => {
  try {
    const equipment = await equipmentService.createEquipment(req.body);
    res.status(201).json({
      success: true,
      data: equipment,
      message: "Équipement créé avec succès"
    });
  } catch (error) {
    logger.error("Erreur dans createEquipment :", error);
    next(error);
  }
};

/**
 * Récupère tous les équipements, avec possibilité de filtrer par catégorie.
 */
const getAllEquipments = async (req, res, next) => {
  try {
    const { category_id } = req.query;
    const equipments = await equipmentService.getAllEquipments(category_id);
    res.status(200).json({ success: true, data: equipments });
  } catch (error) {
    logger.error("Erreur dans getAllEquipments :", error);
    next(error);
  }
};

/**
 * Récupère un équipement par son ID.
 */
const getEquipmentById = async (req, res, next) => {
  try {
    const equipment = await equipmentService.getEquipmentById(req.params.id);
    if (!equipment)
      return res.status(404).json({ success: false, error: 'Équipement non trouvé' });
    res.json({ success: true, data: equipment });
  } catch (error) {
    logger.error("Erreur dans getEquipmentById :", error);
    next(error);
  }
};

/**
 * Met à jour un équipement.
 */
const updateEquipment = async (req, res, next) => {
  try {
    const equipment = await equipmentService.updateEquipment(req.params.id, req.body);
    res.json({
      success: true,
      data: equipment,
      message: "Équipement mis à jour avec succès"
    });
  } catch (error) {
    logger.error("Erreur dans updateEquipment :", error);
    next(error);
  }
};

/**
 * Supprime un équipement.
 */
const deleteEquipment = async (req, res, next) => {
  try {
    await equipmentService.deleteEquipment(req.params.id);
    res.status(204).send();
  } catch (error) {
    logger.error("Erreur dans deleteEquipment :", error);
    next(error);
  }
};

/**
 * Récupère les catégories d'équipements.
 */
const getCategories = async (req, res, next) => {
  try {
    const categoriesResult = await equipmentService.getEquipmentCategories();
    res.json(categoriesResult);
  } catch (error) {
    logger.error("Erreur dans getCategories :", error);
    next(error);
  }
};

module.exports = {
  createEquipment,
  getAllEquipments,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
  getCategories,
};
