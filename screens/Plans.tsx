// screens/Plans.tsx
// Clean pricing grid with payment modal

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Check, Crown, Sparkles, Shield } from 'lucide-react';
import { Button } from '../components/Button';
import { PaymentModal } from '../components/PaymentModal';
import { UserProfile } from '../types';

interface PlansProps {
    user: UserProfile;
}

const PLANS = [
    {
        id: 'basic',
        name: 'Basic',
        price: '€9.99',
        credits: 50,
        features: [
            '50 Generierungen / Monat',
            'Standard Qualität (1024x1024)',
            'Galerie-Speicherung',
            'Email Support'
        ],
        icon: Zap,
        color: 'from-blue-500 to-cyan-500'
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '€19.99',
        credits: 200,
        features: [
            '200 Generierungen / Monat',
            'High Quality (1280x720)',
            'Priorität-Verarbeitung',
            'Extended Gallery',
            'Advanced Visual Details'
        ],
        icon: Sparkles,
        color: 'from-purple-500 to-pink-500',
        recommended: true
    },
    {
        id: 'premium',
        name: 'Premium',
        price: '€39.99',
        credits: 'Unlimited',
        features: [
            'Unbegrenzte Generierungen',
            'Ultra Quality (2048x1536)',
            'Vertex AI Provider',
            'API-Zugang',
            'Priorität-Support',
            'Jederzeit kündbar'
        ],
        icon: Crown,
        color: 'from-yellow-500 to-orange-500'
    }
];

export const Plans: React.FC<PlansProps> = ({ user }) => {
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const handleSelectPlan = (plan: typeof PLANS[0]) => {
        setSelectedPlan(plan);
        setShowPaymentModal(true);
    };

    const handleConfirmPayment = async (paymentMethod: string) => {
        console.log('Payment confirmed:', selectedPlan?.id, paymentMethod);
        // TODO: Integrate Stripe checkout
        await new Promise(resolve => setTimeout(resolve, 1500));
        alert(`Plan ${selectedPlan?.name} abgeschlossen! (Demo)`);
        setShowPaymentModal(false);
        navigate('/home');
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Plan</h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                    Professional AI image generation for creators.
                    Select the plan that fits your creative needs.
                </p>
            </div>

            {/* Pricing Grid - 3 Columns */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
                {PLANS.map((plan) => {
                    const Icon = plan.icon;
                    const isCurrentPlan = user.plan === plan.name;

                    return (
                        <div
                            key={plan.id}
                            className={`relative rounded-2xl border-2 transition-all ${plan.recommended
                                ? 'border-brand-primary scale-105 shadow-2xl shadow-brand-primary/20'
                                : 'border-white/10 hover:border-white/20'
                                } bg-brand-card p-6`}
                        >
                            {/* Recommended Badge */}
                            {plan.recommended && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="bg-brand-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase">
                                        ⭐ Recommended
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
                                <span className="text-gray-400 text-sm ml-2">/month</span>
                            </div>

                            {/* Credits */}
                            <div className="mb-6 p-3 bg-brand-primary/10 rounded-lg border border-brand-primary/20">
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
                                    variant={plan.recommended ? 'primary' : 'secondary'}
                                    fullWidth
                                    onClick={() => handleSelectPlan(plan)}
                                    className={plan.recommended ? 'shadow-xl shadow-purple-900/40' : ''}
                                >
                                    Select Plan
                                </Button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Trust Signals */}
            <div className="text-center space-y-4">
                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                        <Shield size={16} className="text-green-500" />
                        <span>Privacy Focused</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Shield size={16} className="text-green-500" />
                        <span>Secure Stripe Payment</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Shield size={16} className="text-green-500" />
                        <span>Cancel Anytime</span>
                    </div>
                </div>
                <p className="text-xs text-gray-500">
                    All prices incl. VAT. Credits do not expire.
                    <button className="underline ml-1" onClick={() => navigate('/support')}>Need help?</button>
                </p>
            </div>

            {/* Payment Modal */}
            {selectedPlan && (
                <PaymentModal
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    selectedPlan={selectedPlan}
                    onConfirm={handleConfirmPayment}
                />
            )}
        </div>
    );
};
