import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Wand2 } from 'lucide-react';
import { Button } from '../components/Button';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Simple auto-progress for demo effect
    const timer = setTimeout(() => setStep(1), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full flex flex-col justify-between p-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-20%] left-[-20%] w-[300px] h-[300px] bg-purple-600/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[250px] h-[250px] bg-fuchsia-600/20 rounded-full blur-[80px]" />

      <div className="flex justify-end pt-4">
        <button onClick={() => navigate('/home')} className="text-gray-400 text-sm font-medium hover:text-white">
          Überspringen
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center text-center z-10">
        <div className={`transition-all duration-1000 transform ${step === 1 ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
           <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 mb-4 leading-tight">
            Dein Verlangen.<br />
            Deine Fantasie.
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-[280px] mx-auto leading-relaxed">
            Visualisiere deine geheimsten Wünsche. Diskret, fotorealistisch und einzigartig durch modernste KI.
          </p>

          <div className="flex justify-center gap-2 mb-8">
            <div className="w-8 h-1 bg-brand-primary rounded-full" />
            <div className="w-1 h-1 bg-gray-700 rounded-full" />
            <div className="w-1 h-1 bg-gray-700 rounded-full" />
          </div>
        </div>
      </div>

      <div className="z-10 pb-8">
        <Button 
          variant="primary" 
          fullWidth 
          onClick={() => navigate('/home')}
          icon={<Wand2 size={18} />}
        >
          Jetzt Wunschbild starten
        </Button>
        <p className="text-center text-xs text-gray-600 mt-4">
          18+ Only. Durch den Start akzeptierst du die AGB.
        </p>
      </div>
    </div>
  );
};
