import React, { createContext, useContext, useState, useEffect } from 'react';

interface CookieSettings {
    essential: boolean;
    analytics: boolean;
    marketing: boolean;
}

interface CookieContextType {
    settings: CookieSettings;
    updateSettings: (newSettings: Partial<CookieSettings>) => void;
    saveSettings: () => void;
}

const DEFAULT_SETTINGS: CookieSettings = {
    essential: true,
    analytics: false,
    marketing: false,
};

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export const CookieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<CookieSettings>(DEFAULT_SETTINGS);

    useEffect(() => {
        const saved = localStorage.getItem('bigtoe_cookie_settings');
        if (saved) {
            try {
                setSettings(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse cookie settings', e);
            }
        }
    }, []);

    const updateSettings = (newSettings: Partial<CookieSettings>) => {
        setSettings(prev => ({ ...prev, ...newSettings, essential: true }));
    };

    const saveSettings = () => {
        localStorage.setItem('bigtoe_cookie_settings', JSON.stringify(settings));
        // Trigger window event for analytics scripts to pick up
        window.dispatchEvent(new CustomEvent('cookie-settings-updated', { detail: settings }));
    };

    return (
        <CookieContext.Provider value={{ settings, updateSettings, saveSettings }}>
            {children}
        </CookieContext.Provider>
    );
};

export const useCookie = () => {
    const context = useContext(CookieContext);
    if (!context) throw new Error('useCookie must be used within a CookieProvider');
    return context;
};
