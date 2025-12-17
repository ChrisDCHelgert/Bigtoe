
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, Lock, Eye, PlayCircle, Layers, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { UserProfile } from '../types';

interface HomeProps {
  user: UserProfile;
}

export const Home: React.FC<HomeProps> = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center">

      {/* Hero Content */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-10 max-w-5xl mx-auto w-full text-center">

        {/* Privacy Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold uppercase tracking-wider mb-8">
          <Lock size={12} />
          <span>Anonymous & Privacy-First</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
          Create Hyper-Realistic <br />
          <span className="text-gray-400">Custom Foot Imagery</span>
        </h1>

        {/* Subline */}
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          The ultimate AI tool for creators, artists, and enthusiasts.
          Generate unique, photorealistic fictional content in seconds.
          Full control over details, angles, and lighting.
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
              <span>Generate Now</span>
            </div>
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto px-10 py-4 text-lg border-white/10 hover:bg-white/5"
            onClick={() => navigate('/gallery')}
          >
            View Gallery
          </Button>
        </div>

        {/* Compact Value Props - Horizontal Grid */}
        <div className="grid md:grid-cols-3 gap-6 text-left border-t border-white/10 pt-10">
          <div className="flex gap-4 items-start p-4 hover:bg-white/5 rounded-xl transition-colors group">
            <div className="bg-brand-card p-2 rounded-lg border border-white/10 text-brand-primary group-hover:border-brand-primary/50 transition-colors">
              <Layers size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm mb-1">Full Control</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Customize soles, arches, toes, poses, and lighting to your exact specifications.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start p-4 hover:bg-white/5 rounded-xl transition-colors group">
            <div className="bg-brand-card p-2 rounded-lg border border-white/10 text-brand-primary group-hover:border-brand-primary/50 transition-colors">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm mb-1">Ultra Realistic</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                State-of-the-art AI generation that rivals studio photography. 4K quality available.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start p-4 hover:bg-white/5 rounded-xl transition-colors group">
            <div className="bg-brand-card p-2 rounded-lg border border-white/10 text-brand-primary group-hover:border-brand-primary/50 transition-colors">
              <Eye size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm mb-1">100% Private</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Generations are private to you. No real persons depicted. Fictional content only.
              </p>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
};
