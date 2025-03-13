
const express = require('express');
const router = express.Router();
const {
  assignInterlocutorToCompany,
  removeInterlocutorFromCompany,
  getInterlocutorsByCompany,
  updatePrincipalStatus,
} = require('../controllers/interlocutorCompanyController');

/**
 * @route POST /api/interlocutor-company/assign
 * @desc Assigner un interlocuteur à une entreprise
 * @access Rôles 1, 2
 */
router.post('/assign', assignInterlocutorToCompany);

/**
 * @route DELETE /api/interlocutor-company/remove/:interlocutorId/:companyId
 * @desc Supprimer l'association d'un interlocuteur avec une entreprise
 * @access Rôles 1, 2
 */
router.delete('/remove/:interlocutorId/:companyId', removeInterlocutorFromCompany);

/**
 * @route GET /api/interlocutor-company/company/:companyId
 * @desc Récupérer tous les interlocuteurs d'une entreprise
 * @access Rôles 1, 2
 */
router.get('/company/:companyId', getInterlocutorsByCompany);

/**
 * @route PUT /api/interlocutor-company/principal/:interlocutorId/:companyId
 * @desc Mettre à jour le statut principal d'un interlocuteur pour une entreprise
 * @access Rôles 1, 2
 */
router.put('/principal/:interlocutorId/:companyId', updatePrincipalStatus);

module.exports = router;