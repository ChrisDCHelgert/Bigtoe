// screens/Plans.tsx
// Fetish/Creator Pricing - 3 Cards, Single CTA

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Check, Crown, Sparkles, Shield, Star } from 'lucide-react';
import { Button } from '../components/Button';
import { PaymentModal } from '../components/PaymentModal';
import { UserProfile } from '../types';

interface PlansProps {
    user: UserProfile;
}

const PLANS = [
    {
        id: 'basic',
        name: 'Starter',
        price: '€9.99',
        credits: 100,
        features: [
            '50 Bilder / Monat',
            'Standard Qualität',
            'Basis Fetisch-Stile',
            'Privat-Galerie'
        ],
        icon: Zap,
        color: 'from-blue-500 to-cyan-500'
    },
    {
        id: 'pro',
        name: 'Creator',
        price: '€19.99',
        credits: 500,
        features: [
            '200 Bilder / Monat',
            'Hohe Auflösung (HD)',
            'Alle Fetisch-Presets',
            'Priorisierte Generierung',
            'Keine Wasserzeichen'
        ],
        icon: Sparkles,
        color: 'from-purple-500 to-pink-500',
        recommended: true
    },
    {
        id: 'premium',
        name: 'Elite',
        price: '€39.99',
        credits: 1500,
        features: [
            'Unbegrenzt* Generieren',
            '4K Ultra-HD Qualität',
            'Exklusive "Deep Fetish" Modelle',
            'Kommerzielle Lizenz',
            'VIP Support'
        ],
        icon: Crown,
        color: 'from-yellow-500 to-orange-500'
    }
];

export const Plans: React.FC<PlansProps> = ({ user }) => {
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0]>(PLANS[1]); // Default to Pro
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const handleConfirmPayment = async (paymentMethod: string) => {
        // Mock payment
        await new Promise(resolve => setTimeout(resolve, 1500));
        alert(`Upgrade erfolgreich! Willkommen im ${selectedPlan.name} Plan.`);
        setShowPaymentModal(false);
        navigate('/home');
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">

            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Wähle dein Level</h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                    Professionelle KI-Tools für Fetisch-Creator und Künstler.
                    Anonym. Diskret. Jederzeit kündbar.
                </p>
            </div>

            {/* Pricing Grid - 3 Columns */}
            <div className="grid md:grid-cols-3 gap-6 mb-12 items-stretch">
                {PLANS.map((plan) => {
                    const isSelected = selectedPlan.id === plan.id;
                    const Icon = plan.icon;

                    return (
                        <div
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan)}
                            className={`relative rounded-3xl border-2 transition-all p-6 cursor-pointer flex flex-col
                                ${isSelected 
                                    ? 'border-brand-primary bg-brand-card shadow-[0_0_30px_rgba(168,85,247,0.15)] transform scale-[1.02] z-10' 
                                    : 'border-white/5 bg-brand-card/50 hover:bg-brand-card hover:border-white/10 opacity-80 hover:opacity-100'}
                            `}
                        >
                            {/* Recommended Badge */}
                            {plan.recommended && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="bg-brand-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg">
                                        <Star size={10} fill="currentColor" /> Empfohlen
                                    </span>
                                </div>
                            )}

                            {/* Header */}
                            <div className="mb-6 text-center">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                                    <Icon size={28} className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                                <div className="flex justify-center items-baseline gap-1">
                                    <span className="text-3xl font-bold">{plan.price}</span>
                                    <span className="text-sm text-gray-500">/ Mon</span>
                                </div>
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-8 flex-1">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm">
                                        <div className={`mt-0.5 p-0.5 rounded-full ${isSelected ? 'bg-brand-primary/20 text-brand-primary' : 'bg-white/10 text-gray-500'}`}>
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        <span className={isSelected ? 'text-gray-200' : 'text-gray-400'}>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Selection Indicator */}
                            <div className={`w-full py-3 rounded-xl text-center text-sm font-bold transition-all
                                ${isSelected ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/50' : 'bg-black/20 text-gray-500 border border-white/5'}
                            `}>
                                {isSelected ? 'Ausgewählt' : 'Auswählen'}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Primary CTA (Sticky Bottom on Mobile or just centered) */}
            <div className="fixed bottom-6 left-0 right-0 px-4 md:static md:px-0 md:mt-12 flex justify-center z-50 pointer-events-none md:pointer-events-auto">
                <div className="bg-brand-card/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl md:shadow-none md:bg-transparent md:border-none md:p-0 pointer-events-auto max-w-md w-full md:max-w-none md:w-auto">
                    <Button
                        size="lg"
                        variant="primary"
                        onClick={() => setShowPaymentModal(true)}
                        className="w-full md:w-auto md:px-24 py-5 text-lg font-bold shadow-xl shadow-purple-900/40 hover:scale-105 transition-transform"
                    >
                        Jetzt upgraden auf {selectedPlan.name}
                    </Button>
                    <p className="text-xs text-center text-gray-500 mt-3 md:text-gray-400">
                        Sichere Zahlung via Stripe. Jederzeit kündbar.
                    </p>
                </div>
            </div>

            {/* Payment Modal */}
            {selectedPlan && (
                <PaymentModal
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    selectedPlan={selectedPlan}
                    onConfirm={handleConfirmPayment}
                    // plan={selectedPlan} // Ensure prop name matches (selectedPlan vs plan)
                />
            )}
        </div>
    );
};
