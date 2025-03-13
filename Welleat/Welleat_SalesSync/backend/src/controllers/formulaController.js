// Dossier : src/controllers
// Fichier : formulaController.js

const formulaService = require('../services/formulaService');
const logger = require('../utils/logger');
const { ZodError } = require('zod');

class FormulaController {
  /**
   * Crée une nouvelle formule.
   * Seul l'administrateur est autorisé à créer une formule.
   */
  async createFormula(req, res, next) {
    try {
      if (req.user.roleId !== 1) {
        return res.status(403).json({
          success: false,
          message: "Accès refusé. Vous n'avez pas la permission de créer une formule."
        });
      }
      const formula = await formulaService.createFormula(req.body);
      logger.info(`Formule ID ${formula.id} créée par l'utilisateur ID ${req.user.id}`);
      return res.status(201).json({ 
        success: true, 
        data: formula, 
        message: "Formule créée avec succès" 
      });
    } catch (error) {
      logger.error(`Erreur création formule : ${error.message}`);
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Erreur de validation des données",
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la création de la formule"
      });
    }
  }

  /**
   * Met à jour les prix d'une formule.
   * Seul l'administrateur est autorisé.
   */
  async updateFormulaPrices(req, res, next) {
    try {
      if (req.user.roleId !== 1) {
        const error = new Error("Accès refusé. Vous n'avez pas la permission de mettre à jour les prix.");
        error.status = 403;
        throw error;
      }
      const { id } = req.params;
      const updatedFormula = await formulaService.updateFormulaPrices(id, req.body);
      logger.info(`Formule ID ${id} mise à jour par l'utilisateur ID ${req.user.id}`);
      return res.status(200).json({ success: true, data: updatedFormula, message: "Mise à jour réussie" });
    } catch (error) {
      logger.error(`Erreur updateFormulaPrices : ${error.message}`, { stack: error.stack });
      if (error instanceof ZodError) {
        error.status = 400;
        error.message = "Erreur de validation";
        error.details = error.errors;
      }
      next(error);
    }
  }

  /**
   * Récupère la liste paginée de formules avec une recherche optionnelle.
   */
  async getAllFormulas(req, res, next) {
    try {
      const page = Number.isInteger(Number(req.query.page)) ? Number(req.query.page) : 1;
      const limit = Number.isInteger(Number(req.query.limit)) ? Number(req.query.limit) : 10;
      const search = req.query.search || "";
      const result = await formulaService.getAllFormulas({ page, limit, search });
      logger.info(`Récupération de ${result.data.length} formules sur ${result.pagination.total}`);
      return res.status(200).json({
        success: true,
        data: result.data,
        message: "Formules récupérées avec succès",
        pagination: result.pagination,
      });
    } catch (error) {
      logger.error(`Erreur récupération formules : ${error.message}`, { stack: error.stack });
      next(error);
    }
  }

  /**
   * Récupère une formule par son ID.
   */
  async getFormulaById(req, res, next) {
    try {
      const { id } = req.params;
      const formula = await formulaService.getFormulaById(id);
      logger.info(`Formule ID ${id} récupérée par l'utilisateur ID ${req.user.id}`);
      return res.status(200).json({ success: true, data: formula, message: "Formule récupérée avec succès" });
    } catch (error) {
      logger.error(`Erreur récupération formule ID ${req.params.id} : ${error.message}`, { stack: error.stack });
      next(error);
    }
  }

  /**
   * Supprime une formule (Admin uniquement).
   */
  async deleteFormula(req, res, next) {
    try {
      if (req.user.roleId !== 1) {
        const error = new Error("Accès refusé. Vous n'avez pas la permission de supprimer une formule.");
        error.status = 403;
        throw error;
      }
      const { id } = req.params;
      const result = await formulaService.deleteFormula(id);
      logger.info(`Formule ID ${id} supprimée par l'utilisateur ID ${req.user.id}`);
      return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      logger.error(`Erreur suppression formule : ${error.message}`, { stack: error.stack });
      next(error);
    }
  }

  /**
   * Met à jour une formule par son ID.
   */
  async updateFormulaById(req, res, next) {
    try {
      const { id } = req.params;
      const updatedFormula = await formulaService.updateFormula(id, req.body);
      logger.info(`Formule ID ${id} mise à jour par l'utilisateur ID ${req.user.id}`);
      return res.status(200).json({ success: true, data: updatedFormula, message: "Formule mise à jour avec succès" });
    } catch (error) {
      logger.error(`Erreur mise à jour formule : ${error.message}`, { stack: error.stack });
      if (error instanceof ZodError) {
        error.status = 400;
        error.message = "Erreur de validation";
        error.details = error.errors;
      }
      next(error);
    }
  }
}

module.exports = new FormulaController();
