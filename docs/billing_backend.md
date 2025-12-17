# Stripe Billing Backend - Setup & Configuration

**Version:** 1.0
**Status:** Test Mode Ready

---

## Overview

Complete Stripe integration for payment processing, subscription management, and credit purchases.

---

## Environment Variables

### Server-Side (Cloud Functions)

Add these to your Cloud Function environment configuration:

```bash
# Stripe Keys (Test Mode)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Production (Only after testing)
# STRIPE_SECRET_KEY=sk_live_...
# STRIPE_WEBHOOK_SECRET=whsec_...
```

### Client-Side (.env)

```bash
# Stripe Publishable Key (Test Mode)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## Stripe Dashboard Setup

### 1. Create Products & Prices

In your Stripe Dashboard → Products, create:

**Starter Pack**
- Type: One-time
- Price: $4.99
- Metadata: `credits=50`

**Pro Pack**
- Type: One-time
- Price: $14.99
- Metadata: `credits=200`

**Premium Subscription**
- Type: Recurring (Monthly)
- Price: $29.99/month
- Metadata: `unlimited=true`

**Copy the Price IDs** and update `screens/Plans.tsx`:
```typescript
const PRICE_IDS = {
  starter: 'price_1234...', // Replace with actual IDs
  pro: 'price_5678...',
  premium: 'price_9012...'
};
```

### 2. Configure Webhook

1. Go to **Developers → Webhooks** in Stripe Dashboard
2. Click **Add endpoint**
3. Endpoint URL: `https://your-domain.com/api/billing/webhook`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Copy the **Signing Secret** (`whsec_...`) to `STRIPE_WEBHOOK_SECRET`

---

## Deployment

### Cloud Functions (Firebase)

```bash
# Deploy all billing functions
firebase deploy --only functions:createCheckoutSession,functions:handleWebhook,functions:createPortalSession
```

### Cloud Functions (Vercel)

Create `api/billing/` directory and add endpoints:
- `api/billing/create-checkout-session.ts`
- `api/billing/webhook.ts`
- `api/billing/create-portal-session.ts`

---

## Local Testing

### 1. Install Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows
scoop install stripe

# Linux
# Follow: https://stripe.com/docs/stripe-cli
```

### 2. Test Webhooks Locally

```bash
# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to http://localhost:5001/api/billing/webhook

# In another terminal, trigger test event
stripe trigger checkout.session.completed
```

### 3. Test Checkout Flow

1. Start your local dev server: `npm run dev`
2. Navigate to `/plans`
3. Click "Buy Now" on any plan
4. Use test card: `4242 4242 4242 4242`
5. Verify webhook fires and credits are added

---

## Firestore Security Rules

Ensure users can read their own entitlements but not write directly:

```javascript
match /users/{userId}/entitlements/wallet {
  allow read: if request.auth.uid == userId;
  allow write: if false; // Only Cloud Functions can write
}
```

---

## Monitoring

### Webhook Logs

Check Cloud Function logs for webhook processing:
```bash
firebase functions:log --only handleWebhook --limit 50
```

### Billing Events

Query Firestore `billing_events` collection to see all processed events:
```bash
# In Firebase Console → Firestore → billing_events
```

---

## Troubleshooting

### Webhook Not Firing

1. Verify webhook URL is correct in Stripe Dashboard
2. Check Cloud Function is deployed: `firebase functions:list`
3. Test signature verification with Stripe CLI

### Credits Not Adding

1. Check `handleWebhook` Cloud Function logs
2. Verify `getCreditsFromPrice()` mapping in `handleWebhook.ts`
3. Ensure user exists in Firestore

### Checkout Session Fails

1. Verify `STRIPE_SECRET_KEY` is set correctly
2. Check price IDs match Stripe Dashboard
3. Review Cloud Function logs for errors

---

## Production Checklist

Before going live:

- [ ] Switch from test keys to live keys
- [ ] Test full flow with real card (then refund)
- [ ] Configure Stripe Radar (fraud protection)
- [ ] Set up payout schedule
- [ ] Enable Stripe Tax if required
- [ ] Set up email receipts in Stripe

---

## Support

**Stripe Documentation:**
- Checkout: https://stripe.com/docs/checkout
- Webhooks: https://stripe.com/docs/webhooks
- Testing: https://stripe.com/docs/testing
