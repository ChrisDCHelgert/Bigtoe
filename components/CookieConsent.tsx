import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { Button } from './Button';
import { useCookie } from '../contexts/CookieContext';

export const CookieConsent: React.FC = () => {
    const { settings, updateSettings } = useCookie();
    // Use settings (which has 'essential' etc) instead of 'consent'
    const consent = settings;
    const updateConsent = updateSettings;
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show if no consent decision has been made yet
        if (consent.necessary === false && consent.analytics === false && consent.marketing === false) {
            // Logic check: usually 'necessary' is true by default or undefined if not set. 
            // Simplest: check if 'bigtoe_consent' exists in localStorage
            const saved = localStorage.getItem('bigtoe_consent');
            if (!saved) setIsVisible(true);
        }
    }, [consent]);

    const handleAcceptAll = () => {
        updateConsent({ necessary: true, analytics: true, marketing: true });
        setIsVisible(false);
    };

    const handleNecessaryOnly = () => {
        updateConsent({ necessary: true, analytics: false, marketing: false });
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[9000] bg-brand-card border-t border-white/10 p-4 md:p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6">

                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 text-brand-primary font-bold">
                        <Shield size={18} />
                        <h3>Privatsphäre-Einstellungen</h3>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        Wir nutzen Cookies, um die Website funktionsfähig zu machen (Notwendig) und um zu verstehen, wie sie genutzt wird (Analytics).
                        Da wir keine echten Personen abbilden, ist Privatsphäre unser höchstes Gut.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleNecessaryOnly}
                        className="whitespace-nowrap"
                    >
                        Nur Notwendige
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleAcceptAll}
                        className="whitespace-nowrap shadow-lg shadow-purple-900/20"
                    >
                        Alle akzeptieren
                    </Button>
                </div>
            </div>
        </div>
    );
};
