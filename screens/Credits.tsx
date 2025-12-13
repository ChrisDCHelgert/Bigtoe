import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, CreditCard, Globe, Shield, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { CREDIT_PACKS } from '../constants';
import { Button } from '../components/Button';
import { UserProfile } from '../types';

interface CreditsProps {
    user: UserProfile;
    onUpdateSettings?: (settings: any) => void;
    onDeleteAccount?: () => void;
}

export const Credits: React.FC<CreditsProps> = ({ user, onUpdateSettings, onDeleteAccount }) => {
    const navigate = useNavigate();

    return (
        <div className="p-6 pt-8 space-y-8 pb-20">
            <header className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold">Profile & Settings</h1>
            </header>

            {/* Balance */}
            <div className="bg-gradient-to-br from-brand-card to-purple-900/20 rounded-2xl p-8 text-center border border-white/5">
                <p className="text-gray-400 text-sm mb-2 uppercase tracking-widest">Aktuelles Guthaben</p>
                <div className="text-5xl font-bold text-white flex justify-center items-center gap-3 mb-2">
                    <Zap className="text-brand-primary fill-brand-primary" size={40} /> {user.credits}
                </div>
                <p className="text-xs text-gray-500">Plan: {user.plan} • {user.isPremium ? 'Premium' : 'Free'}</p>
            </div>

            {/* Settings */}
            <div>
                <h3 className="text-lg font-bold mb-4">Einstellungen</h3>
                <div className="bg-brand-card rounded-xl border border-white/10 p-4 space-y-4">
                    {/* Language */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 text-gray-300">
                            <Globe size={18} />
                            <span>Sprache / Language</span>
                        </div>
                        <button
                            onClick={() => onUpdateSettings && onUpdateSettings({ language: user.settings?.language === 'de' ? 'en' : 'de' })}
                            className="bg-black/40 px-3 py-1 rounded-lg text-xs font-mono border border-white/10"
                        >
                            {user.settings?.language === 'de' ? 'DE' : 'EN'}
                        </button>
                    </div>

                    {/* DSGVO */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 text-gray-300">
                            <Shield size={18} />
                            <span>Tracking (DSGVO)</span>
                        </div>
                        <button
                            onClick={() => onUpdateSettings && onUpdateSettings({ trackingEnabled: !user.settings?.trackingEnabled })}
                            className={`text-2xl transition-colors ${user.settings?.trackingEnabled ? 'text-green-500' : 'text-gray-600'}`}
                        >
                            {user.settings?.trackingEnabled ? <ToggleRight /> : <ToggleLeft />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Packs */}
            <div>
                <h3 className="text-lg font-bold mb-4">Credits aufladen</h3>
                <div className="space-y-4">
                    {CREDIT_PACKS.map(pack => (
                        <div key={pack.id} className={`bg-brand-card border ${pack.id === 'enthusiast' ? 'border-brand-primary ring-1 ring-brand-primary' : 'border-white/10'} rounded-xl p-5 flex items-center justify-between relative`}>
                            {pack.save && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-primary text-white text-[10px] font-bold px-3 py-1 rounded-full">
                                    BEST VALUE - {pack.save}
                                </span>
                            )}
                            <div>
                                <h4 className="font-bold text-lg">{pack.name}</h4>
                                <div className="flex items-center gap-1 text-gray-300">
                                    <Zap size={14} className="text-brand-primary" />
                                    <span className="font-bold">{pack.credits}</span> Credits
                                </div>
                            </div>
                            <Button onClick={() => navigate('/checkout')} variant={pack.id === 'enthusiast' ? 'primary' : 'secondary'} className="px-6 py-2 text-sm h-10">
                                {pack.price}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* History */}
            <div>
                <h3 className="text-lg font-bold mb-4">Verlauf</h3>
                <div className="bg-brand-card rounded-xl border border-white/5 divide-y divide-white/5">
                    {[
                        { label: 'Bild generiert', date: 'Heute, 14:32', amount: -5, icon: <Zap size={14} /> },
                        { label: 'Paket Enthusiast', date: 'Heute, 14:30', amount: +500, icon: <CreditCard size={14} /> },
                        { label: 'HD Upscale', date: 'Gestern, 22:15', amount: -5, icon: <Zap size={14} /> },
                    ].map((item, i) => (
                        <div key={i} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${item.amount > 0 ? 'bg-green-500/10 text-green-500' : 'bg-gray-700/50 text-gray-400'}`}>
                                    {item.amount > 0 ? <CreditCard size={16} /> : <Zap size={16} />}
                                </div>
                                <div>
                                    <p className="font-medium text-sm">{item.label}</p>
                                    <p className="text-xs text-gray-500">{item.date}</p>
                                </div>
                            </div>
                            <span className={`font-bold text-sm ${item.amount > 0 ? 'text-green-500' : 'text-white'}`}>
                                {item.amount > 0 ? '+' : ''}{item.amount}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Danger Zone */}
            <div>
                <h3 className="text-lg font-bold mb-4 text-red-500">Danger Zone</h3>
                <Button
                    variant="ghost"
                    fullWidth
                    className="border border-red-500/30 text-red-400 hover:bg-red-500/10"
                    onClick={onDeleteAccount}
                    icon={<Trash2 size={16} />}
                >
                    Account löschen
                </Button>
            </div>

            {/* History Link */}
            {/* Keeping simpler history for now, or can re-add if needed. Prioritizing settings task. */}
        </div>
    );
};
