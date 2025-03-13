// Dossier : src/controllers
// Fichier : categoryController.js

const categoryService = require('../services/categoryService');
const logger = require('../utils/logger');

/**
 * Création d'une nouvelle catégorie.
 * Exige la présence du paramètre 'categoryType' dans la query.
 */
const createCategory = async (req, res) => {
  try {
    const { categoryType } = req.query;
    if (!categoryType) {
      return res.status(400).json({ success: false, error: "Le paramètre 'categoryType' est requis" });
    }
    const category = await categoryService.createCategory(req.body, categoryType);
    logger.info(`Catégorie créée avec succès : ${category.name}`);
    res.status(201).json({
      success: true,
      message: "Catégorie créée avec succès",
      data: category,
    });
  } catch (error) {
    logger.error('Erreur création catégorie :', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * Récupération de toutes les catégories selon le type.
 */
const getAllCategories = async (req, res) => {
  try {
    const { categoryType } = req.query;
    if (!categoryType) {
      return res.status(400).json({ success: false, error: "Le paramètre 'categoryType' est requis" });
    }
    const categories = await categoryService.getAllCategories(categoryType);
    res.json({ success: true, data: categories });
  } catch (error) {
    logger.error('Erreur récupération catégories :', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Récupération d'une catégorie par son ID.
 */
const getCategoryById = async (req, res) => {
  try {
    const { categoryType } = req.query;
    if (!categoryType) {
      return res.status(400).json({ success: false, error: "Le paramètre 'categoryType' est requis" });
    }
    const category = await categoryService.getCategoryById(req.params.id, categoryType);
    if (!category) {
      return res.status(404).json({ success: false, error: 'Catégorie non trouvée' });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    logger.error('Erreur récupération catégorie :', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Mise à jour d'une catégorie existante.
 */
const updateCategory = async (req, res) => {
  try {
    const { categoryType } = req.query;
    if (!categoryType) {
      return res.status(400).json({ success: false, error: "Le paramètre 'categoryType' est requis" });
    }
    const category = await categoryService.updateCategory(req.params.id, req.body, categoryType);
    res.json({
      success: true,
      message: "Catégorie mise à jour avec succès",
      data: category,
    });
  } catch (error) {
    logger.error('Erreur mise à jour catégorie :', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * Suppression d'une catégorie.
 */
const deleteCategory = async (req, res) => {
  try {
    const { categoryType } = req.query;
    if (!categoryType) {
      return res.status(400).json({ success: false, error: "Le paramètre 'categoryType' est requis" });
    }
    await categoryService.deleteCategory(req.params.id, categoryType);
    res.status(204).send();
  } catch (error) {
    logger.error('Erreur suppression catégorie :', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
