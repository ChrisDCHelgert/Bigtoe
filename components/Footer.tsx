// components/Footer.tsx
// Global footer with DSGVO compliance and legal links

import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-brand-card border-t border-white/10 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid md:grid-cols-3 gap-8">

                    {/* Column 1: Product */}
                    <div>
                        <h3 className="text-brand-primary font-bold text-lg mb-4">BigToe AI</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Professional medical-grade AI image generation for podiatry and foot healthcare.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Shield size={14} className="text-green-500" />
                            <span>DSGVO-compliant · Medical-grade security</span>
                        </div>
                    </div>

                    {/* Column 2: Legal */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4">Rechtliches</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/impressum" className="text-gray-400 hover:text-white transition-colors">
                                    Impressum
                                </Link>
                            </li>
                            <li>
                                <Link to="/datenschutz" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                                    <Lock size={12} />
                                    Datenschutzerklärung
                                </Link>
                            </li>
                            <li>
                                <Link to="/agb" className="text-gray-400 hover:text-white transition-colors">
                                    AGB
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/cookie-settings"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Cookie-Einstellungen
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Contact */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4">Kontakt & Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                                    <Mail size={12} />
                                    Kontaktformular
                                </Link>
                            </li>
                            <li>
                                <a href="mailto:support@bigtoe.ai" className="text-gray-400 hover:text-white transition-colors">
                                    support@bigtoe.ai
                                </a>
                            </li>
                        </ul>

                        {/* Trust badges */}
                        <div className="mt-6 flex flex-wrap gap-3">
                            <div className="bg-brand-bg px-3 py-1.5 rounded border border-white/10 text-xs text-gray-400">
                                🇪🇺 EU-hosted
                            </div>
                            <div className="bg-brand-bg px-3 py-1.5 rounded border border-white/10 text-xs text-gray-400">
                                🔒 End-to-end encrypted
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-gray-500">
                    <p>© {new Date().getFullYear()} BigToe AI. Alle Rechte vorbehalten.</p>
                    <p className="mt-1">Made with care for medical professionals · Hosted in Germany</p>
                </div>
            </div>
        </footer>
    );
};
