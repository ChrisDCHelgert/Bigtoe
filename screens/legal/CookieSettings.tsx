// screens/legal/CookieSettings.tsx
// Cookie Settings and Policy page

import React, { useState } from 'react';
import { Cookie, Check, X } from 'lucide-react';
import { Button } from '../../components/Button';

export const CookieSettings: React.FC = () => {
    const [analytics, setAnalytics] = useState(true);
    const [marketing, setMarketing] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        // TODO: Implement actual cookie consent saving
        console.log('Cookie settings saved:', { analytics, marketing });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <article className="prose prose-invert prose-lg max-w-none">
                <div className="flex items-center gap-3 mb-8">
                    <Cookie size={32} className="text-brand-primary" />
                    <h1 className="text-4xl font-bold mb-0">Cookie-Einstellungen</h1>
                </div>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Was sind Cookies?</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden, wenn Sie
                        eine Website besuchen. Sie helfen uns, die Website zu verbessern und Ihnen ein
                        besseres Nutzererlebnis zu bieten.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Cookie-Kategorien</h2>

                    {/* Essential Cookies */}
                    <div className="bg-brand-card rounded-xl p-6 border border-white/10 mb-4">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Notwendige Cookies</h3>
                                <p className="text-sm text-gray-400">
                                    Diese Cookies sind für die Grundfunktionen der Website erforderlich und
                                    können nicht deaktiviert werden.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <Check size={20} className="text-green-400" />
                                <span className="text-xs font-semibold">Immer aktiv</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-sm font-semibold mb-2">Verwendungszweck:</h4>
                            <ul className="text-sm text-gray-400 space-y-1">
                                <li>• Authentifizierung und Sitzungsverwaltung</li>
                                <li>• Warenkorbfunktionen</li>
                                <li>• Sicherheit und Betrugsprävention</li>
                            </ul>
                        </div>
                    </div>

                    {/* Analytics Cookies */}
                    <div className={`bg-brand-card rounded-xl p-6 border ${analytics ? 'border-brand-primary/50' : 'border-white/10'} mb-4`}>
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold mb-2">Analyse & Statistik</h3>
                                <p className="text-sm text-gray-400 mb-4">
                                    Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren,
                                    und ermöglichen es uns, die Nutzererfahrung zu verbessern.
                                </p>
                            </div>
                            <button
                                onClick={() => setAnalytics(!analytics)}
                                className={`ml-4 relative w-12 h-6 rounded-full transition-colors ${analytics ? 'bg-brand-primary' : 'bg-gray-600'
                                    }`}
                            >
                                <span
                                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${analytics ? 'translate-x-6' : ''
                                        }`}
                                />
                            </button>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-sm font-semibold mb-2">Verwendungszweck:</h4>
                            <ul className="text-sm text-gray-400 space-y-1">
                                <li>• Erfassung von Seitenaufrufen und Verweildauer</li>
                                <li>• Analyse von Nutzerverhalten (Google Analytics)</li>
                                <li>• Verbesserung der Website-Performance</li>
                            </ul>
                        </div>
                    </div>

                    {/* Marketing Cookies */}
                    <div className={`bg-brand-card rounded-xl p-6 border ${marketing ? 'border-brand-primary/50' : 'border-white/10'} mb-4`}>
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold mb-2">Marketing & Personalisierung</h3>
                                <p className="text-sm text-gray-400 mb-4">
                                    Diese Cookies werden verwendet, um Ihnen relevante Werbung und personalisierte
                                    Inhalte anzuzeigen.
                                </p>
                            </div>
                            <button
                                onClick={() => setMarketing(!marketing)}
                                className={`ml-4 relative w-12 h-6 rounded-full transition-colors ${marketing ? 'bg-brand-primary' : 'bg-gray-600'
                                    }`}
                            >
                                <span
                                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${marketing ? 'translate-x-6' : ''
                                        }`}
                                />
                            </button>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-sm font-semibold mb-2">Verwendungszweck:</h4>
                            <ul className="text-sm text-gray-400 space-y-1">
                                <li>• Personalisierte Werbung</li>
                                <li>• Retargeting-Kampagnen</li>
                                <li>• Social Media Integration</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Save Button */}
                <div className="flex gap-4 sticky bottom-8 bg-brand-card p-4 rounded-xl border border-white/10 shadow-xl">
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        fullWidth
                        className="shadow-lg shadow-purple-900/40"
                    >
                        {saved ? (
                            <div className="flex items-center gap-2">
                                <Check size={20} />
                                <span>Einstellungen gespeichert!</span>
                            </div>
                        ) : (
                            'Einstellungen speichern'
                        )}
                    </Button>
                </div>

                <section className="mt-12">
                    <h2 className="text-2xl font-bold mb-4">Weitere Informationen</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Detaillierte Informationen zum Datenschutz und zur Verwendung Ihrer Daten finden Sie
                        in unserer{' '}
                        <a href="/datenschutz" className="text-brand-primary hover:underline">
                            Datenschutzerklärung
                        </a>.
                    </p>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Sie können Ihre Cookie-Einstellungen jederzeit über diese Seite anpassen. Beachten Sie,
                        dass das Deaktivieren bestimmter Cookies die Funktionalität der Website beeinträchtigen kann.
                    </p>
                </section>

                <footer className="mt-12 pt-6 border-t border-white/10 text-sm text-gray-400">
                    <p>
                        Bei Fragen zu Cookies kontaktieren Sie uns:{' '}
                        <a href="mailto:datenschutz@bigtoe.ai" className="text-brand-primary hover:underline">
                            datenschutz@bigtoe.ai
                        </a>
                    </p>
                    <p className="mt-2">Letzte Aktualisierung: {new Date().toLocaleDateString('de-DE')}</p>
                </footer>
            </article>
        </div>
    );
};
