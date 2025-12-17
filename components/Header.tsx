// components/Header.tsx
// Responsive header for desktop-first web layout

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Wand2, Image, CreditCard, User, Zap } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
    user: UserProfile;
}

const NAV_ITEMS = [
    { path: '/home', label: 'Home', icon: Home },
    { path: '/generator', label: 'Generate', icon: Wand2 },
    { path: '/gallery', label: 'Gallery', icon: Image },
    { path: '/premium', label: 'Plans', icon: CreditCard },
    { path: '/profile', label: 'Profile', icon: User }
];

export const Header: React.FC<HeaderProps> = ({ user }) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <header className="bg-brand-card border-b border-white/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Brand */}
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate('/home')}
                            className="text-2xl font-bold flex items-center gap-2 hover:opacity-80 transition-opacity"
                        >
                            <span className="text-brand-primary">BigToe</span>
                            <span className="text-white">AI</span>
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
                            const isActive = location.pathname === path;
                            return (
                                <button
                                    key={path}
                                    onClick={() => navigate(path)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive
                                            ? 'bg-brand-primary text-white'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon size={18} />
                                    <span>{label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Credits */}
                    <div className="flex items-center gap-4">
                        <div className="bg-brand-bg px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                            <Zap size={16} className="text-brand-primary" fill="currentColor" />
                            <span className="font-mono font-bold text-sm">{user.credits}</span>
                        </div>

                        {/* User Badge (Desktop) */}
                        <div className="hidden lg:flex items-center gap-2 bg-brand-bg px-3 py-1.5 rounded-full border border-white/10">
                            <User size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-300">{user.plan}</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
