// components/PaymentModal.tsx
// Modal for payment selection after plan selection

import React, { useState, useEffect } from 'react';
import { X, CreditCard, Lock, Check } from 'lucide-react';
import { Button } from './Button';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedPlan: {
        name: string;
        price: string;
        features: string[];
    };
    onConfirm: (paymentMethod: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, selectedPlan, onConfirm }) => {
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'sepa'>('card');
    const [processing, setProcessing] = useState(false);

    // ESC key to close
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !processing) onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose, processing]);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setProcessing(true);
        await onConfirm(paymentMethod);
        setProcessing(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            {/* Modal Container */}
            <div className="bg-brand-card border border-white/10 rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-brand-card z-10">
                    <div>
                        <h2 className="text-xl font-bold">Zahlungsmethode wählen</h2>
                        <p className="text-sm text-gray-400 mt-1">Sichere Bezahlung über Stripe</p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={processing}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Plan Summary */}
                <div className="p-6 bg-brand-primary/5 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-lg">{selectedPlan.name}</h3>
                            <p className="text-sm text-gray-400">Monatliches Abonnement</p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-brand-primary">{selectedPlan.price}</div>
                            <p className="text-xs text-gray-400">pro Monat</p>
                        </div>
                    </div>
                </div>

                {/* Payment Method Selection */}
                <div className="p-6 space-y-4">
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Zahlungsmethode</label>

                    <div className="grid gap-3">
                        {/* Credit Card */}
                        <button
                            onClick={() => setPaymentMethod('card')}
                            disabled={processing}
                            className={`p-4 rounded-xl border transition-colors text-left ${paymentMethod === 'card'
                                    ? 'border-brand-primary bg-brand-primary/10'
                                    : 'border-white/10 hover:border-white/20'
                                } disabled:opacity-50`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CreditCard size={20} className="text-brand-primary" />
                                    <div>
                                        <div className="font-semibold">Kreditkarte</div>
                                        <div className="text-xs text-gray-400">Visa, Mastercard, Amex</div>
                                    </div>
                                </div>
                                {paymentMethod === 'card' && <Check size={20} className="text-brand-primary" />}
                            </div>
                        </button>

                        {/* SEPA */}
                        <button
                            onClick={() => setPaymentMethod('sepa')}
                            disabled={processing}
                            className={`p-4 rounded-xl border transition-colors text-left ${paymentMethod === 'sepa'
                                    ? 'border-brand-primary bg-brand-primary/10'
                                    : 'border-white/10 hover:border-white/20'
                                } disabled:opacity-50`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-brand-primary" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                                    </svg>
                                    <div>
                                        <div className="font-semibold">SEPA-Lastschrift</div>
                                        <div className="text-xs text-gray-400">Bankeinzug (nur EU)</div>
                                    </div>
                                </div>
                                {paymentMethod === 'sepa' && <Check size={20} className="text-brand-primary" />}
                            </div>
                        </button>
                    </div>

                    {/* Trust Signals */}
                    <div className="flex items-center gap-4 mt-6 p-4 bg-white/5 rounded-lg">
                        <Lock size={16} className="text-green-500" />
                        <div className="text-xs text-gray-400">
                            <strong className="text-white">Sichere Zahlung:</strong> Alle Zahlungen werden verschlüsselt über Stripe verarbeitet. Wir speichern keine Zahlungsdaten.
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-white/10 flex gap-3">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={processing}
                        className="flex-1"
                    >
                        Abbrechen
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleConfirm}
                        isLoading={processing}
                        className="flex-1"
                    >
                        Jetzt abonnieren
                    </Button>
                </div>
            </div>

            {/* Click outside to close */}
            <div
                className="absolute inset-0 -z-10"
                onClick={() => !processing && onClose()}
            />
        </div>
    );
};
