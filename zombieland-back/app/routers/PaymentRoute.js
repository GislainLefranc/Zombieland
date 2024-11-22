import express from 'express';
import { getAllPayments, getPaymentByReservationId, createPayment, deletePayment } from '../controllers/PaymentController.js';


export const router = express.Router();

router.get('/', getAllPayments);

router.get('/:id', getPaymentByReservationId);

router.post('/', createPayment);

//router.patch('/:id', updatePayment);

router.delete('/:id', deletePayment);