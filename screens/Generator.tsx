// screens/Generator.tsx
// Fetish/Creator UX - Refined 4-Column Studio Layout (DE Version)

import React, { useState, useRef, useEffect } from 'react';
import { Settings, Sparkles, Sliders, Wand2, Info, Check, Eye, Footprints, Camera, Sun, Eraser, MoveHorizontal, MoveVertical, Zap, Layers } from 'lucide-react';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

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
      alert("Nicht genügend Credits");
      return;
    }

    setIsGenerating(true);
    setResultImage(null);
    setGenerationError(null);

    // Scroll to preview on mobile
    if (previewRef.current && window.innerWidth < 1024) {
      previewRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    try {
      const prompt = `Photorealistic ${params.gender} feet, ${FOOT_SIDES[params.side]}, ${params.angle.value}, ${params.skinTone.value}. Details: ${params.visualDetails.join(', ')}. Scene: ${params.scene}. Lighting: ${params.lighting || 'balanced'}. 8k resolution, highly detailed skin texture, realistic toes, masterpiece.`;

      const result = await imageService.generateImage({
        prompt: prompt,
        aspectRatio: '16:9', // Fixed aspect for standard generator
        // Note: params can be passed if imageService supports typed params, otherwise spread manually
        params: {
          ...params,
          quality: params.quality, // Explicitly ensure quality is passed if needed
          visualDetails: params.visualDetails
        }
      }, user.plan === 'Pro' || user.plan === 'Creator');

      // Fix: Use 'url' property from GenerationResult, not 'imageUrl'
      let finalImageUrl = result.url;

      // Handle Base64 if needed (if it comes raw without prefix)
      if (finalImageUrl && !finalImageUrl.startsWith('http') && !finalImageUrl.startsWith('data:')) {
        finalImageUrl = `data:image/png;base64,${finalImageUrl}`;
      }

      if (!finalImageUrl) {
        throw new Error("Kein Bild empfangen.");
      }

      handleConsumption(1, 'generate');
      setResultImage(finalImageUrl);
      onGenerate(finalImageUrl, { ...params, prompt });

    } catch (error: any) {
      console.error("Generation failed:", error);
      setGenerationError(error.message || "Fehler bei der Generierung.");
      // alert intentionally removed in favor of UI error state
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-white pb-20 font-sans">
      <div className="max-w-[1800px] mx-auto px-4 md:px-6 py-6">

        {/* Header & Style Presets */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-3 tracking-tight">
            <Wand2 className="text-brand-primary" size={28} />
            Studio Generator
          </h1>
          <StylePresetSelector onSelect={handleStylePreset} />
        </div>

        {/* 4-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 items-start">

          {/* COLUMN 1: Basic Settings */}
          <div className="flex flex-col gap-6">
            <div className="bg-brand-card p-5 rounded-2xl border border-white/5 shadow-xl hover:border-brand-primary/20 transition-colors h-full">
              <h3 className="text-xs font-bold uppercase text-gray-400 mb-5 flex items-center gap-2 tracking-wider">
                <Settings size={14} /> Basis-Einstellungen
              </h3>

              {/* Quality */}
              <div className="mb-6">
                <label className="text-xs font-medium text-gray-400 mb-2 block">Qualitäts-Level</label>
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                  {['standard', 'high', 'studio'].map((q) => (
                    <button
                      key={q}
                      onClick={() => setParams({ ...params, quality: q as any })}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${params.quality === q
                          ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25'
                          : 'text-gray-500 hover:text-gray-300'
                        }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model (Gender) */}
              <div className="mb-6">
                <label className="text-xs font-medium text-gray-400 mb-2 block">Modell</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setParams({ ...params, gender: 'female' })}
                    className={`py-2.5 px-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${params.gender === 'female'
                        ? 'bg-brand-primary/10 border-brand-primary text-white shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                        : 'bg-black/20 border-white/5 text-gray-400 hover:bg-white/5'
                      }`}
                  >
                    Sie
                  </button>
                  <button
                    onClick={() => setParams({ ...params, gender: 'male' })}
                    className={`py-2.5 px-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${params.gender === 'male'
                        ? 'bg-brand-primary/10 border-brand-primary text-white shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                        : 'bg-black/20 border-white/5 text-gray-400 hover:bg-white/5'
                      }`}
                  >
                    Er
                  </button>
                </div>
              </div>

              {/* Ansicht (Moved here) */}
              <div className="mb-6">
                <label className="text-xs font-medium text-gray-400 mb-2 block">Ansicht</label>
                <div className="flex bg-black/20 p-1 rounded-xl border border-white/5">
                  {Object.entries(FOOT_SIDES).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setParams({ ...params, side: key as any })}
                      className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${params.side === key
                          ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30'
                          : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                    >
                      {key === 'left' && 'Links'}
                      {key === 'right' && 'Rechts'}
                      {key === 'both' && 'Beide'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reference Size */}
              <div className="mb-6">
                <label className="text-xs font-medium text-gray-400 mb-2 block flex justify-between">
                  <span>Schuhgröße</span>
                  <span className="text-white font-mono">{params.footSize} EU</span>
                </label>
                <input
                  type="range"
                  min="35" max="45" step="0.5"
                  value={params.footSize}
                  onChange={(e) => setParams({ ...params, footSize: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-black/40 rounded-full appearance-none cursor-pointer accent-brand-primary hover:accent-brand-accent transition-all"
                />
              </div>

              {/* Skin Tone Circles */}
              <div>
                <label className="text-xs font-medium text-gray-400 mb-2 block">Hautton</label>
                <div className="flex flex-wrap gap-2.5">
                  {SKIN_TONE_PRESETS.map((tone) => (
                    <button
                      key={tone.name}
                      onClick={() => setParams({ ...params, skinTone: tone })}
                      className={`
                            w-8 h-8 rounded-full border-2 transition-all relative
                            ${params.skinTone.name === tone.name
                          ? 'border-brand-primary scale-110 shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                          : 'border-transparent hover:scale-105'}
                          `}
                      style={{ backgroundColor: tone.hex }}
                      title={tone.name}
                    >
                      {params.skinTone.name === tone.name && (
                        <Check size={14} className="text-black/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Form & Zehen */}
          <div className="flex flex-col gap-6">
            <div className="bg-brand-card p-5 rounded-2xl border border-white/5 shadow-xl hover:border-brand-primary/20 transition-colors h-full">
              <h3 className="text-xs font-bold uppercase text-gray-400 mb-5 flex items-center gap-2 tracking-wider">
                <Footprints size={14} /> {VISUAL_DETAIL_GROUPS.shape.label}
              </h3>

              <div className="flex flex-wrap gap-2">
                {VISUAL_DETAIL_GROUPS.shape.options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => toggleDetail(opt)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all border flex justify-between items-center ${params.visualDetails.includes(opt)
                        ? 'bg-brand-primary/20 border-brand-primary text-white shadow-[0_0_8px_rgba(168,85,247,0.2)]'
                        : 'bg-black/20 border-white/5 text-gray-400 hover:border-white/20 hover:text-gray-300'
                      }`}
                  >
                    {opt}
                    {params.visualDetails.includes(opt) && <Check size={12} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMN 3: Haut & Style */}
          <div className="flex flex-col gap-6">
            <div className="bg-brand-card p-5 rounded-2xl border border-white/5 shadow-xl hover:border-brand-primary/20 transition-colors h-full">

              {/* Texture Group */}
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase text-gray-400 mb-4 flex items-center gap-2 tracking-wider">
                  <Layers size={14} /> {VISUAL_DETAIL_GROUPS.texture.label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {VISUAL_DETAIL_GROUPS.texture.options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => toggleDetail(opt)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${params.visualDetails.includes(opt)
                          ? 'bg-brand-primary/20 border-brand-primary text-white shadow-[0_0_8px_rgba(168,85,247,0.2)]'
                          : 'bg-black/20 border-white/5 text-gray-400 hover:border-white/20 hover:text-gray-300'
                        }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Group */}
              <div>
                <h3 className="text-xs font-bold uppercase text-gray-400 mb-4 flex items-center gap-2 tracking-wider">
                  <Sparkles size={14} /> {VISUAL_DETAIL_GROUPS.style.label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {VISUAL_DETAIL_GROUPS.style.options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => toggleDetail(opt)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${params.visualDetails.includes(opt)
                          ? 'bg-brand-primary/20 border-brand-primary text-white shadow-[0_0_8px_rgba(168,85,247,0.2)]'
                          : 'bg-black/20 border-white/5 text-gray-400 hover:border-white/20 hover:text-gray-300'
                        }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 4: Szene & Preview */}
          <div className="flex flex-col gap-6">

            {/* Scene Settings (Merged with Angle) */}
            <div className="bg-brand-card p-5 rounded-2xl border border-white/5 shadow-xl hover:border-brand-primary/20 transition-colors">
              <h3 className="text-xs font-bold uppercase text-gray-400 mb-5 flex items-center gap-2 tracking-wider">
                <Camera size={14} /> Szene & Kamera
              </h3>

              {/* Camera Angle */}
              <div className="mb-5">
                <label className="text-xs font-medium text-gray-400 mb-2 block">Kamerawinkel</label>
                <Select
                  value={params.angle.id}
                  onChange={(e) => {
                    const angle = CAMERA_ANGLES.find(a => a.id === e.target.value);
                    if (angle) setParams({ ...params, angle });
                  }}
                  options={CAMERA_ANGLES.map(a => ({ value: a.id, label: a.label }))}
                  className="bg-black/40 border-white/10"
                />
              </div>

              <div className="mb-5">
                <label className="text-xs font-medium text-gray-400 mb-2 block">Umgebung</label>
                <Select
                  value={params.scene}
                  onChange={(e) => setParams({ ...params, scene: e.target.value })}
                  options={SCENE_OPTIONS.map(s => ({ value: s, label: s }))}
                  className="bg-black/40 border-white/10"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-400 mb-2 block">Beleuchtung</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {LIGHTING_CHIPS.map(chip => (
                    <button
                      key={chip}
                      onClick={() => setParams({ ...params, lighting: chip })}
                      className={`text-[10px] px-2 py-1 rounded bg-white/5 border border-white/5 hover:border-white/20 transition-colors ${params.lighting === chip ? 'bg-white/10 border-brand-primary/50 text-white' : 'text-gray-400'
                        }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={params.lighting}
                  onChange={(e) => setParams({ ...params, lighting: e.target.value })}
                  placeholder="Individuell..."
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white outline-none focus:border-brand-primary transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* PREVIEW AREA (Sticky) */}
            <div
              ref={previewRef}
              className="bg-brand-card rounded-2xl border border-white/5 shadow-2xl overflow-hidden sticky top-6 group"
            >
              <div className="p-1 bg-gradient-to-r from-brand-primary via-purple-500 to-pink-500 opacity-20 h-1"></div>

              {/* Result Display */}
              <div className="aspect-[16/9] bg-black/40 relative flex items-center justify-center">
                {isGenerating ? (
                  <div className="text-center">
                    <div className="w-10 h-10 border-3 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-xs text-brand-primary font-bold animate-pulse">Generiere...</p>
                  </div>
                ) : resultImage ? (
                  <>
                    <img
                      src={resultImage}
                      alt="Generated Result"
                      onClick={() => setIsModalOpen(true)}
                      className="w-full h-full object-cover cursor-zoom-in hover:opacity-90 transition-opacity"
                    />
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Eye size={12} /> Zoom
                    </button>
                  </>
                ) : generationError ? (
                  <div className="text-center p-4 text-red-400">
                    <Info size={24} className="mx-auto mb-2 opacity-80" />
                    <p className="text-xs font-bold">Fehler</p>
                    <p className="text-[10px] opacity-80 mt-1">{generationError}</p>
                  </div>
                ) : (
                  <div className="text-center p-6 opacity-30">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Sparkles size={24} />
                    </div>
                    <p className="text-xs text-gray-400">Vorschau</p>
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
                  className="shadow-xl shadow-purple-900/40 relative overflow-hidden py-3 text-sm tracking-wide"
                >
                  {isGenerating ? 'Wird erstellt...' : `Bild generieren`}
                  {!isGenerating && <Wand2 size={16} className="ml-2" />}
                </Button>
                <p className="text-[10px] text-center text-gray-600 mt-2 font-mono">Kosten: 1 Credit</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="mt-12 text-center opacity-30">
        <p className="text-[10px] text-gray-500">AI Generated Content. No real persons.</p>
      </div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={resultImage || ''}
      />
    </div>
  );
};
