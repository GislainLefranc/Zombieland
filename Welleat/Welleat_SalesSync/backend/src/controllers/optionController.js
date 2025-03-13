// Dossier: src/controllers
// Fichier: optionController.js
// Contrôleur pour les options


const { Option, OptionCategory } = require('../models/indexModels');
const { optionSchema, optionUpdateSchema } = require('../validators/optionValidator');
const logger = require('../utils/logger');
const { z } = require('zod');

const optionController = {
  /**
   * Récupérer toutes les options, avec filtrage par catégorie si demandé.
   */
  async getAllOptions(req, res) {
    try {
      const whereClause = req.query.category_id ? { category_id: req.query.category_id } : {};
      const options = await Option.findAll({
        where: whereClause,
        include: [{
          model: OptionCategory,
          as: 'category',
          attributes: ['id', 'name']
        }],
        order: [['name', 'ASC']]
      });
      if (!options) {
        return res.status(404).json({ success: false, error: "Aucune option trouvée" });
      }
      return res.status(200).json({ success: true, data: options });
    } catch (error) {
      logger.error(`Erreur getAllOptions détaillée : ${error.stack}`);
      return res.status(500).json({
        success: false,
        error: "Erreur lors de la récupération des options",
        details: error.message
      });
    }
  },

  /**
   * Créer une option.
   */
  async createOption(req, res) {
    try {
      const { category_id, ...restBody } = req.body;
      if (!category_id) {
        return res.status(400).json({ success: false, error: "Le champ 'category_id' est requis" });
      }
      const category = await OptionCategory.findByPk(category_id);
      if (!category) {
        return res.status(400).json({ success: false, error: "La catégorie spécifiée n'existe pas" });
      }
      const toValidate = { ...restBody, category_id };
      const validatedData = await optionSchema.parseAsync(toValidate);
      const option = await Option.create(validatedData);
      return res.status(201).json({
        success: true,
        message: "Option créée avec succès",
        data: option
      });
    } catch (error) {
      logger.error(`Erreur création option : ${error.message}`);
      if (error instanceof z.ZodError)
        return res.status(400).json({ success: false, error: "Erreur de validation", details: error.errors });
      return res.status(400).json({ success: false, error: error.message });
    }
  },

  /**
   * Récupérer les catégories d'options.
   */
  async getCategories(req, res) {
    try {
      const categories = await OptionCategory.findAll({
        attributes: ['id', 'name', 'description', 'is_default'],
        order: [['name', 'ASC']]
      });
      return res.status(200).json({ success: true, data: categories });
    } catch (error) {
      logger.error(`Erreur getCategories : ${error.message}`);
      return res.status(500).json({
        success: false,
        error: "Erreur lors de la récupération des catégories"
      });
    }
  },

  /**
   * Récupérer une option par son ID.
   */
  async getOptionById(req, res) {
    try {
      const { id } = req.params;
      const option = await Option.findByPk(id, {
        include: [{
          model: OptionCategory,
          as: 'category',
          attributes: ['id', 'name']
        }]
      });
      if (!option)
        return res.status(404).json({ success: false, error: 'Option non trouvée' });
      return res.status(200).json({ success: true, data: option });
    } catch (error) {
      logger.error(`Erreur getOptionById : ${error.message}`);
      return res.status(500).json({ success: false, error: 'Erreur lors de la récupération de l\'option' });
    }
  },

  /**
   * Mettre à jour une option.
   */
  async updateOption(req, res) {
    try {
      const { id } = req.params;
      const { category_id, ...restBody } = req.body;
      const updatePayload = { ...restBody };
      if (category_id === null || category_id === "" || category_id === "null" || category_id === undefined) {
        updatePayload.category_id = null;
      } else {
        const category = await OptionCategory.findByPk(category_id);
        if (!category)
          return res.status(400).json({ success: false, error: "La catégorie spécifiée n'existe pas" });
        updatePayload.category_id = category_id;
      }
      const validatedData = optionUpdateSchema.parse(updatePayload);
      const option = await Option.findByPk(id);
      if (!option) {
        logger.warn(`Option non trouvée pour mise à jour : ID ${id}`);
        return res.status(404).json({ success: false, error: 'Option non trouvée' });
      }
      await option.update(validatedData);
      logger.info(`Option mise à jour : ID ${id}`);
      return res.status(200).json({ success: true, data: option });
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.error(`Validation option update : ${JSON.stringify(error.errors)}`);
        return res.status(400).json({ success: false, error: "Erreur de validation", details: error.errors });
      }
      logger.error(`Erreur mise à jour option : ${error.message}`);
      return res.status(500).json({ success: false, error: "Erreur lors de la mise à jour de l'option" });
    }
  },

  /**
   * Supprimer une option.
   */
  async deleteOption(req, res) {
    try {
      const { id } = req.params;
      const option = await Option.findByPk(id);
      if (!option) {
        logger.warn(`Option non trouvée pour suppression : ID ${id}`);
        return res.status(404).json({ success: false, error: "Option non trouvée" });
      }
      await option.destroy();
      logger.info(`Option supprimée avec succès : ID ${id}`);
      return res.status(200).json({ success: true, message: "Option supprimée avec succès" });
    } catch (error) {
      logger.error(`Erreur suppression option : ${error.message}`);
      return res.status(500).json({ success: false, error: "Erreur lors de la suppression de l'option" });
    }
  },

  /**
   * Retirer une option de sa catégorie.
   */
  async removeFromCategory(req, res) {
    try {
      const { id } = req.params;
      const option = await Option.findByPk(id);
      if (!option) {
        return res.status(404).json({ success: false, error: "Option non trouvée" });
      }
      await option.update({ category_id: null });
      logger.info(`Option ${id} retirée de sa catégorie`);
      return res.status(200).json({
        success: true,
        message: "Option retirée de la catégorie avec succès",
        data: option
      });
    } catch (error) {
      logger.error(`Erreur retrait catégorie : ${error.message}`);
      return res.status(500).json({
        success: false,
        error: "Erreur lors du retrait de l'option de sa catégorie"
      });
    }
  }
};

module.exports = optionController;
