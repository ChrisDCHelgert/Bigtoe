// functions/billing/handleWebhook.ts
// Stripe Webhook Handler - Processes payment events

import Stripe from 'stripe';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16'
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
const db = getFirestore();

export async function handleWebhook(req: any, res: any) {
    const sig = req.headers['stripe-signature'];

    let event: Stripe.Event;

    try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(
            req.rawBody, // Raw body needed for signature verification
            sig,
            WEBHOOK_SECRET
        );
    } catch (err: any) {
        console.error('[Webhook] Signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(`[Webhook] Received event: ${event.type} (${event.id})`);

    try {
        // Route to appropriate handler
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
                break;

            case 'customer.subscription.created':
            case 'customer.subscription.updated':
                await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
                break;

            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
                break;

            case 'invoice.paid':
                await handleInvoicePaid(event.data.object as Stripe.Invoice);
                break;

            case 'invoice.payment_failed':
                await handleInvoiceFailed(event.data.object as Stripe.Invoice);
                break;

            default:
                console.log(`[Webhook] Unhandled event type: ${event.type}`);
        }

        // Log event to audit trail
        await logBillingEvent(event);

        return res.status(200).json({ received: true });

    } catch (error: any) {
        console.error('[Webhook] Handler error:', error);
        return res.status(500).json({ error: error.message });
    }
}

// ============= Event Handlers =============

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId || session.client_reference_id;

    if (!userId) {
        console.error('[Webhook] No userId in checkout session');
        return;
    }

    console.log(`[Webhook] Checkout completed for user ${userId}`);

    if (session.mode === 'payment') {
        // One-time purchase (Credit Pack)
        const creditsToAdd = getCreditsFromPrice(session.metadata?.priceId || '');

        await db.runTransaction(async (transaction) => {
            const walletRef = db.doc(`users/${userId}/entitlements/wallet`);
            const walletSnap = await transaction.get(walletRef);

            const currentCredits = walletSnap.data()?.credits || 0;

            transaction.set(walletRef, {
                credits: currentCredits + creditsToAdd,
                lastPurchase: Timestamp.now()
            }, { merge: true });
        });

        console.log(`[Webhook] Added ${creditsToAdd} credits to user ${userId}`);
    }
    else if (session.mode === 'subscription') {
        // Subscription created
        const subscriptionId = session.subscription as string;

        await db.doc(`users/${userId}/entitlements/wallet`).set({
            subscriptionId,
            subscriptionStatus: 'active',
            priceId: session.metadata?.priceId
        }, { merge: true });

        console.log(`[Webhook] Activated subscription ${subscriptionId} for user ${userId}`);
    }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    const userId = subscription.metadata?.userId;

    if (!userId) {
        console.error('[Webhook] No userId in subscription');
        return;
    }

    await db.doc(`users/${userId}/entitlements/wallet`).set({
        subscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        currentPeriodEnd: Timestamp.fromDate(new Date(subscription.current_period_end * 1000)),
        priceId: subscription.items.data[0]?.price.id
    }, { merge: true });

    console.log(`[Webhook] Updated subscription ${subscription.id} status: ${subscription.status}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const userId = subscription.metadata?.userId;

    if (!userId) return;

    await db.doc(`users/${userId}/entitlements/wallet`).set({
        subscriptionStatus: 'canceled',
        canceledAt: Timestamp.now()
    }, { merge: true });

    console.log(`[Webhook] Subscription ${subscription.id} canceled`);
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
    if (!invoice.subscription) return;

    const subscriptionId = invoice.subscription as string;

    // Extend subscription validity
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const userId = subscription.metadata?.userId;

    if (userId) {
        await db.doc(`users/${userId}/entitlements/wallet`).set({
            subscriptionStatus: 'active',
            currentPeriodEnd: Timestamp.fromDate(new Date(subscription.current_period_end * 1000)),
            lastPayment: Timestamp.now()
        }, { merge: true });

        console.log(`[Webhook] Invoice paid for subscription ${subscriptionId}`);
    }
}

async function handleInvoiceFailed(invoice: Stripe.Invoice) {
    if (!invoice.subscription) return;

    const subscriptionId = invoice.subscription as string;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const userId = subscription.metadata?.userId;

    if (userId) {
        // Set to past_due (grace period)
        await db.doc(`users/${userId}/entitlements/wallet`).set({
            subscriptionStatus: 'past_due',
            paymentFailedAt: Timestamp.now()
        }, { merge: true });

        console.log(`[Webhook] Payment failed for subscription ${subscriptionId} - Grace period started`);
    }
}

// ============= Helpers =============

function getCreditsFromPrice(priceId: string): number {
    // Map price IDs to credit amounts
    // This should match your Stripe product configuration
    const priceMap: Record<string, number> = {
        'price_starter': 50,
        'price_pro': 200,
        'price_premium': 500
    };

    return priceMap[priceId] || 10; // Default fallback
}

async function logBillingEvent(event: Stripe.Event) {
    try {
        await db.collection('billing_events').add({
            eventId: event.id,
            eventType: event.type,
            timestamp: Timestamp.now(),
            data: event.data.object
        });
    } catch (error) {
        console.error('[Webhook] Failed to log event:', error);
    }
}
