// src/routes/quotesInterlocutorsRoutes.js

const express = require('express');
const QuotesInterlocutorsController = require('../controllers/quotesInterlocutorsController');
const router = express.Router();

// Créer une nouvelle association
router.post('/', QuotesInterlocutorsController.create);

// Mettre à jour une association existante
router.put('/:quoteId/:interlocutorId', QuotesInterlocutorsController.update);

// Supprimer une association
router.delete('/:quoteId/:interlocutorId', QuotesInterlocutorsController.delete);

// Récupérer toutes les associations pour un devis
router.get('/quote/:quoteId', QuotesInterlocutorsController.getByQuote);

module.exports = router;