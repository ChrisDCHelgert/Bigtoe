import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Shield, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { PLANS } from '../constants';
import { PaymentModal } from '../components/PaymentModal';

interface CheckoutProps {
  onUpgrade?: (planId: string) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ onUpgrade }) => {
  const navigate = useNavigate();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Default to nothing selected, or pre-select 'pro' if desired. 
  // Requirement says: "Allow users to select exactly one plan... Disable CTA until selected"
  // So let's start with nothing selected or null.

  const handlePlanSelect = (id: string) => {
    setSelectedPlanId(id);
  };

  const handleCheckoutStart = () => {
    if (selectedPlanId) {
      setShowModal(true);
    }
  };

  const handlePaymentSuccess = () => {
    setShowModal(false);
    if (selectedPlanId && onUpgrade) {
      onUpgrade(selectedPlanId);
    }
    navigate('/home');
  };

  const selectedPlan = PLANS.find(p => p.id === selectedPlanId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Wählen Sie Ihren Plan</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Professionelle KI-Werkzeuge für Ihre podologische Praxis.
          Jederzeit kündbar. Keine versteckten Kosten.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {PLANS.map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          const isRecommended = plan.id === 'pro';

          return (
            <div
              key={plan.id}
              onClick={() => handlePlanSelect(plan.id)}
              className={`relative rounded-2xl p-8 border cursor-pointer transition-all duration-300 flex flex-col h-full ${isSelected
                  ? 'bg-brand-card border-brand-primary shadow-2xl shadow-purple-900/30 ring-1 ring-brand-primary transform scale-[1.02]'
                  : 'bg-brand-card/50 border-white/10 hover:border-white/20 hover:bg-brand-card'
                }`}
            >
              {isRecommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  EMPFOHLEN
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-xl font-bold mb-2 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-gray-500">/ Monat</span>
                </div>
              </div>

              <div className="flex-grow space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <CheckCircle2
                      size={18}
                      className={`flex-shrink-0 mt-0.5 ${isSelected ? 'text-brand-primary' : 'text-gray-600'}`}
                    />
                    <span className={isSelected ? 'text-gray-200' : 'text-gray-400'}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className={`mt-auto pt-6 border-t ${isSelected ? 'border-white/10' : 'border-white/5'}`}>
                <div className={`w-full py-2 rounded-lg text-center text-sm font-semibold transition-colors ${isSelected
                    ? 'bg-brand-primary text-white'
                    : 'bg-white/5 text-gray-400 group-hover:bg-white/10'
                  }`}>
                  {isSelected ? 'Ausgewählt' : 'Auswählen'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="max-w-md mx-auto text-center space-y-6">
        <Button
          fullWidth
          variant="primary"
          size="lg"
          onClick={handleCheckoutStart}
          disabled={!selectedPlanId}
          className={`py-4 text-lg shadow-xl transition-all ${!selectedPlanId ? 'opacity-50 cursor-not-allowed' : 'shadow-purple-900/40 hover:scale-[1.02]'
            }`}
        >
          {selectedPlanId ? 'Jetzt sicher bezahlen' : 'Bitte wählen Sie einen Plan'}
        </Button>

        <div className="flex justify-center items-center gap-2 text-xs text-gray-500">
          <Shield size={12} />
          <span>Sichere 256-bit SSL Verschlüsselung · Jederzeit kündbar</span>
        </div>
      </div>

      {/* Modal */}
      <PaymentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handlePaymentSuccess}
        plan={selectedPlan || null}
      />
    </div>
  );
};
