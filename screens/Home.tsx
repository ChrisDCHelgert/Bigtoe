import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Crown, ArrowRight, Star } from 'lucide-react';
import { Button } from '../components/Button';
import { Hero } from '../components/Hero';
import { UserProfile } from '../types';

interface HomeProps {
  user: UserProfile;
}

export const Home: React.FC<HomeProps> = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Desktop: 2-column grid, Mobile: Stack */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="max-w-lg bg-brand-card rounded-2xl p-6 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3">
              <span className={`text-white text-xs px-2 py-1 rounded font-medium ${user.isPremium ? 'bg-brand-primary' : 'bg-white/10'}`}>
                {user.isPremium ? 'PREMIUM' : 'FREE TRIAL'}
              </span>
            </div>

            <div className="flex items-center gap-6 mb-6">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="#374151" strokeWidth="8" fill="none" />
                  {/* If premium, show full circle or infinite symbol logic, for now simple 100% */}
                  <circle cx="48" cy="48" r="40" stroke="#a855f7" strokeWidth="8" fill="none" strokeDasharray="251.2"
                    strokeDashoffset={user.isPremium ? 0 : 251.2 * (1 - (user.freeTrialUsed / user.freeTrialTotal))}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  {user.isPremium ? (
                    <span className="text-2xl font-bold">∞</span>
                  ) : (
                    <span className="text-2xl font-bold">{user.freeTrialUsed}/{user.freeTrialTotal}</span>
                  )}
                </div>
              </div>
              <div>
                {user.isPremium ? (
                  <>
                    <h3 className="text-xl font-bold mb-1">Unbegrenzt</h3>
                    <p className="text-gray-400 text-sm">Du hast vollen Zugriff.</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold mb-1">
                      {user.freeTrialUsed >= user.freeTrialTotal ? 'Keine Bilder mehr' : `Noch ${user.freeTrialTotal - user.freeTrialUsed} Bild`}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {user.freeTrialUsed >= user.freeTrialTotal ? 'Upgrade für mehr.' : `Du hast ${user.freeTrialUsed} von ${user.freeTrialTotal} kostenlosen Bildern verbraucht.`}
                    </p>
                  </>
                )}
              </div>
            </div>

            {(!user.isPremium && user.freeTrialUsed >= user.freeTrialTotal) ? (
              <Button fullWidth onClick={() => navigate('/premium')} variant="primary" className="shadow-lg shadow-purple-900/40">
                Jetzt Unlimited freischalten
              </Button>
            ) : (
              <Button fullWidth onClick={() => navigate('/generator')} className="shadow-lg shadow-purple-900/40" variant="primary">
                Nächstes Bild generieren
              </Button>
            )}

            {!user.isPremium && user.freeTrialUsed < user.freeTrialTotal && (
              <p className="text-center text-xs text-gray-500 mt-3">Lädt in ca. 15 Sekunden</p>
            )}
          </div>

          {/* Gallery Teaser */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-lg font-semibold">Deine Galerie</h3>
              <button onClick={() => navigate('/gallery')} className="text-brand-primary text-sm hover:underline">Alle anzeigen</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="aspect-[4/5] bg-gray-800 rounded-xl relative overflow-hidden group">
                <img src="https://picsum.photos/400/500?random=1" alt="Creation" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute bottom-0 left-0 p-3 w-full bg-gradient-to-t from-black/80 to-transparent">
                  <span className="text-xs font-medium text-white">Vor 10 Min.</span>
                </div>
              </div>
              <div className="aspect-[4/5] bg-gray-800 rounded-xl relative overflow-hidden group">
                <img src="https://picsum.photos/400/500?random=2" alt="Creation" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute bottom-0 left-0 p-3 w-full bg-gradient-to-t from-black/80 to-transparent">
                  <span className="text-xs font-medium text-white">Gestern</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Banner */}
        <div
          className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 rounded-xl p-4 border border-purple-500/20 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => navigate('/premium')}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-brand-primary">
              <Crown size={20} />
            </div>
            <div>
              <h4 className="font-bold text-sm">BigToe Premium</h4>
              <p className="text-xs text-gray-400">Unlimitiert generieren & 4K Download.</p>
            </div>
          </div>
          <button className="bg-white text-brand-dark px-3 py-1.5 rounded-lg text-xs font-bold">
            Upgrade
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-gray-600 pb-4">
          <Lock size={12} />
          <span className="text-[10px] uppercase tracking-wider">100% KI-generiert. Keine echten Personen.</span>
        </div>
      </div>
      );
};
