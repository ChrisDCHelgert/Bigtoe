// functions/billing/createPortalSession.ts
// Cloud Function to create Stripe Customer Portal Session

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16'
});

interface PortalRequest {
    customerId: string;
    userId: string;
}

export async function createPortalSession(req: any, res: any) {
    // CORS
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return res.status(204).send('');
    }

    try {
        const { customerId } = req.body as PortalRequest;

        if (!customerId) {
            return res.status(400).json({ error: 'Missing customerId' });
        }

        // Create portal session
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${req.headers.origin || 'http://localhost:5173'}/account/billing`
        });

        console.log(`[Billing] Portal session created for customer ${customerId}`);

        return res.status(200).json({
            portalUrl: session.url
        });

    } catch (error: any) {
        console.error('[Billing] Portal session error:', error);
        return res.status(500).json({
            error: 'Failed to create portal session',
            details: error.message
        });
    }
}
