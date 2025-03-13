// Dossier : src/services
// Fichier : categoryService.js
// Service pour les catégories d'options et d'équipements

const optionCategoryService = require('./optionCategoryService');
const equipmentCategoryService = require('./equipmentCategoryService');

/**
 * Retourne le service approprié en fonction du type de catégorie.
 *
 * @param {string} categoryType - 'option' ou 'equipment'.
 * @returns {object} Service correspondant.
 * @throws {Error} Si le type est invalide.
 */
function getService(categoryType) {
  if (categoryType === 'option') {
    return optionCategoryService;
  } else if (categoryType === 'equipment') {
    return equipmentCategoryService;
  } else {
    throw new Error("Type de catégorie invalide. Utilisez 'option' ou 'equipment'.");
  }
}

/**
 * Crée une catégorie en déléguant au service spécifique.
 *
 * @param {object} data - Données de la catégorie.
 * @param {string} categoryType - 'option' ou 'equipment'.
 * @returns {Promise<object>} Catégorie créée.
 */
async function createCategory(data, categoryType) {
  const service = getService(categoryType);
  return await service.createCategory(data);
}

/**
 * Récupère toutes les catégories pour le type donné.
 *
 * @param {string} categoryType - 'option' ou 'equipment'.
 * @returns {Promise<Array>} Liste des catégories.
 */
async function getAllCategories(categoryType) {
  const service = getService(categoryType);
  return await service.getAllCategories();
}

/**
 * Récupère une catégorie par son ID pour le type donné.
 *
 * @param {number} id - ID de la catégorie.
 * @param {string} categoryType - 'option' ou 'equipment'.
 * @returns {Promise<object>} Catégorie trouvée.
 */
async function getCategoryById(id, categoryType) {
  const service = getService(categoryType);
  return await service.getCategoryById(id);
}

/**
 * Met à jour une catégorie par son ID pour le type donné.
 *
 * @param {number} id - ID de la catégorie.
 * @param {object} data - Données de mise à jour.
 * @param {string} categoryType - 'option' ou 'equipment'.
 * @returns {Promise<object>} Catégorie mise à jour.
 */
async function updateCategory(id, data, categoryType) {
  const service = getService(categoryType);
  return await service.updateCategory(id, data);
}

/**
 * Supprime une catégorie par son ID pour le type donné.
 *
 * @param {number} id - ID de la catégorie.
 * @param {string} categoryType - 'option' ou 'equipment'.
 * @returns {Promise<object>} Objet indiquant le succès de la suppression.
 */
async function deleteCategory(id, categoryType) {
  const service = getService(categoryType);
  return await service.deleteCategory(id);
}

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
