const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const { authorizeRoles } = require('../middlewares/authorization');
const equipmentController = require('../controllers/equipmentController');
const equipmentCategoryController = require('../controllers/equipmentCategoryController');

// Configuration de Multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/equipmentImages'); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${path.basename(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Le fichier doit être une image.'), false);
    }
  }
});

/**
 * @route GET /api/equipments
 * @desc Récupérer tous les équipements
 * @access Rôles 1, 2
 */
router.get('/', 
  passport.authenticate('jwt', { session: false }), 
  authorizeRoles(1, 2),
  equipmentController.getAllEquipments
);

/**
 * @route GET /api/equipments/categories
 * @desc Récupérer toutes les catégories d'équipements
 * @access Rôles 1, 2
 */
router.get('/categories', 
  passport.authenticate('jwt', { session: false }), 
  authorizeRoles(1, 2),
  equipmentCategoryController.getAllCategories
);

/**
 * @route GET /api/equipments/:id
 * @desc Récupérer un équipement par ID
 * @access Rôles 1, 2
 */
router.get('/:id', 
  passport.authenticate('jwt', { session: false }), 
  authorizeRoles(1, 2),
  equipmentController.getEquipmentById
);

/**
 * @route POST /api/equipments
 * @desc Créer un nouvel équipement (avec upload d'image)
 * @access Rôle 1
 */
router.post('/', 
  passport.authenticate('jwt', { session: false }), 
  authorizeRoles(1),
  upload.single('image'),
  equipmentController.createEquipment
);

/**
 * @route POST /api/equipments/categories
 * @desc Créer une nouvelle catégorie d'équipements
 * @access Rôle 1
 */
router.post('/categories', 
  passport.authenticate('jwt', { session: false }), 
  authorizeRoles(1),
  equipmentCategoryController.createCategory
);

/**
 * @route PUT /api/equipments/:id
 * @desc Mettre à jour un équipement (avec upload optionnel d'image)
 * @access Rôle 1
 */
router.put('/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1),
  upload.single('image'),
  equipmentController.updateEquipment
);

/**
 * @route DELETE /api/equipments/:id
 * @desc Supprimer un équipement
 * @access Rôle 1
 */
router.delete('/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(1),
  equipmentController.deleteEquipment
);

module.exports = router;