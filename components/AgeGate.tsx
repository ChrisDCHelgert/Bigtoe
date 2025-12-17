import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export const AgeGate: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasConsent = localStorage.getItem('bigtoe_age_verified');
        if (!hasConsent) {
            setIsVisible(true);
        }
    }, []);

    const handleConfirm = () => {
        localStorage.setItem('bigtoe_age_verified', 'true');
        setIsVisible(false);
    };

    const handleExit = () => {
        window.location.href = 'https://www.google.com';
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-brand-card border border-white/10 rounded-2xl p-8 text-center shadow-2xl shadow-red-900/20">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 border border-red-500/20">
                    <Shield size={32} />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Age Verification Required</h2>
                <p className="text-gray-400 text-sm mb-6">
                    This website contains adult-oriented content (fetish imagery) and is restricted to adults aged 18 and over. All content is AI-generated fiction.
                </p>

                <div className="bg-white/5 border border-white/5 rounded-lg p-4 mb-8 text-xs text-left text-gray-400 flex gap-3">
                    <AlertTriangle size={24} className="text-yellow-500 flex-shrink-0" />
                    <p>
                        By entering, you confirm that you are at least 18 years old and consent to viewing sexually suggestive or fetish-oriented fictional content.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        variant="primary"
                        fullWidth
                        size="lg"
                        onClick={handleConfirm}
                        className="py-4 text-base font-bold bg-gradient-to-r from-red-600 to-purple-700 hover:from-red-500 hover:to-purple-600 border-none"
                    >
                        I am 18+ - Enter Site
                    </Button>
                    <Button
                        variant="secondary"
                        fullWidth
                        onClick={handleExit}
                        className="text-gray-500 hover:text-white"
                    >
                        I am under 18 - Exit
                    </Button>
                </div>
            </div>
        </div>
    );
};
