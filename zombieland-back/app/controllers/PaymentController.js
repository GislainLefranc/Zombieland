import Payment from "../models/Payment.js";

export const getAllPayments = async (req, res)=>{
    try {
        const payment = await Payment.findAll();

        if(!payment.length){
            return res.status(404).json({message: 'Payment not found'});
        }
        res.status(200).json(payment);
    } catch (error) {
        console.error('Server error while fetching payment', error);
        res.status(500).json({message: 'Server error while fetching payment'});
        
    }
};

export const getOnePayment = async (req, res)=> {
    try {
        const paymentId = req.params.id;
        const payment = await Payment.findByPk(paymentId);
        if(!payment){
            return res.status(404).json({message: 'Payment not found'})
        }
        res.status(200).json(payment);
    } catch (error) {
        console.error('Server error while fetching payment', error);
        res.status(500).json({message: 'Server error while fetching payment'});
    }
};

export const createPayment = async (req, res) =>{
    try {
        const { amount, status, date_amount, reservation_id, stripe_payment_id } = req.body;
        if(!amount){
            return res.status(400).json({message: "A payment must have an amount"})
        }
        const newPayment = await Payment.create({amount, status, date_amount, reservation_id, stripe_payment_id });
        if (!newPayment){
            return res.status(500).json({message: 'Something went wrong'})
        }

        res.status(201).json(newPayment)
    } catch (error) {
        console.error('Server error while creating payment', error);
        res.status(500).json({message: 'Server error while creating payment'});
    }
};

export const updatePayment = async(req, res) =>{
    try {
        const paymentId = req.params.id;
        const{amount, status, date_amount, reservation_id, stripe_payment_id} = req.body;
        const payment = await Payment.findByPk(paymentId);
        if(!payment){
            return res.status(404).json({message : 'Payment not found'});
        }
        payment.amount = amount;
        payment.status = status; 
        payment.date_amount = date_amount;
        payment.reservation_id = reservation_id;
        payment.stripe_payment_id = stripe_payment_id;
        await payment.save();
        
        res.status(200).json(payment);
    } catch (error) {
        console.error('Server error while updating payment', error);
        res.status(500).json({message: 'Server error while updating payment'});
    }
};

export const deletePayment = async (req, res) =>{
    try {
        const paymentId = req.params.id;
        const payment = await Payment.findByPk(paymentId);
        if(!payment){
            return res.status(404).json({message: 'Payment not found'});
        }

        await payment.destroy();
        res.status(204).json({message: 'Payment is destroyed'})
    } catch (error) {
        console.error('Server error while deleting payment', error);
        res.status(500).json({message: 'Server error while deleting payment'});
    }
}