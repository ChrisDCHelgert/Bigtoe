import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Shield, Lock, CreditCard, Bitcoin, Wallet } from 'lucide-react';
import { Button } from '../components/Button';
import { PLANS } from '../constants';

interface CheckoutProps {
  onUpgrade?: (planId: string) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ onUpgrade }) => {
  const navigate = useNavigate();
  const [method, setMethod] = useState('card');
  const [selectedPlanId, setSelectedPlanId] = useState('pro');

  const selectedPlan = PLANS.find(p => p.id === selectedPlanId) || PLANS[1];

  const handleSubscribe = () => {
    // Simulate API call
    setTimeout(() => {
      if (onUpgrade) onUpgrade(selectedPlanId);
      navigate('/home');
    }, 1000);
  };

  return (
    <div className="p-6 pt-8 space-y-6">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white">
          Back
        </button>
        <h1 className="text-2xl font-bold">Checkout</h1>
      </header>

      {/* Plan Selection */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {PLANS.map(plan => (
          <div
            key={plan.id}
            onClick={() => setSelectedPlanId(plan.id)}
            className={`min-w-[120px] p-3 rounded-xl border cursor-pointer transition-all ${selectedPlanId === plan.id
              ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-purple-900/40'
              : 'bg-brand-card border-white/10 text-gray-400 opacity-60'
              }`}
          >
            <h3 className="font-bold text-sm">{plan.name}</h3>
            <p className="text-xs">{plan.price}</p>
            {plan.recommended && <div className="mt-1 text-[10px] bg-white/20 px-1 rounded inline-block">POPULAR</div>}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-brand-card rounded-xl p-6 border border-brand-primary/30 relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 right-0 bg-brand-primary px-3 py-1 rounded-bl-xl text-xs font-bold text-white">
          SELECTED
        </div>
        <h2 className="text-xl font-bold mb-1">{selectedPlan.name} Membership</h2>
        <p className="text-3xl font-bold text-white mb-4">{selectedPlan.price} <span className="text-sm font-normal text-gray-400">/ month</span></p>

        <ul className="space-y-3">
          {selectedPlan.features.map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
              <CheckCircle2 size={16} className="text-brand-primary" /> {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Trust */}
      <div className="bg-gray-900/50 rounded-lg p-3 flex items-center gap-3 border border-white/5">
        <div className="p-2 bg-brand-card rounded-full text-brand-primary">
          <Shield size={16} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">Maximum Discretion</h4>
          <p className="text-xs text-gray-500">Billed securely as "BT-Services"</p>
        </div>
        <Lock size={14} className="ml-auto text-green-500" />
      </div>

      {/* Payment Methods */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-gray-400 uppercase">Payment Method</h3>

        <div
          onClick={() => setMethod('card')}
          className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${method === 'card' ? 'border-brand-primary bg-brand-primary/10' : 'border-white/10 bg-brand-card'}`}
        >
          <div className="flex items-center gap-3">
            <CreditCard size={20} />
            <span className="font-medium">Credit Card</span>
          </div>
          <div className="flex gap-1 opacity-50">
            <div className="w-6 h-4 bg-gray-600 rounded"></div>
            <div className="w-6 h-4 bg-gray-600 rounded"></div>
          </div>
        </div>

        {method === 'card' && (
          <div className="p-4 bg-black/20 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2">
            <input type="text" placeholder="Card Number" className="w-full bg-brand-card border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-brand-primary" />
            <div className="flex gap-3">
              <input type="text" placeholder="MM/YY" className="w-1/2 bg-brand-card border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-brand-primary" />
              <input type="text" placeholder="CVC" className="w-1/2 bg-brand-card border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-brand-primary" />
            </div>
          </div>
        )}

        <div
          onClick={() => setMethod('paypal')}
          className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${method === 'paypal' ? 'border-brand-primary bg-brand-primary/10' : 'border-white/10 bg-brand-card'}`}
        >
          <Wallet size={20} />
          <span className="font-medium">PayPal</span>
        </div>

        <div
          onClick={() => setMethod('crypto')}
          className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${method === 'crypto' ? 'border-brand-primary bg-brand-primary/10' : 'border-white/10 bg-brand-card'}`}
        >
          <div className="flex items-center gap-3">
            <Bitcoin size={20} />
            <span className="font-medium">Crypto (BTC/ETH)</span>
          </div>
          <span className="text-[10px] bg-green-900 text-green-400 px-2 py-1 rounded border border-green-700">Extra Discrete</span>
        </div>
      </div>

      <div className="pt-4">
        <Button fullWidth variant="primary" className="py-4 text-lg" onClick={handleSubscribe}>
          Subscribe & Pay securely
        </Button>
        <p className="text-center text-[10px] text-gray-500 mt-4 max-w-xs mx-auto">
          By confirming, you agree to our Terms of Service. Cancel anytime from your account settings.
        </p>
      </div>
    </div>
  );
};
