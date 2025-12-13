import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, Zap, HelpCircle, Save, Sliders, PlayCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { enhancePrompt, generateImage } from '../services/geminiService';
import { PRESETS } from '../constants';
import { UserProfile } from '../types';

interface GeneratorProps {
  user: UserProfile;
  handleConsumption: (amount: number, type: 'generate' | 'upscale') => void;
  onGenerate: (url: string) => void;
}

export const Generator: React.FC<GeneratorProps> = ({ user, handleConsumption, onGenerate }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [enhancing, setEnhancing] = useState(false);

  // Form State
  const [params, setParams] = useState({
    gender: 'Female',
    realism: 'Photo',
    size: 38,
    shape: 'Egyptian',
    scene: 'Indoor'
  });

  const handleEnhance = async () => {
    if (!prompt) return;
    setEnhancing(true);
    const newPrompt = await enhancePrompt(prompt);
    setPrompt(newPrompt);
    setEnhancing(false);
  };

  const handleGenerate = async () => {
    // Check limits
    if (!user.isPremium && user.freeTrialUsed >= user.freeTrialTotal && user.credits < 5) {
      navigate('/premium');
      return;
    }

    setLoading(true);
    handleConsumption(5, 'generate');
    const url = await generateImage(prompt);
    onGenerate(url); // Pass URL up to App state
    setLoading(false);
    navigate('/result');
  };

  return (
    <div className="p-6 pt-10 pb-20 space-y-6">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-brand-primary">BigToe</span> AI
        </h2>
        <div className="bg-brand-card px-3 py-1 rounded-full border border-white/10 flex items-center gap-2 text-sm">
          <Zap size={14} className="text-brand-primary" fill="currentColor" />
          <span className="font-mono font-bold">{user.credits}</span>
        </div>
      </header>

      {/* Creation Canvas Placeholder */}
      <div className="aspect-square rounded-2xl bg-brand-card border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mb-4 text-brand-primary">
          <Wand2 size={32} />
        </div>
        <h3 className="font-bold text-lg mb-2">Ready to create</h3>
        <p className="text-gray-400 text-sm">Configure your model specs below to generate a new masterpiece.</p>
      </div>

      {/* Controls */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
            <Sliders size={14} /> Model Specs
          </h3>
          <button className="text-xs text-brand-primary flex items-center gap-1">
            <Save size={12} /> Save Preset
          </button>
        </div>

        {/* Realism Toggle */}
        <div className="grid grid-cols-2 gap-2 bg-brand-card p-1 rounded-xl">
          {['Anime (Low)', 'Photo (High)'].map(mode => (
            <button
              key={mode}
              onClick={() => setParams({ ...params, realism: mode.split(' ')[0] as any })}
              className={`py-2 rounded-lg text-sm font-medium transition-all ${params.realism === mode.split(' ')[0]
                ? 'bg-brand-primary text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              {mode.includes('Photo') ? <span className="flex justify-center items-center gap-1">📷 {mode}</span> : <span className="flex justify-center items-center gap-1">🖌️ {mode}</span>}
            </button>
          ))}
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase">Gender</label>
          <div className="grid grid-cols-3 gap-2">
            {['Female', 'Male', 'Diverse'].map(g => (
              <button
                key={g}
                onClick={() => setParams({ ...params, gender: g })}
                className={`py-2 rounded-lg text-sm border transition-all ${params.gender === g
                  ? 'border-brand-primary bg-brand-primary/20 text-white'
                  : 'border-white/10 bg-brand-card text-gray-400'
                  }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Size Slider */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <label className="text-xs font-semibold text-gray-400 uppercase">Foot Size (EU)</label>
            <span className="text-brand-primary font-bold">{params.size}</span>
          </div>
          <input
            type="range"
            min="35"
            max="45"
            step="0.5"
            value={params.size}
            onChange={(e) => setParams({ ...params, size: parseFloat(e.target.value) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-primary"
          />
        </div>

        {/* Scene & Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase flex items-center gap-1">
              Skin Tone <div className="w-3 h-3 rounded-full bg-[#f8d9c3] inline-block" />
            </label>
            <div className="flex gap-2">
              {['#f8d9c3', '#e0ac69', '#8d5524', '#3c210d'].map(color => (
                <button key={color} className="w-8 h-8 rounded-full border border-white/20 hover:scale-110 transition-transform" style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase flex items-center gap-1">
              Toe Shape <HelpCircle size={10} />
            </label>
            <select className="w-full bg-brand-card border border-white/10 rounded-lg p-2 text-sm text-white focus:border-brand-primary outline-none">
              <option>Egyptian (Long)</option>
              <option>Greek (Morton's)</option>
              <option>Roman (Square)</option>
            </select>
          </div>
        </div>

        {/* Custom Prompt */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-gray-400 uppercase">Custom Prompt</label>
            <button
              onClick={handleEnhance}
              disabled={enhancing || !prompt}
              className="text-brand-primary text-xs flex items-center gap-1 hover:text-white transition-colors disabled:opacity-50"
            >
              {enhancing ? <span className="animate-spin">✨</span> : <span className="flex items-center gap-1"><Wand2 size={10} /> Enhance</span>}
            </button>
          </div>
          <textarea
            className="w-full h-24 bg-brand-card border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:border-brand-primary outline-none resize-none"
            placeholder="Add specific details (e.g. 'morning light, wet skin, blue nail polish')..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        {/* Submit */}
        <div className="pt-4">
          <Button
            variant="primary"
            fullWidth
            onClick={handleGenerate}
            isLoading={loading}
            className="text-lg py-4 shadow-xl shadow-purple-900/40"
          >
            <div className="flex items-center justify-between w-full px-4">
              <span className="flex items-center gap-2">
                <div className="bg-white text-brand-primary rounded-full p-1">
                  <PlayCircle size={16} fill="currentColor" />
                </div>
                Generate
              </span>
              <span className="text-xs font-normal opacity-80 bg-black/20 px-2 py-1 rounded">
                {user.isPremium ? 'Unlimited' : (user.freeTrialUsed < user.freeTrialTotal ? 'Free Trial' : '5 Credits')}
              </span>
            </div>
          </Button>
          {(!user.isPremium && user.freeTrialUsed >= user.freeTrialTotal && user.credits < 5) && (
            <p className="text-center text-xs text-red-400 mt-2">
              Nicht genügend Credits. <button onClick={() => navigate('/premium')} className="underline">Aufladen</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
