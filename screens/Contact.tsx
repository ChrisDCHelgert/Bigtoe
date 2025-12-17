import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/Button';

export const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        consent: false
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.consent) {
            alert("Bitte stimmen Sie der Datenschutzerklärung zu.");
            return;
        }

        setStatus('submitting');
        // Simulate API call
        await new Promise(r => setTimeout(r, 1500));
        setStatus('success');
    };

    if (status === 'success') {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6 border border-green-500/20">
                    <CheckCircle2 size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Nachricht gesendet!</h2>
                <p className="text-gray-400 mb-8 max-w-md">
                    Vielen Dank für Ihre Nachricht. Wir werden uns schnellstmöglich bei Ihnen melden.
                </p>
                <Button onClick={() => setStatus('idle')} variant="secondary">
                    Zurück zum Formular
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
                    <Mail className="text-brand-primary" /> Kontakt
                </h1>
                <p className="text-gray-400">
                    Haben Sie Fragen oder Feedback? Schreiben Sie uns.
                </p>
            </div>

            <div className="bg-brand-card p-6 md:p-8 rounded-2xl border border-white/5 shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all"
                            placeholder="Ihr Name"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">E-Mail</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all"
                            placeholder="ihre@email.com"
                        />
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Nachricht</label>
                        <textarea
                            required
                            rows={5}
                            value={formData.message}
                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all resize-none"
                            placeholder="Wie können wir helfen?"
                        />
                    </div>

                    {/* Consent */}
                    <div className="flex items-start gap-3 p-4 bg-black/20 rounded-xl border border-white/5">
                        <input
                            type="checkbox"
                            id="consent"
                            checked={formData.consent}
                            onChange={e => setFormData({ ...formData, consent: e.target.checked })}
                            className="mt-1 w-4 h-4 rounded border-white/20 bg-black/40 text-brand-primary"
                        />
                        <label htmlFor="consent" className="text-xs text-gray-400 cursor-pointer select-none">
                            Ich stimme zu, dass meine Angaben zur Kontaktaufnahme und Zuordnung für eventuelle Rückfragen dauerhaft gespeichert werden.
                            Hinweis: Diese Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen.
                            Weitere Informationen finden Sie in der <a href="#/datenschutz" className="text-brand-primary hover:underline">Datenschutzerklärung</a>.
                        </label>
                    </div>

                    <Button
                        fullWidth
                        variant="primary"
                        size="lg"
                        disabled={status === 'submitting'}
                        className="py-4 shadow-lg shadow-purple-900/20"
                    >
                        {status === 'submitting' ? 'Wird gesendet...' : 'Nachricht absenden'}
                        <Send size={18} className="ml-2" />
                    </Button>
                </form>
            </div>
        </div>
    );
};
