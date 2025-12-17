// screens/Generator.tsx
// Fetish/Creator UX - Refined 3-Column Layout

import React, { useState, useRef, useEffect } from 'react';
import { Settings, Sparkles, Sliders, Wand2, RefreshCw, Info, Check, Eye } from 'lucide-react';
import { Button } from '../components/Button';
import { ImageModal } from '../components/ImageModal';
import { imageService } from '../services/image/ImageService';
import {
  SKIN_TONE_PRESETS,
  VISUAL_DETAIL_GROUPS,
  CAMERA_ANGLES,
  SCENE_OPTIONS,
  LIGHTING_CHIPS,
  FOOT_SIDES,
  STYLE_PRESETS
} from '../constants';
import { UserProfile, GeneratorParams } from '../types';
import { StylePresetSelector } from '../components/StylePresetSelector';
import { Select } from '../components/Select';

interface GeneratorProps {
  user: UserProfile;
  handleConsumption: (amount: number, type: string) => void;
  onGenerate: (imageUrl: string, metadata: any) => void;
}

export const Generator: React.FC<GeneratorProps> = ({ user, handleConsumption, onGenerate }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [params, setParams] = useState({
    quality: 'standard' as 'standard' | 'high' | 'studio',
    gender: 'female',
    side: 'both' as keyof typeof FOOT_SIDES,
    footSize: 38,
    skinTone: SKIN_TONE_PRESETS[1], // Default Type II
    angle: CAMERA_ANGLES[1], // Default Side
    visualDetails: [] as string[],
    scene: SCENE_OPTIONS[0],
    lighting: ''
  });

  const previewRef = useRef<HTMLDivElement>(null);

  const handleStylePreset = (preset: typeof STYLE_PRESETS[0]) => {
    // Find matching objects
    const matchingAngle = CAMERA_ANGLES.find(a => a.value === preset.params.angle) || CAMERA_ANGLES[1];

    setParams(prev => ({
      ...prev,
      scene: preset.params.scene,
      lighting: preset.params.lighting,
      visualDetails: preset.params.visualDetails,
      angle: matchingAngle
    }));
  };

  const toggleDetail = (detail: string) => {
    setParams(prev => {
      const current = prev.visualDetails;
      if (current.includes(detail)) {
        return { ...prev, visualDetails: current.filter(d => d !== detail) };
      } else {
        return { ...prev, visualDetails: [...current, detail] };
      }
    });
  };

  const handleGenerate = async () => {
    if (user.credits < 1) {
      alert("Insufficient credits");
      return;
    }

    setIsGenerating(true);
    setResultImage(null); // Clear previous immediately

    // Scroll to preview on mobile or if needed
    if (previewRef.current && window.innerWidth < 1024) {
      previewRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    try {
      const prompt = `Photorealistic ${params.gender} feet, ${params.side}, ${params.angle.value}, ${params.skinTone.value}. Details: ${params.visualDetails.join(', ')}. Scene: ${params.scene}. Lighting: ${params.lighting || 'balanced'}. 8k resolution, highly detailed skin texture, realistic toes, masterpiece.`;

      const result = await imageService.generateImage({
        prompt: prompt,
        aspectRatio: '16:9',
        enhancePrompt: true
      }, user.plan === 'Pro' || user.plan === 'Creator');

      // Handle billing
      handleConsumption(1, 'generate');

      setResultImage(result.imageUrl);
      onGenerate(result.imageUrl, { ...params, prompt });

    } catch (error) {
      console.error("Generation failed:", error);
      alert("Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const getDetailGroupCount = (groupOptions: string[]) => {
    return params.visualDetails.filter(d => groupOptions.includes(d)).length;
  };

  return (
    <div className="min-h-screen bg-brand-bg text-white pb-20">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">

        {/* Header & Style Presets */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Wand2 className="text-brand-primary" size={24} />
            Studio Generator
          </h1>
          <StylePresetSelector onSelect={handleStylePreset} />
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* COLUMN 1: Basic Settings (3/12) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-brand-card p-5 rounded-xl border border-white/5 shadow-lg">
              <h3 className="text-xs font-bold uppercase text-gray-400 mb-4 flex items-center gap-2">
                <Settings size={14} /> Basic Appearance
              </h3>

              {/* Quality */}
              <div className="mb-6">
                <label className="text-xs text-gray-500 mb-2 block">Quality Strategy</label>
                <div className="flex bg-black/20 p-1 rounded-lg">
                  {['standard', 'high', 'studio'].map((q) => (
                    <button
                      key={q}
                      onClick={() => setParams({ ...params, quality: q as any })}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${params.quality === q ? 'bg-brand-primary text-white shadow' : 'text-gray-400 hover:text-gray-200'
                        }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-brand-primary mt-1 text-right font-mono">Cost: 1 Credit</p>
              </div>

              {/* Model & Size */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Gender</label>
                  <div className="flex items-center justify-between bg-black/20 rounded-lg p-2.5 border border-white/5">
                    <span className="text-sm">Female</span>
                    <button
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="text-[10px] text-brand-primary underline"
                    >
                      {showAdvanced ? 'Hide Advanced' : 'Change'}
                    </button>
                  </div>
                  {showAdvanced && (
                    <Select
                      value={params.gender}
                      onChange={(e) => setParams({ ...params, gender: e.target.value })}
                      options={[
                        { value: 'female', label: 'Female' },
                        { value: 'male', label: 'Male' }
                      ]}
                      className="mt-2"
                    />
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-2 block flex justify-between">
                    <span>Reference Size</span>
                    <span className="text-white">{params.footSize} EU</span>
                  </label>
                  <input
                    type="range"
                    min="35" max="45" step="0.5"
                    value={params.footSize}
                    onChange={(e) => setParams({ ...params, footSize: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
                  />
                </div>
              </div>

              {/* Skin Tone */}
              <div>
                <label className="text-xs text-gray-500 mb-3 block flex items-center gap-2">
                  Skin Tone <Info size={10} />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SKIN_TONE_PRESETS.map((tone) => (
                    <button
                      key={tone.name}
                      onClick={() => setParams({ ...params, skinTone: tone })}
                      className={`
                            px-2 py-2 rounded-lg text-xs font-medium border text-left transition-all relative overflow-hidden
                            ${params.skinTone.name === tone.name
                          ? 'border-brand-primary bg-brand-primary/10 text-white'
                          : 'border-white/5 bg-black/20 text-gray-400 hover:bg-white/5'}
                          `}
                    >
                      <span className="relative z-10">{tone.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Pose & Details (5/12) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-brand-card p-5 rounded-xl border border-white/5 shadow-lg">
              <h3 className="text-xs font-bold uppercase text-gray-400 mb-4 flex items-center gap-2">
                <Sliders size={14} /> Pose & Characteristics
              </h3>

              {/* View & Angle */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Side</label>
                  <Select
                    value={params.side}
                    onChange={(e) => setParams({ ...params, side: e.target.value as any })}
                    options={Object.entries(FOOT_SIDES).map(([key, label]) => ({ value: key, label }))}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Angle</label>
                  <Select
                    value={params.angle.id}
                    onChange={(e) => {
                      const angle = CAMERA_ANGLES.find(a => a.id === e.target.value);
                      if (angle) setParams({ ...params, angle });
                    }}
                    options={CAMERA_ANGLES.map((angle) => ({ value: angle.id, label: angle.label }))}
                  />
                </div>
              </div>

              {/* Quick Angle Presets */}
              <div className="flex gap-2 mb-8">
                {['soles', 'macro', 'full'].map(id => {
                  const angle = CAMERA_ANGLES.find(a => a.id === id);
                  if (!angle) return null;
                  return (
                    <button
                      key={id}
                      onClick={() => setParams({ ...params, angle })}
                      className="px-3 py-1.5 rounded-full text-xs border border-white/10 hover:bg-white/5 text-gray-400 font-medium"
                    >
                      {angle.label}
                    </button>
                  )
                })}
              </div>

              {/* Grouped Visual Details */}
              <div className="space-y-6">
                {/* Shape Group */}
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-3 block border-b border-white/5 pb-2">
                    {VISUAL_DETAIL_GROUPS.shape.label}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {VISUAL_DETAIL_GROUPS.shape.options.map(opt => (
                      <button
                        key={opt}
                        onClick={() => toggleDetail(opt)}
                        className={`px-3 py-1.5 rounded text-xs transition-colors border ${params.visualDetails.includes(opt)
                            ? 'bg-brand-primary/20 border-brand-primary text-white shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                            : 'bg-black/20 border-white/5 text-gray-400 hover:border-white/20'
                          }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Texture Group */}
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-3 block border-b border-white/5 pb-2">
                    {VISUAL_DETAIL_GROUPS.texture.label}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {VISUAL_DETAIL_GROUPS.texture.options.map(opt => (
                      <button
                        key={opt}
                        onClick={() => toggleDetail(opt)}
                        className={`px-3 py-1.5 rounded text-xs transition-colors border ${params.visualDetails.includes(opt)
                            ? 'bg-brand-primary/20 border-brand-primary text-white shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                            : 'bg-black/20 border-white/5 text-gray-400 hover:border-white/20'
                          }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style Group */}
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-3 block border-b border-white/5 pb-2">
                    {VISUAL_DETAIL_GROUPS.style.label}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {VISUAL_DETAIL_GROUPS.style.options.map(opt => (
                      <button
                        key={opt}
                        onClick={() => toggleDetail(opt)}
                        className={`px-3 py-1.5 rounded text-xs transition-colors border ${params.visualDetails.includes(opt)
                            ? 'bg-brand-primary/20 border-brand-primary text-white shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                            : 'bg-black/20 border-white/5 text-gray-400 hover:border-white/20'
                          }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 3: Scene & Preview (4/12) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Scene Settings */}
            <div className="bg-brand-card p-5 rounded-xl border border-white/5 shadow-lg">
              <h3 className="text-xs font-bold uppercase text-gray-400 mb-4 flex items-center gap-2">
                <Sparkles size={14} /> Scene & Lighting
              </h3>

              <div className="mb-4">
                <label className="text-xs text-gray-500 mb-2 block">Environment</label>
                <Select
                  value={params.scene}
                  onChange={(e) => setParams({ ...params, scene: e.target.value })}
                  options={SCENE_OPTIONS.map(s => ({ value: s, label: s }))}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-2 block">Lighting</label>
                <input
                  type="text"
                  value={params.lighting}
                  onChange={(e) => setParams({ ...params, lighting: e.target.value })}
                  placeholder="e.g. Cinematic, Sunset..."
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-xs text-white mb-2 outline-none focus:border-brand-primary"
                />
                <div className="flex flex-wrap gap-1.5">
                  {LIGHTING_CHIPS.map(chip => (
                    <button
                      key={chip}
                      onClick={() => setParams({ ...params, lighting: chip })}
                      className="text-[10px] px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 border border-white/5"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* PREVIEW AREA (Sticky) */}
            <div
              ref={previewRef}
              className="bg-brand-card rounded-xl border border-white/5 shadow-2xl overflow-hidden sticky top-6"
            >
              <div className="p-1 bg-gradient-to-r from-brand-primary via-purple-500 to-pink-500 opacity-20 h-1"></div>

              {/* Result Display */}
              <div className="aspect-[16/9] bg-black/40 relative flex items-center justify-center group">
                {isGenerating ? (
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-sm text-brand-primary font-bold animate-pulse">Rendering masterpiece...</p>
                    <p className="text-xs text-gray-500 mt-2">Putting pixels in place</p>
                  </div>
                ) : resultImage ? (
                  <>
                    <img
                      src={resultImage}
                      alt="Generated Result"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <Button
                        onClick={() => setIsModalOpen(true)}
                        variant="primary"
                        size="sm"
                      >
                        <Eye size={16} className="mr-2" /> View Full
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-primary/50">
                      <Sparkles size={32} />
                    </div>
                    <h3 className="text-white font-bold mb-1">Ready to Create</h3>
                    <p className="text-gray-500 text-xs max-w-[200px] mx-auto">
                      Configure your settings on the left, then click Generate.
                    </p>
                  </div>
                )}
              </div>

              {/* Main Action */}
              <div className="p-4 border-t border-white/5 bg-brand-card">
                <Button
                  fullWidth
                  size="lg"
                  variant="primary"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="shadow-xl shadow-purple-900/40 relative overflow-hidden"
                >
                  {isGenerating ? 'Processing...' : `Generate Image (1 Credit)`}
                  {!isGenerating && <Wand2 size={18} className="ml-2" />}
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Disclaimer & Legal Footer */}
      <div className="mt-12 text-center border-t border-white/5 pt-8 pb-12">
        <p className="text-gray-500 text-xs flex items-center justify-center gap-2 mb-4">
          <Info size={12} />
          This platform generates synthetic/fictional images. No real persons are depicted.
        </p>
        <div className="flex justify-center gap-6 text-[10px] text-gray-600 uppercase tracking-widest">
          <a href="/impressum" className="hover:text-brand-primary">Impressum</a>
          <a href="/privacy" className="hover:text-brand-primary">Datenschutzerklärung</a>
          <a href="/agb" className="hover:text-brand-primary">AGB</a>
          <button className="hover:text-brand-primary">Cookie Settings</button>
        </div>
      </div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={resultImage || ''}
      />
    </div>
  );
};
