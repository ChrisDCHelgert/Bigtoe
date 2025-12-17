// functions/rateLimiter.ts
// MOCK IMPLEMENTATION for Strategic Review
// This logic would reside in a Firebase Cloud Function or Edge Middleware

import { firestore } from 'firebase-admin';

interface RateLimitConfig {
    windowSeconds: number;
    maxRequests: number;
}

const LIMITS: Record<string, RateLimitConfig> = {
    guest: { windowSeconds: 3600, maxRequests: 5 },
    registered: { windowSeconds: 3600, maxRequests: 50 },
    pro: { windowSeconds: 3600, maxRequests: 500 }
};

export async function checkRateLimit(userId: string, role: string = 'guest'): Promise<boolean> {
    const now = Date.now();
    const config = LIMITS[role] || LIMITS['guest'];

    const ref = firestore().collection('rate_limits').doc(userId);

    return firestore().runTransaction(async (t) => {
        const doc = await t.get(ref);
        const data = doc.data() || { count: 0, windowStart: now };

        // Reset window if expired
        if (now - data.windowStart > config.windowSeconds * 1000) {
            t.set(ref, { count: 1, windowStart: now });
            return true;
        }

        // Check limit
        if (data.count >= config.maxRequests) {
            console.warn(`[Security] Rate limit exceeded for user ${userId}`);
            return false; // BLOCKED
        }

        // Increment
        t.update(ref, { count: data.count + 1 });
        return true; // ALLOWED
    });
}
