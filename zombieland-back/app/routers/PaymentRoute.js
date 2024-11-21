import express from 'express';
import { getAllPayments, getOnePayment, createPayment, updatePayment, deletePayment } from '../controllers/PaymentController.js';


export const router = express.Router();

router.get('/', getAllPayments);

router.get('/:id', getOnePayment);

router.post('/', createPayment);

router.patch('/:id', updatePayment);

router.delete('/:id', deletePayment);