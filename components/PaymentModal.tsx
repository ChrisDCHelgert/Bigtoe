import React, { useState } from 'react';
import { Shield, Lock, CreditCard, Bitcoin, Wallet, X, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

interface PaymentModalProps {
    plan: {
        id: string;
        name: string;
        price: string;
        features: string[];
    } | null;
    onClose: () => void;
    onConfirm: () => void;
    isOpen: boolean;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ plan, onClose, onConfirm, isOpen }) => {
    const [method, setMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen || !plan) return null;

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate API call
        setTimeout(() => {
            setIsProcessing(false);
            onConfirm();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-brand-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div>
                        <h2 className="text-xl font-bold">Checkout</h2>
                        <p className="text-sm text-gray-400">Secure Payment for {plan.name} Plan</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Plan Summary */}
                    <div className="bg-brand-bg rounded-xl p-4 border border-brand-primary/20 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-white">{plan.name} Membership</h3>
                            <p className="text-xs text-brand-primary">Billed monthly</p>
                        </div>
                        <span className="text-xl font-bold">{plan.price}</span>
                    </div>

                    {/* Payment Methods */}
                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-gray-400 uppercase">Payment Method</label>

                        <div
                            onClick={() => setMethod('card')}
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${method === 'card' ? 'border-brand-primary bg-brand-primary/10' : 'border-white/10 bg-brand-card hover:border-white/20'}`}
                        >
                            <div className="flex items-center gap-3">
                                <CreditCard size={20} className={method === 'card' ? 'text-brand-primary' : 'text-gray-400'} />
                                <span className="font-medium text-sm">Credit Card</span>
                            </div>
                            <div className="flex gap-1 opacity-50">
                                <div className="w-6 h-4 bg-gray-600 rounded"></div>
                                <div className="w-6 h-4 bg-gray-600 rounded"></div>
                            </div>
                        </div>

                        {method === 'card' && (
                            <div className="p-4 bg-black/20 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2 border border-white/5">
                                <input type="text" placeholder="Card Number" className="w-full bg-brand-bg border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-brand-primary transition-colors text-white placeholder-gray-500" />
                                <div className="flex gap-3">
                                    <input type="text" placeholder="MM/YY" className="w-1/2 bg-brand-bg border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-brand-primary transition-colors text-white placeholder-gray-500" />
                                    <input type="text" placeholder="CVC" className="w-1/2 bg-brand-bg border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-brand-primary transition-colors text-white placeholder-gray-500" />
                                </div>
                            </div>
                        )}

                        <div
                            onClick={() => setMethod('paypal')}
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${method === 'paypal' ? 'border-brand-primary bg-brand-primary/10' : 'border-white/10 bg-brand-card hover:border-white/20'}`}
                        >
                            <Wallet size={20} className={method === 'paypal' ? 'text-brand-primary' : 'text-gray-400'} />
                            <span className="font-medium text-sm">PayPal</span>
                        </div>

                        <div
                            onClick={() => setMethod('crypto')}
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${method === 'crypto' ? 'border-brand-primary bg-brand-primary/10' : 'border-white/10 bg-brand-card hover:border-white/20'}`}
                        >
                            <div className="flex items-center gap-3">
                                <Bitcoin size={20} className={method === 'crypto' ? 'text-brand-primary' : 'text-gray-400'} />
                                <span className="font-medium text-sm">Crypto (BTC/ETH)</span>
                            </div>
                            <span className="text-[10px] bg-green-900/50 text-green-400 px-2 py-1 rounded border border-green-700/50">Extra Discrete</span>
                        </div>
                    </div>

                    {/* Trust Banner */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 bg-brand-bg/50 p-3 rounded-lg border border-white/5">
                        <Lock size={12} className="text-green-500" />
                        <span>End-to-end encrypted · SSL Secure · Discrete billing</span>
                    </div>

                    <Button
                        fullWidth
                        variant="primary"
                        onClick={handlePayment}
                        isLoading={isProcessing}
                        className="py-4 text-base shadow-xl shadow-purple-900/20"
                    >
                        {isProcessing ? 'Processing...' : `Pay ${plan.price}`}
                    </Button>
                </div>
            </div>
        </div>
    );
};
