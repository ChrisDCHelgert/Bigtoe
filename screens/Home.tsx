import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Clock, Microscope, PlayCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { UserProfile } from '../types';

interface HomeProps {
  user: UserProfile;
}

export const Home: React.FC<HomeProps> = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center">

      {/* Hero Content */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-10 max-w-5xl mx-auto w-full text-center">

        {/* Compliance Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold uppercase tracking-wider mb-8">
          <Shield size={12} />
          <span>Medizinischer Standard & DSGVO-Konform</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
          Medizinische Bilddokumentation <br />
          <span className="text-gray-400">für Podologie & Fußgesundheit</span>
        </h1>

        {/* Subline */}
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Erstellen Sie präzises, anonymes Bildmaterial für Therapieplanung, Schulungszwecke
          und Patientenaufklärung. Ohne Kamera, ohne Compliance-Risiko.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto px-8 py-3 text-base shadow-lg shadow-purple-900/30"
            onClick={() => navigate('/generator')}
          >
            <div className="flex items-center gap-2">
              <PlayCircle size={18} />
              <span>Bild generieren</span>
            </div>
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto px-8 py-3 text-base border-white/10 hover:bg-white/5"
            onClick={() => navigate('/gallery')}
          >
            Beispiele ansehen
          </Button>
        </div>

        {/* Compact Value Props - Horizontal Grid */}
        <div className="grid md:grid-cols-3 gap-6 text-left border-t border-white/10 pt-10">
          <div className="flex gap-4 items-start p-4 hover:bg-white/5 rounded-xl transition-colors">
            <div className="bg-brand-card p-2 rounded-lg border border-white/10 text-brand-primary">
              <Clock size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm mb-1">Zeitersparnis</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Keine aufwendigen Fotoshootings. Befund beschreiben, Bild erhalten.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start p-4 hover:bg-white/5 rounded-xl transition-colors">
            <div className="bg-brand-card p-2 rounded-lg border border-white/10 text-brand-primary">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm mb-1">Rechtssicherheit</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                100% anonyme, synthetische Daten. Volle DSGVO-Compliance.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start p-4 hover:bg-white/5 rounded-xl transition-colors">
            <div className="bg-brand-card p-2 rounded-lg border border-white/10 text-brand-primary">
              <Microscope size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm mb-1">Medizinische Präzision</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Exakte Darstellung von Pathologien (z.B. Hallux Valgus) für Fachpersonal.
              </p>
            </div>
          </div>
        </div>

        {/* Ultra-Compact Workflow Box */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-400">
          <span className="font-semibold text-white bg-white/10 px-3 py-1 rounded text-xs uppercase">Workflow</span>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center text-xs font-bold">1</span>
            <span>Parameter wählen</span>
          </div>
          <div className="hidden md:block text-white/20">→</div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center text-xs font-bold">2</span>
            <span>KI generiert Bild</span>
          </div>
          <div className="hidden md:block text-white/20">→</div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center text-xs font-bold">3</span>
            <span>Dokumentieren</span>
          </div>
        </div>

      </section>

    </div>
  );
};
