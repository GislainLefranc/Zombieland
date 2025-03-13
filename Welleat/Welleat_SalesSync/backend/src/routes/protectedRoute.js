
const express = require('express');
const router = express.Router();

/**
 * @route GET /api/protected
 * @desc Route protégée par authentification
 * @access Authentifié
 */
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Accès autorisé à la route protégée' });
});

module.exports = router;