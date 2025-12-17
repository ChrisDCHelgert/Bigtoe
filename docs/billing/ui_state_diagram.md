# Billing UI State Diagram

**Version:** 1.0
**Context:** Visual Feedback for Subscription Status

---

## 1. States

### A. **Free (Default)**
*   **Indicator:** Badge "STARTER" (Grey).
*   **Access:** Standard Generation, Slow Queue.
*   **CTA:** "Upgrade to Pro" (Primary Button).

### B. **Active (Pro)**
*   **Indicator:** Badge "PRO" (Gold/Purple).
*   **Access:** HD, Priority Queue, Private Library.
*   **CTA:** "Manage Subscription" (Secondary Button -> Portal).

### C. **Past Due (Grace)**
*   **Indicator:** Badge "PAYMENT FAILED" (Red).
*   **Access:** **Retained** (for 3-7 days grace period).
*   **Banner:** "Payment failed. Update details to keep access."
*   **CTA:** "Fix Payment" (Destructive/Primary -> Portal).

### D. **Canceled (Churn Logic)**
*   **Indicator:** Badge "PRO (Ending Soon)" (Orange).
*   **Access:** Retained until `current_period_end`.
*   **Banner:** "Your plan ends on [Date]. Resubscribe to keep benefits."
*   **CTA:** "Reactivate" (Primary).

### E. **Expired**
*   **Indicator:** Badge "STARTER" (Grey).
*   **Transition:** Occurs after `current_period_end` of Canceled state.
*   **Access:** Downgraded to Free.

---

## 2. Frontend Logic (React)

```typescript
const PLAN_STATES = {
  free: { badge: 'Starter', color: 'gray' },
  active: { badge: 'Pro', color: 'purple' },
  past_due: { badge: 'Payment Issue', color: 'red' },
  canceled: { badge: 'Ending Soon', color: 'orange' }
};

function PlanBadge({ subscription }) {
  const status = subscription?.status || 'free';
  const config = PLAN_STATES[status];
  
  return <Badge color={config.color}>{config.badge}</Badge>;
}
```
