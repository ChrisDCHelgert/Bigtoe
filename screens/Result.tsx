import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, RefreshCw, Star, Trash2, ArrowLeft, Maximize2 } from 'lucide-react';
import { Button } from '../components/Button';

import { UserProfile } from '../types';

interface ResultProps {
  currentImage: string | null;
  onSave: (image: any) => void;
  handleConsumption: (amount: number, type: 'generate' | 'upscale') => void;
  user: UserProfile;
}

export const Result: React.FC<ResultProps> = ({ currentImage, onSave, handleConsumption, user }) => {
  const navigate = useNavigate();

  if (!currentImage) {
    navigate('/generator');
    return null;
  }

  const handleSave = () => {
    const newImage = {
      id: Date.now(),
      url: currentImage,
      tag: 'Saved',
      date: new Date().toISOString(),
      isFavorite: false,
    };
    onSave(newImage);
    navigate('/gallery');
  };

  const handleUpscale = () => {
    if (!user.isPremium && user.credits < 5) {
      // Option: Redirect or Show Error
      // For now, consistent with Generator, redirect to premium
      navigate('/premium');
      return;
    }

    handleConsumption(5, 'upscale');
    // Mock upscale visual feedback or logic here
    alert("Upscaling... (Credits deducted)");
  };

  return (
    <div className="h-screen flex flex-col bg-brand-dark">
      <header className="absolute top-0 w-full p-4 z-10 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={() => navigate('/generator')} className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white">
          <ArrowLeft size={20} />
        </button>
        <div className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-xs font-bold border border-white/10 flex items-center gap-2">
          <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" /> Preview Quality
        </div>
      </header>

      <div className="flex-1 relative group">
        <img src={currentImage} alt="Generated Result" className="w-full h-full object-cover" />
        <button className="absolute bottom-4 right-4 p-3 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-colors">
          <Maximize2 size={20} />
        </button>
      </div>

      <div className="bg-brand-card border-t border-white/10 p-6 space-y-4 rounded-t-3xl -mt-6 relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="text-center space-y-1">
          <h3 className="text-xl font-bold flex items-center justify-center gap-2">
            <Star size={20} className="text-brand-primary" fill="currentColor" /> Love this result?
          </h3>
          <p className="text-sm text-gray-400">Unlock 2048x2048 HD resolution and see every detail.</p>
        </div>

        <Button fullWidth variant="primary" icon={<Download size={18} />} onClick={handleUpscale} className="shadow-lg shadow-purple-900/50">
          Upscale to HD <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded">5 Credits</span>
        </Button>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button variant="secondary" onClick={handleSave} icon={<Download size={16} />}>
            Save
          </Button>
          <Button variant="ghost" className="text-gray-400 hover:text-red-400 hover:bg-red-500/10" icon={<Trash2 size={16} />} onClick={() => navigate('/home')}>
            Discard
          </Button>
        </div>
      </div>
    </div>
  );
};
