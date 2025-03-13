// Dossier : src/services
// Fichier : equipmentCategoryService.js
// Service gérant la création et la mise à jour des catégories d'équipements.

const { EquipmentCategory, Equipment } = require('../models/indexModels');
const { categorySchema } = require('../validators/categoryValidators');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

/**
 * Service gérant la création et la mise à jour des catégories d'équipements.
 */
class EquipmentCategoryService {
  /**
   * Crée une nouvelle catégorie d'équipement.
   *
   * @param {object} data - Données de la catégorie.
   * @returns {Promise<object>} Catégorie créée.
   */
  async createCategory(data) {
    try {
      // Validation via Zod
      const validatedData = await categorySchema.parseAsync(data);

      // Tronquer le nom si supérieur à 50 caractères
      if (validatedData.name && validatedData.name.length > 50) {
        validatedData.name = validatedData.name.substring(0, 50);
      }

      // Création en BDD
      const category = await EquipmentCategory.create(validatedData);
      logger.info(`Catégorie d'équipement créée : ${category.name}`);
      return category;
    } catch (error) {
      logger.error('Erreur création catégorie équipement :', error);
      throw error;
    }
  }

  /**
   * Récupère toutes les catégories d'équipements.
   *
   * @returns {Promise<Array>} Liste des catégories.
   */
  async getAllCategories() {
    try {
      return await EquipmentCategory.findAll({ order: [['name', 'ASC']] });
    } catch (error) {
      logger.error('Erreur récupération catégories équipement :', error);
      throw error;
    }
  }

  /**
   * Récupère une catégorie d'équipement par son ID.
   *
   * @param {number} id - ID de la catégorie.
   * @returns {Promise<object>} Catégorie trouvée.
   */
  async getCategoryById(id) {
    try {
      const category = await EquipmentCategory.findByPk(id);
      if (!category) throw new Error("Catégorie d'équipement non trouvée");
      return category;
    } catch (error) {
      logger.error('Erreur récupération catégorie équipement :', error);
      throw error;
    }
  }

  /**
   * Met à jour une catégorie d'équipement.
   *
   * @param {number} id - ID de la catégorie.
   * @param {object} data - Données à mettre à jour.
   * @returns {Promise<object>} Catégorie mise à jour.
   */
  async updateCategory(id, data) {
    try {
      const category = await this.getCategoryById(id);
      const validatedData = await categorySchema.parseAsync(data);

      // Tronquer le nom si supérieur à 50 caractères
      if (validatedData.name && validatedData.name.length > 50) {
        validatedData.name = validatedData.name.substring(0, 50);
      }

      await category.update(validatedData);
      return category;
    } catch (error) {
      logger.error('Erreur mise à jour catégorie équipement :', error);
      throw error;
    }
  }

  /**
   * Supprime une catégorie d'équipement par son ID.
   *
   * @param {number} id - ID de la catégorie.
   * @returns {Promise<object>} Objet indiquant le succès de la suppression.
   */
  async deleteCategory(id) {
    try {
      const category = await this.getCategoryById(id);
      if (!category) throw new Error("Catégorie d'équipement non trouvée");
  
      if (category.is_default) {
        throw new Error("Impossible de supprimer la catégorie par défaut");
      }
  
      // Vérifier si des équipements utilisent cette catégorie
      const equipmentsCount = await Equipment.count({ 
        where: { category_id: id }
      });
  
      if (equipmentsCount > 0) {
        // Si des équipements sont associés, les délier en mettant category_id à null
        await Equipment.update(
          { category_id: null },
          { where: { category_id: id } }
        );
      }
  
      await category.destroy();
      return { success: true, message: "Catégorie supprimée avec succès" };
    } catch (error) {
      logger.error('Erreur lors de la suppression de la catégorie :', error);
      throw error;
    }
  }
}

module.exports = new EquipmentCategoryService();
