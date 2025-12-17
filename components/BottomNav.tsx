// components/BottomNav.tsx
// Mobile-only bottom navigation (hidden on desktop >= md)

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Wand2, Image, CreditCard, User } from 'lucide-react';

const NAV_ITEMS = [
    { path: '/home', label: 'Home', icon: Home },
    { path: '/generator', label: 'Generate', icon: Wand2 },
    { path: '/gallery', label: 'Gallery', icon: Image },
    { path: '/premium', label: 'Plans', icon: CreditCard },
    { path: '/profile', label: 'Profile', icon: User }
];

export const BottomNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-card border-t border-white/10 z-40">
            <div className="flex justify-around">
                {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
                    const isActive = location.pathname === path;
                    return (
                        <button
                            key={path}
                            onClick={() => navigate(path)}
                            className={`flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 transition-colors
                ${isActive ? 'text-brand-primary' : 'text-gray-500'}`}
                        >
                            <Icon size={20} className={isActive ? 'mb-1' : 'mb-1'} />
                            <span className="text-[10px] font-medium">{label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};
