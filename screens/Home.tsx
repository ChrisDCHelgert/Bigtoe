
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, Lock, Eye, PlayCircle, Layers, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { UserProfile } from '../types';
import { TRANSLATIONS, Language } from '../i18n/translations';

interface HomeProps {
  user: UserProfile;
}

export const Home: React.FC<HomeProps> = ({ user }) => {
  const navigate = useNavigate();
  // Fallback to 'de' if setting is missing, though App.tsx defaults it.
  const currentLang = (user.settings?.language || 'de') as Language;
  const t = TRANSLATIONS[currentLang]?.home || TRANSLATIONS['de'].home;

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center">

      {/* Hero Content */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-10 max-w-5xl mx-auto w-full text-center">

        {/* Privacy Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold uppercase tracking-wider mb-8">
          <Lock size={12} />
          <span>{t.privacyBadge}</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
          {t.headline.split(', ')[0]} <br />
          <span className="text-gray-400">{t.headline.split(', ').slice(1).join(', ')}</span>
        </h1>

        {/* Subline */}
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          {t.subheadline}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto px-10 py-4 text-lg shadow-xl shadow-purple-900/40"
            onClick={() => navigate('/generator')}
          >
            <div className="flex items-center gap-2">
              <PlayCircle size={20} />
              <span>{t.ctaPrimary}</span>
            </div>
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto px-10 py-4 text-lg border-white/10 hover:bg-white/5"
            onClick={() => navigate('/gallery')}
          >
            {t.ctaSecondary}
          </Button>
        </div>

        {/* Compact Value Props - Horizontal Grid */}
        <div className="grid md:grid-cols-3 gap-6 text-left border-t border-white/10 pt-10">
          <div className="flex gap-4 items-start p-4 hover:bg-white/5 rounded-xl transition-colors group">
            <div className="bg-brand-card p-2 rounded-lg border border-white/10 text-brand-primary group-hover:border-brand-primary/50 transition-colors">
              <Layers size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm mb-1">{t.features.control.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {t.features.control.desc}
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start p-4 hover:bg-white/5 rounded-xl transition-colors group">
            <div className="bg-brand-card p-2 rounded-lg border border-white/10 text-brand-primary group-hover:border-brand-primary/50 transition-colors">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm mb-1">{t.features.realistic.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {t.features.realistic.desc}
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start p-4 hover:bg-white/5 rounded-xl transition-colors group">
            <div className="bg-brand-card p-2 rounded-lg border border-white/10 text-brand-primary group-hover:border-brand-primary/50 transition-colors">
              <Eye size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm mb-1">{t.features.private.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {t.features.private.desc}
              </p>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
};
