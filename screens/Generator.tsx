// screens/Generator.tsx
// Fetish/Creator UX - V3.2 Stabilized Layout (DE)

import React, { useState, useRef } from 'react';
import { Settings, Sparkles, Sliders, Wand2, Info, Check, Eye, Footprints, Camera, Sun, Layers, AlertCircle } from 'lucide-react';
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
import { UserProfile } from '../types';
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
    gender: 'female' as 'female' | 'male' | 'diverse',
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
      // Map "diverse" to a prompt description if needed, or rely on model understanding
      const genderPrompt = params.gender === 'diverse' ? 'non-binary person' : params.gender;

      const prompt = `Photorealistic ${genderPrompt} feet, ${FOOT_SIDES[params.side]}, ${params.angle.value}, ${params.skinTone.value}. Details: ${params.visualDetails.join(', ')}. Scene: ${params.scene}. Lighting: ${params.lighting || 'balanced'}. 8k resolution, highly detailed skin texture, realistic toes, masterpiece.`;

      const result = await imageService.generateImage({
        prompt: prompt,
        aspectRatio: '16:9',
        enhancePrompt: true,
        params: { ...params }
      }, user.plan === 'Pro' || user.plan === 'Creator');

      // --- ROBUST IMAGE HANDLING ---
      // 1. Check for standard URL
      let finalImageUrl = result.url || (result as any).imageUrl;

      // 2. Check for Base64 (sometimes returned in 'b64_json' or similar if provider differs)
      if ((result as any).b64_json) {
        finalImageUrl = `data:image/png;base64,${(result as any).b64_json}`;
      }

      // 3. Validate and Format
      if (!finalImageUrl) {
        console.error("No image data found in response:", result);
        throw new Error("Keine Bilddaten empfangen (Empty Response).");
      }

      if (typeof finalImageUrl === 'string' && !finalImageUrl.startsWith('http') && !finalImageUrl.startsWith('data:')) {
        // Assume raw base64 string if not url or data-uri
        finalImageUrl = `data:image/png;base64,${finalImageUrl}`;
      }

      handleConsumption(1, 'generate');
      setResultImage(finalImageUrl);
      onGenerate(finalImageUrl, { ...params, prompt });

    } catch (error: any) {
      console.error("Generation failed:", error);
      setGenerationError(error.message || "Unbekannter Fehler bei der Generierung.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-white pb-20 font-sans">
      <div className="max-w-[1800px] mx-auto px-4 md:px-6 py-6" id="generator-top">

        {/* Header & Quick Fetish Styles */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-3 tracking-tight">
            <Wand2 className="text-brand-primary" size={28} />
            Studio Generator
          </h1>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Quick Fetish Styles</label>
            <StylePresetSelector onSelect={handleStylePreset} />
          </div>
        </div>

        {/* MAIN LAYOUT: 8 Columns Controls | 4 Columns Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT: CONTROLS (8 Cols) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* COLUMN A: Basics */}
            <div className="bg-brand-card p-5 rounded-2xl border border-white/5 shadow-xl h-full">
              <h3 className="text-xs font-bold uppercase text-gray-400 mb-5 flex items-center gap-2 tracking-wider">
                <Settings size={14} /> Basis-Einstellungen
              </h3>

              {/* Quality */}
              <div className="mb-6">
                <label className="text-xs font-medium text-gray-400 mb-2 block">Qualität</label>
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

              {/* Model (3-Segment) */}
              <div className="mb-6">
                <label className="text-xs font-medium text-gray-400 mb-2 block">Modell</label>
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                  {['female', 'male', 'diverse'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setParams({ ...params, gender: g as any })}
                      className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${params.gender === g
                          ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30 shadow-inner'
                          : 'text-gray-400 hover:text-white'
                        }`}
                    >
                      {g === 'female' && 'Frau'}
                      {g === 'male' && 'Mann'}
                      {g === 'diverse' && 'Divers'}
                    </button>
                  ))}
                </div>
              </div>

              {/* View/Ansicht */}
              <div className="mb-6">
                <label className="text-xs font-medium text-gray-400 mb-2 block">Ansicht</label>
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                  {Object.entries(FOOT_SIDES).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setParams({ ...params, side: key as any })}
                      className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${params.side === key
                          ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30'
                          : 'text-gray-400 hover:text-white'
                        }`}
                    >
                      {key === 'left' && 'Links'}
                      {key === 'right' && 'Rechts'}
                      {key === 'both' && 'Beide'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
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

              {/* Skin Tone */}
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

            {/* COLUMN B: Details (Shape + Texture + Style) */}
            <div className="bg-brand-card p-5 rounded-2xl border border-white/5 shadow-xl h-full flex flex-col gap-6">
              <h3 className="text-xs font-bold uppercase text-gray-400 mb-1 flex items-center gap-2 tracking-wider">
                <Sliders size={14} /> Details
              </h3>

              {/* Shape */}
              <div>
                <label className="text-[10px] font-bold text-brand-primary uppercase mb-3 block flex items-center gap-2 opacity-80">
                  <Footprints size={12} /> {VISUAL_DETAIL_GROUPS.shape.label}
                </label>
                <div className="flex flex-wrap gap-2">
                  {VISUAL_DETAIL_GROUPS.shape.options.map(opt => (
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

              {/* Texture */}
              <div>
                <label className="text-[10px] font-bold text-brand-primary uppercase mb-3 block flex items-center gap-2 opacity-80">
                  <Layers size={12} /> {VISUAL_DETAIL_GROUPS.texture.label}
                </label>
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

              {/* Style */}
              <div>
                <label className="text-[10px] font-bold text-brand-primary uppercase mb-3 block flex items-center gap-2 opacity-80">
                  <Sparkles size={12} /> {VISUAL_DETAIL_GROUPS.style.label}
                </label>
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

            {/* COLUMN C: Scene (Camera + Env + Light) */}
            <div className="bg-brand-card p-5 rounded-2xl border border-white/5 shadow-xl h-full">
              <h3 className="text-xs font-bold uppercase text-gray-400 mb-5 flex items-center gap-2 tracking-wider">
                <Camera size={14} /> Szene & Kamera
              </h3>

              {/* Camera Angle (Grid) */}
              <div className="mb-6">
                <label className="text-xs font-medium text-gray-400 mb-2 block">Kamerawinkel</label>
                <div className="grid grid-cols-2 gap-2">
                  {CAMERA_ANGLES.map(a => (
                    <button
                      key={a.id}
                      onClick={() => setParams({ ...params, angle: a })}
                      className={`p-2 rounded-lg text-xs border text-left transition-all ${params.angle.id === a.id
                          ? 'bg-brand-primary/10 border-brand-primary text-white'
                          : 'bg-black/20 border-white/5 text-gray-400 hover:bg-white/5'
                        }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Environment */}
              <div className="mb-6">
                <label className="text-xs font-medium text-gray-400 mb-2 block">Umgebung</label>
                <Select
                  value={params.scene}
                  onChange={(e) => setParams({ ...params, scene: e.target.value })}
                  options={SCENE_OPTIONS.map(s => ({ value: s, label: s }))}
                  className="bg-black/40 border-white/10"
                />
              </div>

              {/* Lighting */}
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
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white mb-3 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: PREVIEW (4 Cols, Sticky) */}
          <div className="lg:col-span-4 sticky top-6">
            <div
              ref={previewRef}
              className="bg-brand-card rounded-2xl border border-white/5 shadow-2xl overflow-hidden group"
            >
              <div className="p-1 bg-gradient-to-r from-brand-primary via-purple-500 to-pink-500 opacity-20 h-1"></div>

              {/* Result Display */}
              <div className="aspect-[16/9] bg-black/40 relative flex items-center justify-center min-h-[300px]">
                {isGenerating ? (
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-sm text-brand-primary font-bold animate-pulse">Generiere...</p>
                    <p className="text-[10px] text-gray-500 mt-2">Das dauert ca. 5-10 Sekunden</p>
                  </div>
                ) : resultImage ? (
                  <>
                    <img
                      src={resultImage}
                      alt="Generated Result"
                      onClick={() => setIsModalOpen(true)}
                      className="w-full h-full object-cover cursor-zoom-in hover:opacity-95 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                      <Button
                        onClick={() => setIsModalOpen(true)}
                        size="sm" variant="secondary"
                        className="backdrop-blur-md bg-white/10 border-white/20"
                      >
                        <Eye size={14} className="mr-2" /> Vergrößern
                      </Button>
                    </div>
                  </>
                ) : generationError ? (
                  <div className="text-center p-6 text-red-400 max-w-[80%]">
                    <AlertCircle size={32} className="mx-auto mb-3 opacity-80" />
                    <p className="text-sm font-bold mb-1">Fehler bei der Erstellung</p>
                    <p className="text-xs opacity-80">{generationError}</p>
                    <Button
                      onClick={handleGenerate}
                      variant="secondary"
                      size="sm"
                      className="mt-4 bg-red-500/10 border-red-500/30 text-red-200 hover:bg-red-500/20"
                    >
                      Erneut versuchen
                    </Button>
                  </div>
                ) : (
                  <div className="text-center p-8 opacity-40">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-primary/50">
                      <Sparkles size={32} />
                    </div>
                    <h3 className="text-white font-medium mb-1">Bereit</h3>
                    <p className="text-gray-500 text-xs">
                      Klicke unten auf "Bild generieren"
                    </p>
                  </div>
                )}
              </div>

              {/* Main Action */}
              <div className="p-5 border-t border-white/5 bg-brand-card">
                <Button
                  fullWidth
                  size="lg"
                  variant="primary"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="shadow-xl shadow-purple-900/40 relative overflow-hidden py-4 text-base tracking-wide"
                >
                  {isGenerating ? 'Wird erstellt...' : `Bild generieren`}
                  {!isGenerating && <Wand2 size={18} className="ml-2" />}
                </Button>
                <p className="text-[10px] text-center text-gray-600 mt-3 font-mono">1 Credit pro Bild</p>
              </div>
            </div>

            {/* Footer Links in Preview Column */}
            <div className="mt-8 text-center opacity-40">
              <p className="text-[10px] text-gray-500 flex items-center justify-center gap-2">
                <Info size={10} /> AI Generated Content. No real persons.
              </p>
            </div>
          </div>

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
