// functions/billing/createCheckoutSession.ts
// Cloud Function to create a Stripe Checkout Session

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16'
});

interface CheckoutRequest {
    priceId: string;
    userId: string;
    mode: 'payment' | 'subscription'; // one-time or recurring
}

export async function createCheckoutSession(req: any, res: any) {
    // CORS
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return res.status(204).send('');
    }

    try {
        const { priceId, userId, mode } = req.body as CheckoutRequest;

        // Validation
        if (!priceId || !userId) {
            return res.status(400).json({ error: 'Missing priceId or userId' });
        }

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            mode: mode || 'payment',
            line_items: [
                {
                    price: priceId,
                    quantity: 1
                }
            ],
            success_url: `${req.headers.origin || 'http://localhost:5173'}/account/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin || 'http://localhost:5173'}/plans?canceled=true`,
            metadata: {
                userId,
                priceId
            },
            client_reference_id: userId, // Links session to user
            allow_promotion_codes: true,
            billing_address_collection: 'required'
        });

        console.log(`[Billing] Checkout session created: ${session.id} for user ${userId}`);

        return res.status(200).json({
            sessionUrl: session.url,
            sessionId: session.id
        });

    } catch (error: any) {
        console.error('[Billing] Checkout session error:', error);
        return res.status(500).json({
            error: 'Failed to create checkout session',
            details: error.message
        });
    }
}
