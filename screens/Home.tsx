import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Clock, FileCheck, ArrowRight, PlayCircle, Lock, Microscope, ChevronRight } from 'lucide-react';
import { Button } from '../components/Button';
import { UserProfile } from '../types';

interface HomeProps {
  user: UserProfile;
}

export const Home: React.FC<HomeProps> = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">

      {/* 1. Hero Section: Medical & Professional Focus */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold uppercase tracking-wider mb-6">
            <Shield size={12} />
            <span>Medizinischer Standard & DSGVO-Konform</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-6 leading-tight">
            Präzise Bilddokumentation <br className="hidden md:block" />
            für die moderne Podologie
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Erstellen Sie photorealistisches Bildmaterial für Dokumentation, Schulung und Patientenaufklärung.
            Ohne Kamera, ohne Compliance-Risiko, in Sekunden.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto px-8 py-4 text-lg shadow-xl shadow-purple-900/40"
              onClick={() => navigate('/generator')}
            >
              <div className="flex items-center gap-2">
                <PlayCircle size={20} />
                <span>Jetzt Bild generieren</span>
              </div>
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto px-8 py-4"
              onClick={() => navigate('/gallery')}
            >
              Galerie ansehen
            </Button>
          </div>

          <p className="mt-6 text-xs text-gray-500 flex items-center justify-center gap-2">
            <Lock size={12} />
            <span>Keine echten Patientendaten erforderlich · 100% Anonym</span>
          </p>
        </div>
      </section>


      {/* 2. Problem / Solution Grid */}
      <section className="bg-brand-card/30 border-y border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">

            {/* Feature 1 */}
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto bg-brand-card border border-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:border-brand-primary/50 transition-colors">
                <Clock size={32} className="text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Zeitersparnis</h3>
              <p className="text-gray-400 leading-relaxed">
                Statt aufwendiger Fotoshootings oder Suche nach Stock-Material:
                Beschreiben Sie den Befund, erhalten Sie das Bild.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto bg-brand-card border border-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:border-brand-primary/50 transition-colors">
                <Shield size={32} className="text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Rechtssicherheit</h3>
              <p className="text-gray-400 leading-relaxed">
                Vermeiden Sie DSGVO-Probleme durch die Nutzung von KI-generierten,
                synthetischen Bilddaten ohne Personenbezug.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto bg-brand-card border border-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:border-brand-primary/50 transition-colors">
                <Microscope size={32} className="text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Medizinische Details</h3>
              <p className="text-gray-400 leading-relaxed">
                Spezifische Krankheitsbilder (Hallux Valgus, Fehlstellungen)
                können präzise konfiguriert und visualisiert werden.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* 3. How it Works (Process) */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">In 3 Schritten zum Ergebnis</h2>
            <p className="text-gray-400">Intuitiver Workflow, optimiert für den Praxisalltag.</p>
          </div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2" />

            <div className="grid md:grid-cols-3 gap-8 relative z-10">

              {/* Step 1 */}
              <div className="bg-brand-bg border border-white/10 rounded-xl p-8 hover:border-brand-primary/50 transition-colors">
                <div className="text-5xl font-bold text-white/5 mb-4">01</div>
                <h3 className="text-xl font-bold mb-2">Konfigurieren</h3>
                <p className="text-sm text-gray-400">
                  Wählen Sie Parameter wie Fußform, Hauttyp (Fitzpatrick I-VI), Lichtverhältnisse und spezifische Merkmale.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-brand-bg border border-white/10 rounded-xl p-8 hover:border-brand-primary/50 transition-colors">
                <div className="text-5xl font-bold text-white/5 mb-4">02</div>
                <h3 className="text-xl font-bold mb-2">Generieren</h3>
                <p className="text-sm text-gray-400">
                  Unsere medizinisch trainierte KI erstellt in wenigen Sekunden eine hochauflösende, photorealistische Darstellung.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-brand-bg border border-white/10 rounded-xl p-8 hover:border-brand-primary/50 transition-colors">
                <div className="text-5xl font-bold text-white/5 mb-4">03</div>
                <h3 className="text-xl font-bold mb-2">Nutzen</h3>
                <p className="text-sm text-gray-400">
                  Laden Sie das Bild herunter, speichern Sie es in Ihrer sicheren Galerie oder nutzen Sie es direkt für Ihre Dokumentation.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>


      {/* 4. Call to Action (Profile/Status) */}
      <section className="bg-gradient-to-r from-brand-card to-brand-bg border-y border-white/5 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {!user.isPremium ? (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Starten Sie jetzt durch</h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                Sie nutzen aktuell die kostenlose Testversion. Upgraden Sie auf Premium für unbegrenzte Generierungen,
                4K-Qualität und Prioritäts-Support.
              </p>
              <div className="flex justify-center gap-4">
                <Button onClick={() => navigate('/premium')} variant="primary" className="px-8 py-3">
                  Premium entdecken
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Status: {user.freeTrialUsed} / {user.freeTrialTotal} Test-Bilder verbraucht
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-brand-primary">Premium Aktiviert</h2>
              <p className="text-gray-300">
                Sie haben vollen Zugriff auf alle Funktionen.
              </p>
              <Button onClick={() => navigate('/generator')} variant="primary" className="px-8 py-3">
                Zum Generator
              </Button>
            </div>
          )}

        </div>
      </section>

    </div>
  );
};
