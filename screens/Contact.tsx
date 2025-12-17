import React, { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/Button';

export const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        consent: false
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.consent) return;

        setStatus('submitting');

        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', message: '', consent: false });
        }, 1500);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold mb-4">Kontaktieren Sie uns</h1>
                <p className="text-gray-400">
                    Haben Sie Fragen oder benötigen Sie Unterstützung? Wir sind für Sie da.
                </p>
            </div>

            <div className="bg-brand-card rounded-xl p-8 border border-white/10 shadow-xl">
                {status === 'success' ? (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-400 mb-6">
                            <CheckCircle size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Nachricht gesendet!</h3>
                        <p className="text-gray-400 mb-6">
                            Vielen Dank für Ihre Anfrage. Wir werden uns schnellstmöglich bei Ihnen melden.
                        </p>
                        <Button variant="secondary" onClick={() => setStatus('idle')}>
                            Neue Nachricht senden
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-gray-300">Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full bg-brand-bg border border-white/10 rounded-lg p-3 text-white focus:border-brand-primary outline-none transition-colors"
                                    placeholder="Ihr Name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-300">E-Mail</label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full bg-brand-bg border border-white/10 rounded-lg p-3 text-white focus:border-brand-primary outline-none transition-colors"
                                    placeholder="ihre@email.de"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium text-gray-300">Nachricht</label>
                            <textarea
                                id="message"
                                required
                                rows={5}
                                value={formData.message}
                                onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                className="w-full bg-brand-bg border border-white/10 rounded-lg p-3 text-white focus:border-brand-primary outline-none transition-colors resize-none"
                                placeholder="Wie können wir Ihnen helfen?"
                            />
                        </div>

                        <div className="bg-brand-bg/50 p-4 rounded-lg border border-white/5">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    required
                                    checked={formData.consent}
                                    onChange={e => setFormData(prev => ({ ...prev, consent: e.target.checked }))}
                                    className="mt-1 w-4 h-4 rounded border-white/20 bg-brand-bg text-brand-primary focus:ring-brand-primary"
                                />
                                <span className="text-sm text-gray-400">
                                    Ich stimme zu, dass meine Angaben zur Kontaktaufnahme und Zuordnung für eventuelle Rückfragen dauerhaft gespeichert werden.
                                    Hinweis: Diese Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen.
                                    Weitere Infos in der <a href="/datenschutz" className="text-brand-primary hover:underline">Datenschutzerklärung</a>.
                                </span>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            isLoading={status === 'submitting'}
                            disabled={!formData.consent}
                            className="py-3"
                        >
                            <div className="flex items-center gap-2">
                                <Send size={18} />
                                <span>Nachricht senden</span>
                            </div>
                        </Button>
                    </form>
                )}
            </div>

            <div className="mt-12 grid md:grid-cols-2 gap-6 text-sm text-gray-400">
                <div className="bg-brand-card p-6 rounded-xl border border-white/5">
                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                        <Mail size={16} className="text-brand-primary" /> E-Mail Support
                    </h4>
                    <p>support@bigtoe.ai</p>
                    <p className="mt-1">Antwortzeit: i.d.R. innerhalb von 24h</p>
                </div>
                <div className="bg-brand-card p-6 rounded-xl border border-white/5">
                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                        <AlertCircle size={16} className="text-brand-primary" /> Datenschutz
                    </h4>
                    <p>datenschutz@bigtoe.ai</p>
                    <p className="mt-1">Für alle Anfragen bezüglich Ihrer Daten</p>
                </div>
            </div>
        </div>
    );
};
