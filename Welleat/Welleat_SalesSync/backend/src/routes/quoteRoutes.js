// src/routes/quoteRoutes.js

const express = require('express');
const passport = require('passport');
const { authorizeRoles } = require('../middlewares/authorization');
const quoteController = require('../controllers/quoteController');

const router = express.Router();

// Routes CRUD pour les devis

/**
 * @route POST /api/quotes
 * @desc Créer un devis
 * @access Rôles 1, 2
 */
router.post('/', 
  passport.authenticate('jwt', { session: false }), 
  authorizeRoles(1, 2), 
  quoteController.createQuote
);

/**
 * @route GET /api/quotes
 * @desc Récupérer tous les devis
 * @access Rôles 1, 2
 */
router.get('/', 
  passport.authenticate('jwt', { session: false }), 
  authorizeRoles(1, 2), 
  quoteController.getAllQuotes
);

/**
 * @route GET /api/quotes/:id
 * @desc Récupérer un devis par ID
 * @access Rôles 1, 2
 */
router.get('/:id', 
  passport.authenticate('jwt', { session: false }), 
  authorizeRoles(1, 2), 
  quoteController.getQuoteById
);

/**
 * @route PUT /api/quotes/:id
 * @desc Mettre à jour un devis
 * @access Rôles 1, 2
 */
router.put('/:id', 
  passport.authenticate('jwt', { session: false }), 
  authorizeRoles(1, 2), 
  quoteController.updateQuote
);

/**
 * @route DELETE /api/quotes/:id
 * @desc Supprimer un devis
 * @access Rôles 1, 2
 */
router.delete('/:id', 
  passport.authenticate('jwt', { session: false }), 
  authorizeRoles(1, 2), 
  quoteController.deleteQuote
);

// Routes pour la gestion des états des devis

/**
 * @route POST /api/quotes/:id/submit
 * @desc Soumettre un devis
 * @access Rôles 1, 2
 */
router.post('/:id/submit', 
  passport.authenticate('jwt', { session: false }), 
  authorizeRoles(1, 2), 
  quoteController.submitQuote
);

/**
 * @route POST /api/quotes/:id/approve
 * @desc Approuver un devis
 * @access Rôle 1
 */
router.post('/:id/approve', 
  passport.authenticate('jwt', { session: false }), 
  authorizeRoles(1), 
  quoteController.approveQuote
);

/**
 * @route POST /api/quotes/:id/reject
 * @desc Rejeter un devis
 * @access Rôle 1
 */
router.post('/:id/reject', 
  passport.authenticate('jwt', { session: false }), 
  authorizeRoles(1), 
  quoteController.rejectQuote
);

/**
 * @route POST /api/quotes/:quote_id/options
 * @desc Ajouter une option à un devis
 * @access Rôles 1, 2
 */
router.post('/:quote_id/options', 
  passport.authenticate('jwt', { session: false }), 
  authorizeRoles(1, 2), 
  quoteController.addOptionToQuote
);

module.exports = router;
