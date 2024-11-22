import 'dotenv/config';
import Stripe from 'stripe';

const PORT = process.env.PORT ?? 3000;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (amount) => {
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: 'Reservation Payment',
                    },
                    unit_amount: Math.round(amount * 100), // Stripe expects amount in cents
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONT_URL}/bookings?success=true`,
        cancel_url: `${process.env.FRONT_URL}/bookings?canceled=true`,
    });
    return session;
};
