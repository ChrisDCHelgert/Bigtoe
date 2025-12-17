
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, PlayCircle, Layers, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { UserProfile } from '../types';
import { TRANSLATIONS, Language } from '../i18n/translations';
import { ImageCarousel } from '../components/ImageCarousel';

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
      <section className="relative px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto w-full text-center">

        {/* Privacy Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-semibold uppercase tracking-wider mb-4">
          <Lock size={10} />
          <span>{t.privacyBadge}</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight tracking-tight">
          {t.headline}
        </h1>

        {/* Subline */}
        <p className="text-sm md:text-base text-gray-400 max-w-3xl mx-auto mb-6 leading-relaxed">
          {t.subheadline}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto px-12 py-5 text-xl shadow-2xl shadow-purple-900/50 hover:shadow-purple-700/60 transform hover:scale-105 transition-all duration-300"
            onClick={() => navigate('/generator')}
          >
            <div className="flex items-center gap-3">
              <Sparkles size={24} className="animate-pulse" />
              <span>{t.ctaPrimary}</span>
            </div>
          </Button>
        </div>

        {/* Visual Carousel */}
        <div className="mb-16 -mx-4 md:-mx-0">
          <ImageCarousel />
        </div>

        {/* Compact Value Props - Horizontal Grid */}
        <div className="grid md:grid-cols-3 gap-6 text-left border-t border-white/10 pt-10 px-4 md:px-0">
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
