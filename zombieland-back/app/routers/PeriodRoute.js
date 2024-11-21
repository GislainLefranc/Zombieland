import express from 'express';
import { getAllPeriods, getOnePeriod, createPeriod, updatePeriod, deletePeriod } from '../controllers/PeriodController.js';


export const router = express.Router();

router.get('/', getAllPeriods);

router.get('/:id', getOnePeriod);

router.post('/', createPeriod);

router.patch('/:id', updatePeriod);

router.delete('/:id', deletePeriod);