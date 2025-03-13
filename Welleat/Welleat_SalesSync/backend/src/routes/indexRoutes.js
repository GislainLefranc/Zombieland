
const express = require('express');
const router = express.Router();

const optionRoutes = require('./optionRoutes');
const equipmentRoutes = require('./equipmentRoutes');
const userRoutes = require('./userRoutes');
const companyRoutes = require('./companyRoutes'); 
const simulationRoutes = require('./simulationRoutes');
const roleRoutes = require('./roleRoutes');
const emailRoutes = require('./emailRoutes');
const interlocutorRoutes = require('./interlocutorRoutes');
const authRoutes = require('./authRoutes');
const functioningRoutes = require('./functioningRoutes');
const assignRoutes = require('./assignRoutes');
const reportRoutes = require('./reportRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const quoteRoutes = require('./quoteRoutes');
const quoteEquipmentRoutes = require('./quoteEquipmentRoutes');
const formulaRoutes = require('./formulaRoutes');
const formulaOptionsRoutes = require('./formulaOptionsRoutes');
const interlocutorCompanyRoutes = require('./interlocutorCompanyRoute');

const equipmentCategoryRoutes = require('./equipmentCategoryRoutes');
const optionCategoryRoutes = require('./optionCategoryRoutes');

router.use('/users', userRoutes);
router.use('/companies', companyRoutes);
router.use('/simulations', simulationRoutes);
router.use('/roles', roleRoutes);
router.use('/emails', emailRoutes);
router.use('/interlocutors', interlocutorRoutes);
router.use('/auth', authRoutes);
router.use('/functionings', functioningRoutes);
router.use('/assign', assignRoutes);
router.use('/reports', reportRoutes);
router.use('/dashboard', dashboardRoutes);

router.use('/equipments', equipmentRoutes); 
router.use('/options', optionRoutes);

router.use('/equipments/categories', equipmentCategoryRoutes);
router.use('/options/categories', optionCategoryRoutes);

router.use('/quotes/:quote_id/equipment', quoteEquipmentRoutes);
router.use('/quotes', quoteRoutes);
router.use('/formulas', formulaRoutes);
router.use('/formula-options', formulaOptionsRoutes);

router.use('/interlocutor-company', interlocutorCompanyRoutes);

module.exports = router;
