import Payment from "../models/Payment.js";
import { createCheckoutSession } from "../services/stripeService.js";

//Get all payments
export const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll();
        if (!payments) {
            return res.status(404).json({ message: "No payments found" });
        }
        res.status(200).json(payments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while fetching payments" });
    };
};

// Get payment by reservation id
export const getPaymentByReservationId = async (req, res) => {
    try {
        const payment = await Payment.findOne({ where: { reservationId: req.params.reservationId } });
        if (!payment) {
            return res.status(404).json({ message: "No payment found for this reservation" });
        }
        res.status(200).json(payment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while fetching payment" });
    };
};

// Create a payment
export const createPayment = async (req, res) => {
    const { date_start, date_end, totalAmount, number_tickets, reservation_id, user_id } = req.body;

    if (!date_start || !date_end || !totalAmount || !number_tickets || !reservation_id || !user_id) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }

    try {
        const session = await createCheckoutSession(
            totalAmount,
            `Reservation from ${date_start} to ${date_end}`
        );
        const payment = await Payment.create({
            amount: totalAmount,
            status: 'pending',
            date_amount: new Date(),
            reservation_id,
            stripe_payment_id: session.id
        });
        res.status(201).json({ payment, sessionUrl: session.url });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while creating payment" });
    }
};

// Delete a payment
export const deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findOne({ where: { id: req.params.id } });
        if (!payment) {
            return res.status(404).json({ message: "No payment found" });
        }
        await payment.destroy();
        res.status(200).json({ message: "Payment deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while deleting payment" });
    }
};