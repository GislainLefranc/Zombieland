// Dossier : src/controllers
// Fichier : equipmentCategoryController.js

const equipmentCategoryService = require('../services/equipmentCategoryService');
const logger = require('../utils/logger');

/**
 * Crée une nouvelle catégorie d'équipement.
 */
const createCategory = async (req, res) => {
  try {
    const category = await equipmentCategoryService.createCategory(req.body);
    logger.info(`Catégorie d'équipement créée avec succès : ${category.name}`);
    res.status(201).json({
      success: true,
      message: "Catégorie d'équipement créée avec succès",
      data: category,
    });
  } catch (error) {
    logger.error('Erreur création catégorie équipement :', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        success: false,
        error: "Une catégorie avec ce nom existe déjà" 
      });
    }
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * Récupère toutes les catégories d'équipements.
 */
const getAllCategories = async (req, res) => {
  try {
    const categories = await equipmentCategoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    logger.error('Erreur récupération catégories équipement :', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Récupère une catégorie d'équipement par son ID.
 */
const getCategoryById = async (req, res) => {
  try {
    const category = await equipmentCategoryService.getCategoryById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Catégorie non trouvée' });
    res.json(category);
  } catch (error) {
    logger.error('Erreur récupération catégorie équipement :', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Met à jour une catégorie d'équipement.
 */
const updateCategory = async (req, res) => {
  try {
    const category = await equipmentCategoryService.updateCategory(req.params.id, req.body);
    res.json(category);
  } catch (error) {
    logger.error('Erreur mise à jour catégorie équipement :', error);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Supprime une catégorie d'équipement.
 */
const deleteCategory = async (req, res) => {
  try {
    const result = await equipmentCategoryService.deleteCategory(req.params.id);
    logger.info(`Catégorie d'équipement supprimée avec succès : ID ${req.params.id}`);
    res.status(200).json({
      success: true,
      message: "Catégorie d'équipement supprimée avec succès"
    });
  } catch (error) {
    logger.error('Erreur suppression catégorie équipement :', error);
    if (error.message === 'Catégorie non trouvée') {
      return res.status(404).json({
        success: false,
        error: "Catégorie non trouvée"
      });
    }
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
