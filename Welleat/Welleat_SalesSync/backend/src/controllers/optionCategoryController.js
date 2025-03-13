// Dossier: src/controllers
// Fichier: optionCategoryController.js
// Controleur des fonctions de gestion des catégories d'options.

const { OptionCategory } = require('../models/indexModels');
const logger = require('../utils/logger');

/**
 * Créer une catégorie d'option.
 */
const createCategory = async (req, res) => {
  try {
    const { name, description, is_default } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: "Le champ 'name' est requis" });
    }
    const category = await OptionCategory.create({
      name,
      description: description || '',
      is_default: !!is_default,
    });
    logger.info(`Catégorie d'option créée avec succès : ${category.name}`);
    res.status(201).json(category);
  } catch (error) {
    logger.error(`Erreur création catégorie d'option : ${error.message}`);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, error: 'Une catégorie avec ce nom existe déjà.' });
    }
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * Récupérer toutes les catégories d'options.
 */
const getAllCategories = async (req, res) => {
  try {
    const categories = await OptionCategory.findAll({
      attributes: ['id', 'name', 'description', 'is_default'],
      order: [['name', 'ASC']]
    });
    res.status(200).json(categories);
  } catch (error) {
    logger.error(`Erreur getCategories : ${error.message}`);
    return res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des catégories d'options"
    });
  }
};

/**
 * Récupérer une catégorie d'option par son ID.
 */
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await OptionCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ success: false, error: 'Catégorie non trouvée' });
    }
    res.json(category);
  } catch (error) {
    logger.error(`Erreur récupération catégorie option : ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Mettre à jour une catégorie d'option.
 */
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, is_default } = req.body;
    const category = await OptionCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ success: false, error: 'Catégorie non trouvée' });
    }
    await category.update({
      name: name ?? category.name,
      description: description ?? category.description,
      is_default: is_default ?? category.is_default,
    });
    res.json({
      success: true,
      message: "Catégorie d'option mise à jour avec succès",
      data: category
    });
  } catch (error) {
    logger.error(`Erreur mise à jour catégorie option : ${error.message}`);
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * Supprimer une catégorie d'option.
 */
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await OptionCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ success: false, error: 'Catégorie non trouvée' });
    }
    await category.destroy();
    res.status(200).json({ success: true, message: "Catégorie d'option supprimée avec succès" });
  } catch (error) {
    logger.error(`Erreur suppression catégorie option : ${error.message}`);
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
