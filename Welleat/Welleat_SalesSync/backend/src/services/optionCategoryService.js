// Dossier : src/services
// Fichier : optionCategoryService.js
// Service pour les catégories d'options

const { OptionCategory, Option } = require('../models/indexModels');
const { categorySchema } = require('../validators/categoryValidators');
const logger = require('../utils/logger');

/**
 * Service gérant la création et la mise à jour des catégories d'options.
 */
class OptionCategoryService {
  /**
   * Crée une nouvelle catégorie d'option.
   *
   * @param {object} data - Données de la catégorie.
   * @returns {Promise<object>} Catégorie créée.
   */
  async createCategory(data) {
    try {
      // Validation via Zod
      const validatedData = await categorySchema.parseAsync(data);

      // Empêcher la création d'une autre catégorie par défaut si elle existe déjà
      if (validatedData.is_default) {
        const existingDefault = await OptionCategory.findOne({ where: { is_default: true } });
        if (existingDefault) {
          throw new Error('Une catégorie par défaut existe déjà');
        }
      }

      // Tronquer le nom si supérieur à 50 caractères
      if (validatedData.name && validatedData.name.length > 50) {
        validatedData.name = validatedData.name.substring(0, 50);
      }

      // Création en BDD
      const category = await OptionCategory.create(validatedData);
      logger.info(`Catégorie d'option créée : ${category.name}`);
      return category;
    } catch (error) {
      logger.error("Erreur création catégorie d'option :", error);
      throw error;
    }
  }

  /**
   * Récupère toutes les catégories d'options.
   *
   * @returns {Promise<Array>} Liste des catégories.
   */
  async getAllCategories() {
    try {
      return await OptionCategory.findAll({ order: [['name', 'ASC']] });
    } catch (error) {
      logger.error('Erreur récupération catégories options :', error);
      throw error;
    }
  }

  /**
   * Récupère une catégorie d'option par son ID.
   *
   * @param {number} id - ID de la catégorie.
   * @returns {Promise<object>} Catégorie trouvée.
   */
  async getCategoryById(id) {
    try {
      const category = await OptionCategory.findByPk(id);
      if (!category) {
        throw new Error('Catégorie non trouvée');
      }
      return category;
    } catch (error) {
      logger.error(`Erreur récupération catégorie ID ${id} :`, error);
      throw error;
    }
  }

  /**
   * Met à jour une catégorie d'option.
   *
   * @param {number} id - ID de la catégorie.
   * @param {object} data - Données à mettre à jour.
   * @returns {Promise<object>} Catégorie mise à jour.
   */
  async updateCategory(id, data) {
    try {
      const category = await OptionCategory.findByPk(id);
      if (!category) {
        throw new Error('Catégorie non trouvée');
      }

      // Si is_default est activé sur une catégorie non par défaut, vérifier l'existence d'une autre catégorie par défaut
      if (data.is_default && !category.is_default) {
        const existingDefault = await OptionCategory.findOne({ where: { is_default: true } });
        if (existingDefault) {
          throw new Error('Une autre catégorie par défaut existe déjà');
        }
      }

      const validatedData = await categorySchema.parseAsync(data);

      // Tronquer le nom si supérieur à 50 caractères
      if (validatedData.name && validatedData.name.length > 50) {
        validatedData.name = validatedData.name.substring(0, 50);
      }

      await category.update(validatedData);
      logger.info(`Catégorie d'option mise à jour : ID ${id}`);
      return category;
    } catch (error) {
      logger.error(`Erreur mise à jour catégorie ID ${id} :`, error);
      throw error;
    }
  }

  /**
   * Supprime une catégorie d'option par son ID.
   *
   * @param {number} id - ID de la catégorie.
   * @returns {Promise<object>} Objet indiquant le succès de la suppression.
   */
  async deleteCategory(id) {
    try {
      const category = await OptionCategory.findByPk(id);
      if (!category) {
        throw new Error('Catégorie non trouvée');
      }

      if (category.is_default) {
        throw new Error('Impossible de supprimer la catégorie par défaut');
      }

      // Réassigner les options existantes à la catégorie par défaut
      const defaultCategory = await OptionCategory.findOne({ where: { is_default: true } });
      if (!defaultCategory) {
        throw new Error('Configuration système incorrecte : pas de catégorie par défaut');
      }

      await Option.update(
        { category_id: defaultCategory.id },
        { where: { category_id: id } }
      );

      await category.destroy();
      logger.info(`Catégorie supprimée : ID ${id}`);
      return { success: true, message: `La catégorie "${category.name}" a été supprimée avec succès` };
    } catch (error) {
      logger.error(`Erreur suppression catégorie ID ${id} :`, error);
      throw error;
    }
  }
}

module.exports = new OptionCategoryService();
