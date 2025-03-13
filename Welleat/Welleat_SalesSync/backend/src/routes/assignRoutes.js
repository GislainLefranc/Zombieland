const express = require('express');
const passport = require('passport');
const { authorizeRoles } = require('../middlewares/authorization');
const assignService = require('../services/assignService'); // Importez assignService
const {
  assignUserToCompany,
  assignCompaniesToInterlocutors,
  assignHandler,
  setPrincipalInterlocutor,
} = require('../controllers/assignController');

const router = express.Router();

// Middleware d'authentification global
router.use(passport.authenticate('jwt', { session: false }));

/**
 * @route POST /api/assign
 * @desc Route principale d'assignation
 * @access Admin et Sales User (rôles 1 et 2)
 */
router.post('/', authorizeRoles(1, 2), assignHandler);

/**
 * @route POST /api/assign/companies-users-interlocutors
 * @desc Assigner un utilisateur à une entreprise et un interlocuteur
 * @access Admin uniquement
 */
router.post(
  '/companies-users-interlocutors',
  authorizeRoles(1),
  assignUserToCompany
);

/**
 * @route PUT /api/assign/companies-to-interlocutors
 * @desc Assigner plusieurs entreprises à plusieurs interlocuteurs
 * @access Admin et Sales User
 */
router.put(
  '/companies-to-interlocutors',
  authorizeRoles(1, 2),
  assignCompaniesToInterlocutors
);

/**
 * @route PUT /api/assign/interlocutors-to-companies
 * @desc Assigner plusieurs interlocuteurs à une entreprise
 * @access Admin et Sales User
 */
router.put(
  '/interlocutors-to-companies',
  authorizeRoles(1, 2),
  async (req, res) => { // Utilisez une fonction asynchrone ici
    try {
      await assignService.assignInterlocutorsToCompanies(req.body.interlocutorIds, req.body.companyId, req, res);
    } catch (error) {
      console.error("Error in assignInterlocutorsToCompanies route:", error);
      res.status(500).json({ error: "Failed to assign interlocutors to companies" });
    }
  }
);

/**
 * @route PUT /api/assign/companies/:companyId/interlocutors/:interlocutorId/principal
 * @desc Définir un interlocuteur principal pour une entreprise
 * @access Admin et Sales User (rôles 1 et 2)
 */
router.put(
  '/companies/:companyId/interlocutors/:interlocutorId/principal',
  authorizeRoles(1, 2),
  async (req, res) => {
    try {
      const { companyId, interlocutorId } = req.params;
      
      // Appeler le service avec l'ID de l'utilisateur connecté
      const result = await assignService.setPrincipalInterlocutor(
        companyId, 
        interlocutorId,
        req.user.id // Utilisez l'ID de l'utilisateur connecté
      );

      if (result.success) {
        res.json({ 
          success: true, 
          message: 'Interlocuteur principal mis à jour avec succès' 
        });
      } else {
        res.status(400).json({ 
          success: false, 
          message: result.message || 'Erreur lors de la mise à jour' 
        });
      }
    } catch (error) {
      console.error("Erreur dans la route setPrincipalInterlocutor:", error);
      res.status(500).json({ 
        success: false, 
        message: "Impossible de définir l'interlocuteur principal",
        error: error.message 
      });
    }
  }
);

module.exports = router;