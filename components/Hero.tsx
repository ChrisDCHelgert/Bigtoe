// components/Hero.tsx
// Hero section for homepage with value proposition and CTA

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, Zap, Shield } from 'lucide-react';
import { Button } from './Button';

export const Hero: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-bg via-brand-card to-brand-bg border-b border-white/10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">

                {/* Main content */}
                <div className="text-center max-w-3xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 rounded-full px-4 py-1.5 mb-6">
                        <Shield size={14} className="text-brand-primary" />
                        <span className="text-xs font-semibold text-brand-primary">DSGVO-konform · Medical-grade AI</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                        Professionelle AI-Bildgenerierung
                        <span className="block text-brand-primary mt-2">für Podologie & Fußgesundheit</span>
                    </h1>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                        Erstellen Sie hochwertige, medizinisch präzise Fußbilder für Dokumentation,
                        Therapieplanung und Patientenkommunikation – sicher, schnell und DSGVO-konform.
                    </p>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                            variant="primary"
                            onClick={() => navigate('/generator')}
                            className="text-lg py-4 px-8 shadow-xl shadow-purple-900/40"
                        >
                            <div className="flex items-center gap-2">
                                <Wand2 size={20} />
                                <span>Jetzt Bild generieren</span>
                            </div>
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => navigate('/premium')}
                            className="text-lg py-4 px-8"
                        >
                            Preise ansehen
                        </Button>
                    </div>

                    {/* Trust signals */}
                    <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <Zap size={14} className="text-green-500" />
                            <span>5 kostenlose Bilder im Trial</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Shield size={14} className="text-green-500" />
                            <span>Ende-zu-Ende verschlüsselt</span>
                        </div>
                    </div>
                </div>

                {/* 3-step process */}
                <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <div className="bg-brand-card rounded-xl p-6 border border-white/5 text-center">
                        <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-brand-primary">1</span>
                        </div>
                        <h3 className="font-semibold mb-2">Konfigurieren</h3>
                        <p className="text-sm text-gray-400">
                            Wählen Sie Größe, Hautton, Perspektive und medizinische Details
                        </p>
                    </div>

                    <div className="bg-brand-card rounded-xl p-6 border border-white/5 text-center">
                        <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-brand-primary">2</span>
                        </div>
                        <h3 className="font-semibold mb-2">Generieren</h3>
                        <p className="text-sm text-gray-400">
                            KI erstellt Ihr individuelles Bild in Sekunden
                        </p>
                    </div>

                    <div className="bg-brand-card rounded-xl p-6 border border-white/5 text-center">
                        <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-brand-primary">3</span>
                        </div>
                        <h3 className="font-semibold mb-2">Nutzen</h3>
                        <p className="text-sm text-gray-400">
                            Downloaden, speichern oder direkt in Ihrer Dokumentation verwenden
                        </p>
                    </div>
                </div>
            </div>

            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -z-10" />
        </section>
    );
};
