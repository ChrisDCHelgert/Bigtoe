// screens/Plans.tsx
// Pricing & Plans page with Stripe Checkout integration

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Check, Crown, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { UserProfile } from '../types';

interface PlansProps {
    user: UserProfile;
}

// Stripe Price IDs (Replace with your actual Stripe price IDs)
const PRICE_IDS = {
    starter: 'price_starter_50_credits',
    pro: 'price_pro_200_credits',
    premium: 'price_premium_monthly'
};

const PLANS = [
    {
        id: 'starter',
        name: 'Starter Pack',
        price: '$4.99',
        credits: 50,
        features: [
            '50 Generation Credits',
            'Standard Quality (1024x1024)',
            'Gallery Storage',
            'No Expiration'
        ],
        priceId: PRICE_IDS.starter,
        mode: 'payment' as const,
        icon: Zap,
        color: 'from-blue-500 to-cyan-500'
    },
    {
        id: 'pro',
        name: 'Pro Pack',
        price: '$14.99',
        credits: 200,
        features: [
            '200 Generation Credits',
            'High Quality (1280x720)',
            'Priority Processing',
            'Extended Gallery'
        ],
        priceId: PRICE_IDS.pro,
        mode: 'payment' as const,
        icon: Sparkles,
        color: 'from-purple-500 to-pink-500',
        popular: true
    },
    {
        id: 'premium',
        name: 'Premium',
        price: '$29.99/mo',
        credits: 'Unlimited',
        features: [
            'Unlimited Generations',
            'Ultra Quality (2048x1536)',
            'Vertex AI Provider',
            'Cancel Anytime'
        ],
        priceId: PRICE_IDS.premium,
        mode: 'subscription' as const,
        icon: Crown,
        color: 'from-yellow-500 to-orange-500'
    }
];

export const Plans: React.FC<PlansProps> = ({ user }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<string | null>(null);

    const handleCheckout = async (priceId: string, mode: 'payment' | 'subscription', planId: string) => {
        setLoading(planId);

        try {
            // Call Cloud Function to create Checkout Session
            const response = await fetch('/api/billing/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId,
                    userId: 'user_id_placeholder', // Replace with actual user.id from auth
                    mode
                })
            });

            const data = await response.json();

            if (data.sessionUrl) {
                // Redirect to Stripe Checkout
                window.location.href = data.sessionUrl;
            } else {
                alert('Failed to create checkout session');
                setLoading(null);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Something went wrong. Please try again.');
            setLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg p-6 pt-16 pb-20">
            {/* Header */}
            <div className="max-w-6xl mx-auto text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
                <p className="text-gray-400 text-lg">Select the perfect plan for your creative needs</p>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
                {PLANS.map((plan) => {
                    const Icon = plan.icon;
                    const isCurrentPlan = user.plan === plan.name;

                    return (
                        <div
                            key={plan.id}
                            className={`relative rounded-2xl border-2 transition-all ${plan.popular
                                    ? 'border-brand-primary scale-105 shadow-2xl shadow-brand-primary/20'
                                    : 'border-white/10 hover:border-white/30'
                                } bg-brand-card p-6`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="bg-brand-primary text-white px-4 py-1 rounded-full text-xs font-bold">
                                        MOST POPULAR
                                    </span>
                                </div>
                            )}

                            {/* Icon */}
                            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center mb-4`}>
                                <Icon size={32} className="text-white" />
                            </div>

                            {/* Plan Name */}
                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>

                            {/* Price */}
                            <div className="mb-6">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                {plan.mode === 'subscription' && <span className="text-gray-400 text-sm ml-2">per month</span>}
                            </div>

                            {/* Credits */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 text-brand-primary font-bold">
                                    <Zap size={20} fill="currentColor" />
                                    <span>{typeof plan.credits === 'number' ? `${plan.credits} Credits` : plan.credits}</span>
                                </div>
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm">
                                        <Check size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            {isCurrentPlan ? (
                                <Button variant="secondary" fullWidth disabled>
                                    Current Plan
                                </Button>
                            ) : (
                                <Button
                                    variant={plan.popular ? 'primary' : 'secondary'}
                                    fullWidth
                                    onClick={() => handleCheckout(plan.priceId, plan.mode, plan.id)}
                                    isLoading={loading === plan.id}
                                >
                                    {plan.mode === 'subscription' ? 'Subscribe Now' : 'Buy Now'}
                                </Button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* FAQ / Info */}
            <div className="max-w-4xl mx-auto mt-16 text-center">
                <p className="text-gray-400 text-sm">
                    All prices in USD. Credits never expire. Secure payment via Stripe.
                    <button className="underline ml-1" onClick={() => navigate('/support')}>Need help?</button>
                </p>
            </div>
        </div>
    );
};
