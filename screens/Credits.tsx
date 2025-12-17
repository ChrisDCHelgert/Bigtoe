// screens/Credits.tsx
// Profile Dashboard - 2-column card-based layout

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, History, Settings, Globe, Shield, Trash2, CreditCard, TrendingUp } from 'lucide-react';
import { Button } from '../components/Button';
import { UserProfile } from '../types';

interface CreditsProps {
    user: UserProfile;
}

export const Credits: React.FC<CreditsProps> = ({ user }) => {
    const navigate = useNavigate();
    const [language, setLanguage] = useState('de');
    const [trackingConsent, setTrackingConsent] = useState(true);

    const handleBuyCredits = (amount: number) => {
        navigate('/premium');
    };

    const handleDeleteAccount = () => {
        if (confirm('Möchten Sie Ihren Account wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
            alert('Account-Löschung wird verarbeitet (Demo)');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Profil & Einstellungen</h1>
                <p className="text-gray-400">Verwalten Sie Ihren Account, Credits und Präferenzen</p>
            </div>

            {/* 2-Column Dashboard Layout */}
            <div className="grid lg:grid-cols-[1fr_400px] gap-6">

                {/* LEFT COLUMN - Account Overview */}
                <div className="space-y-6">

                    {/* Account Overview Card */}
                    <div className="bg-brand-card rounded-xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Zap size={18} className="text-brand-primary" /> Account-Übersicht
                            </h2>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.isPremium ? 'bg-brand-primary text-white' : 'bg-white/10 text-gray-400'}`}>
                                {user.isPremium ? 'PREMIUM' : 'FREE'}
                            </span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {/* Credits */}
                            <div className="bg-brand-bg rounded-lg p-4 border border-white/10">
                                <div className="text-xs text-gray-400 uppercase mb-1">Verfügbare Credits</div>
                                <div className="text-3xl font-bold text-brand-primary">{user.isPremium ? '∞' : user.credits}</div>
                            </div>

                            {/* Plan */}
                            <div className="bg-brand-bg rounded-lg p-4 border border-white/10">
                                <div className="text-xs text-gray-400 uppercase mb-1">Aktueller Plan</div>
                                <div className="text-2xl font-bold">{user.plan || 'Free Trial'}</div>
                            </div>

                            {/* Trial Status */}
                            {!user.isPremium && (
                                <>
                                    <div className="bg-brand-bg rounded-lg p-4 border border-white/10">
                                        <div className="text-xs text-gray-400 uppercase mb-1">Trial genutzt</div>
                                        <div className="text-2xl font-bold">{user.freeTrialUsed}/{user.freeTrialTotal}</div>
                                    </div>

                                    <div className="bg-brand-bg rounded-lg p-4 border border-white/10">
                                        <div className="text-xs text-gray-400 uppercase mb-1">Verbleibend</div>
                                        <div className="text-2xl font-bold text-green-400">{user.freeTrialTotal - user.freeTrialUsed}</div>
                                    </div>
                                </>
                            )}
                        </div>

                        {!user.isPremium && (
                            <Button
                                variant="primary"
                                fullWidth
                                onClick={() => navigate('/premium')}
                                className="mt-6 shadow-lg shadow-purple-900/40"
                            >
                                <TrendingUp size={16} /> Premium upgraden
                            </Button>
                        )}
                    </div>

                    {/* Usage History */}
                    <div className="bg-brand-card rounded-xl p-6 border border-white/10">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                            <History size={18} className="text-brand-primary" /> Nutzungsverlauf
                        </h2>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-brand-bg rounded-lg border border-white/10">
                                <div>
                                    <div className="font-semibold text-sm">Bildgenerierung</div>
                                    <div className="text-xs text-gray-400">Heute, 14:32</div>
                                </div>
                                <div className="text-sm font-mono text-brand-primary">-2 Credits</div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-brand-bg rounded-lg border border-white/10">
                                <div>
                                    <div className="font-semibold text-sm">Bildgenerierung (HD)</div>
                                    <div className="text-xs text-gray-400">Gestern, 09:15</div>
                                </div>
                                <div className="text-sm font-mono text-brand-primary">-4 Credits</div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-brand-bg rounded-lg border border-white/10">
                                <div>
                                    <div className="font-semibold text-sm">Credits gekauft</div>
                                    <div className="text-xs text-gray-400">20. Dez, 11:20</div>
                                </div>
                                <div className="text-sm font-mono text-green-400">+50 Credits</div>
                            </div>
                        </div>

                        <button className="text-sm text-brand-primary hover:text-white mt-4 transition-colors">
                            Vollständige Historie anzeigen →
                        </button>
                    </div>
                </div>

                {/* RIGHT COLUMN - Settings & Packages */}
                <div className="space-y-6">

                    {/* Credit Packages */}
                    <div className="bg-brand-card rounded-xl p-6 border border-white/10">
                        <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                            <CreditCard size={18} className="text-brand-primary" /> Credits kaufen
                        </h3>

                        <div className="space-y-3">
                            <button
                                onClick={() => handleBuyCredits(50)}
                                className="w-full p-4 bg-brand-bg rounded-lg border border-white/10 hover:border-brand-primary/50 transition-colors text-left"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-bold">50 Credits</div>
                                        <div className="text-xs text-gray-400">~25 Generierungen</div>
                                    </div>
                                    <div className="text-lg font-bold text-brand-primary">€9.99</div>
                                </div>
                            </button>

                            <button
                                onClick={() => handleBuyCredits(200)}
                                className="w-full p-4 bg-brand-bg rounded-lg border-2 border-brand-primary/50 hover:border-brand-primary transition-colors text-left relative"
                            >
                                <div className="absolute -top-2 right-4 bg-brand-primary text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                    Beliebt
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-bold">200 Credits</div>
                                        <div className="text-xs text-gray-400">~100 Generierungen</div>
                                    </div>
                                    <div className="text-lg font-bold text-brand-primary">€19.99</div>
                                </div>
                            </button>

                            <button
                                onClick={() => navigate('/premium')}
                                className="w-full p-4 bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-colors text-left"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-bold">Premium</div>
                                        <div className="text-xs text-gray-400">Unbegrenzt generieren</div>
                                    </div>
                                    <div className="text-lg font-bold text-brand-primary">€39.99/mo</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="bg-brand-card rounded-xl p-6 border border-white/10">
                        <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                            <Settings size={18} className="text-brand-primary" /> Einstellungen
                        </h3>

                        {/* Language */}
                        <div className="mb-4">
                            <label className="text-xs font-semibold text-gray-400 uppercase mb-2 block flex items-center gap-1">
                                <Globe size={12} /> Sprache
                            </label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full bg-brand-bg border border-white/10 rounded-lg p-3 text-sm text-white focus:border-brand-primary outline-none"
                            >
                                <option value="de">Deutsch</option>
                                <option value="en">English</option>
                                <option value="fr">Français</option>
                            </select>
                        </div>

                        {/* DSGVO / Tracking */}
                        <div className="mb-4">
                            <label className="text-xs font-semibold text-gray-400 uppercase mb-2 block flex items-center gap-1">
                                <Shield size={12} /> Datenschutz
                            </label>
                            <div className="space-y-2">
                                <label className="flex items-center gap-3 p-3 bg-brand-bg rounded-lg border border-white/10 cursor-pointer hover:border-white/20 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={trackingConsent}
                                        onChange={(e) => setTrackingConsent(e.target.checked)}
                                        className="accent-brand-primary"
                                    />
                                    <div className="text-sm">
                                        <div className="font-semibold">Analytics zulassen</div>
                                        <div className="text-xs text-gray-400">Hilft uns, die App zu verbessern</div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Privacy Links */}
                        <div className="space-y-2 text-sm">
                            <button onClick={() => navigate('/datenschutz')} className="text-brand-primary hover:text-white transition-colors block">
                                → Datenschutzerklärung
                            </button>
                            <button onClick={() => navigate('/agb')} className="text-brand-primary hover:text-white transition-colors block">
                                → AGB
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danger Zone - Subtle, at bottom */}
            <div className="mt-8 p-6 bg-red-900/10 rounded-xl border border-red-500/20">
                <h3 className="text-sm font-bold text-red-400 uppercase mb-2 flex items-center gap-2">
                    <Trash2 size={14} /> Gefahrenzone
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                    Diese Aktion ist unwiderruflich. Alle Ihre Daten, Bilder und Credits werden permanent gelöscht.
                </p>
                <Button
                    variant="secondary"
                    onClick={handleDeleteAccount}
                    className="text-red-400 hover:text-red-300"
                >
                    Account löschen
                </Button>
            </div>
        </div>
    );
};
