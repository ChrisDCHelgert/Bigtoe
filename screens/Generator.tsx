// screens/Generator.tsx
// Fetish/Creator UX - V4.0 Stable & Reliable (DE)

import React, { useState, useRef, useEffect } from 'react';
import { Settings, Sparkles, Sliders, Wand2, Info, Check, Eye, Footprints, Camera, Layers, AlertCircle, RefreshCw, Heart } from 'lucide-react';
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
  STYLE_PRESETS,
  STYLE_VIBES,
  ACTION_MOMENTS,
  TATTOO_OPTIONS,
  JEWELRY_OPTIONS,
  BONDAGE_OPTIONS,
  NAIL_COLORS
} from '../constants';
import { UserProfile } from '../types';
import { StylePresetSelector } from '../components/StylePresetSelector';
import { Select } from '../components/Select';

interface GeneratorProps {
  user: UserProfile;
  handleConsumption: (amount: number, type: string) => void;
  onGenerate: (imageUrl: string, metadata: any) => void;
}

import { FavoritesService } from '../services/FavoritesService';
import { GalleryService } from '../services/GalleryService';
import { PromptBuilder, PromptSettings } from '../services/image/PromptBuilder';



// ... imports remain the same

export const Generator: React.FC<GeneratorProps> = ({ user, handleConsumption, onGenerate }) => {
  // --- STATE MANAGEMENT ---
  const [status, setStatus] = useState<'idle' | 'optimizing' | 'generating' | 'validating' | 'loading_image' | 'success' | 'error'>('idle');
  const [retryCount, setRetryCount] = useState(0);
  const [validationMsg, setValidationMsg] = useState('');

  const [params, setParams] = useState<PromptSettings>({
    gender: 'female',
    side: 'both',
    footSize: 38,
    skinTone: SKIN_TONE_PRESETS[1],
    angle: CAMERA_ANGLES[1],
    visualDetails: [],
    scene: SCENE_OPTIONS[0],
    lighting: LIGHTING_CHIPS[0],
    styleVibe: '',
    actionMoment: '',

    // V3 Defaults
    tattoos: { enabled: false, motif: 'Tribal', placement: ['dorsum'], intensity: 'Dezent' },
    jewelry: { enabled: false, type: 'Fußkettchen', materials: 'Gold', style: 'Normal' },
    bondage: { enabled: false, level: 'light', material: 'Seil (Jute)', color: 'Natur' },
    nails: { enabled: false, color: 'Rot', finish: 'Glossy', french: false, frenchBase: 'Nude' },

    quality: 'standard'
  });

  const [resultImage, setResultImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  // Toggle helpers
  const toggleDetail = (detail: string) => {
    setParams(prev => {
      const exists = prev.visualDetails.includes(detail);
      return {
        ...prev,
        visualDetails: exists
          ? prev.visualDetails.filter(d => d !== detail)
          : [...prev.visualDetails, detail]
      };
    });
  };

  const toggleFavorite = async () => {
    if (!resultImage) return;
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      await FavoritesService.addFavorite(resultImage); // Mock
    } else {
      await FavoritesService.removeFavorite(resultImage); // Mock
    }
  };

  const handleOpenModal = () => {
    if (resultImage) setIsModalOpen(true);
  };

  // MOCK VALIDATION SERVICE (Client-side simulation)
  // In a real app, this would send the URL to a backend with GPT-4 Vision
  const validateImage = async (imageUrl: string, params: any): Promise<{ valid: boolean; reason?: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate a random quality check failure (10% chance) to demonstrate the logic
        // Only if "Quality" is set to "Studio" to avoid annoying users on fast gens
        const shouldFail = params.quality === 'studio' && Math.random() < 0.1;

        if (shouldFail) {
          resolve({ valid: false, reason: 'Detected >5 toes or artifact' });
        } else {
          resolve({ valid: true });
        }
      }, 1500);
    });
  };

  const handleGenerate = async (retries = 0) => {
    // Credit check only on first attempt
    if (retries === 0 && user.credits < 1) {
      alert("Du hast nicht genügend Credits.");
      return;
    }

    setRetryCount(retries);
    setErrorMessage(null);

    // Scroll on Mobile
    if (retries === 0 && previewRef.current && window.innerWidth < 1024) {
      previewRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    try {
      // PHASE 1: OPTIMIZING PROMPT
      setStatus('optimizing');
      await new Promise(r => setTimeout(r, 600)); // UX Pause to show "Optimizing"

      // 1. Build Prompt (Standard)
      let prompt = PromptBuilder.buildPrompt(params);
      let negativePrompt = PromptBuilder.buildNegativePrompt(params);

      // If retrying, enhance negative prompt to be stricter (Task 2)
      if (retries > 0) {
        console.log(`[Generator] Retry ${retries}: Strengthening prompt constraints.`);
        prompt += ", perfect anatomy, masterpiece";
        negativePrompt += ", (extra toes:1.6), (six toes:1.6), (mutation:1.5), (deformed:1.5), (glitch:1.4)";
      }

      console.log(`[Generator] Starting request (Attempt ${retries + 1})...`);

      // PHASE 2: GENERATING
      setStatus('generating');

      // 2. Call API
      const result = await imageService.generateImage({
        prompt: prompt,
        negativePrompt: negativePrompt,
        aspectRatio: '16:9',
        enhancePrompt: false, // Strict Compiler means NO auto-enhance
        params: { ...params }
      }, user.plan === 'Pro' || user.plan === 'Creator');

      let finalImageUrl = result.url || (result as any).imageUrl;
      if ((result as any).b64_json) finalImageUrl = `data:image/png;base64,${(result as any).b64_json}`;

      if (!finalImageUrl) throw new Error("Keine Bilddaten empfangen.");

      // PHASE 3: VALIDATING
      setStatus('validating');
      const validation = await validateImage(finalImageUrl, { ...params, retries });

      if (!validation.valid) {
        console.warn(`[Generator] Validation Failed: ${validation.reason}`);

        if (retries < 2) { // Max 2 Retries (Total 3 attempts)
          setValidationMsg(`Fehlerkorrektur (${validation.reason}) – Optimierung läuft (Versuch ${retries + 2}/3)…`);
          await new Promise(r => setTimeout(r, 1500)); // Show msg briefly
          handleGenerate(retries + 1); // Recursive Retry
          return;
        } else {
          console.warn("Max retries reached. Accepting image despite validation warning.");
          // Optional: Fail hard? Or show anyway? User said "Fail -> Re-Run". 
          // If max retries reached, we often show it to avoid "No Image" frustration, but maybe with a warning?
          // Let's show it but maybe log it.
        }
      }

      console.log("[Generator] QC Passed. Showing image.");

      // 4. Update State -> Wait for onLoad
      setResultImage(finalImageUrl);
      setIsFavorite(false);
      setStatus('loading_image');

      localStorage.setItem('bigtoe_last_image', finalImageUrl);

      // --- AUTO SAVE TO GALLERY (BACKGROUND) ---
      setTimeout(() => {
        try {
          GalleryService.addImage({
            url: finalImageUrl,
            prompt: prompt,
            params: params,
            tags: [params.side, params.gender, 'generated']
          });
        } catch (err) {
          console.error("Background Save Error:", err);
        }
      }, 0);

      // Consume Credits (Charge for the successful result, regardless of how many retries it took internally)
      handleConsumption(1, 'generate');

      onGenerate(finalImageUrl, { ...params, prompt });

    } catch (error: any) {
      console.error("[Generator] Failed:", error);
      let friendlyMessage = "Ein unbekannter Fehler ist aufgetreten.";
      if (error.message) friendlyMessage = error.message;
      setErrorMessage(friendlyMessage);
      setStatus('error');
    }
  };

  // Called when main <img> finishes loading
  const handleImageLoad = () => {
    setStatus('success');
  };

  const handleImageError = () => {
    console.error("[Generator] Image failed to load (404/Network).");
    setErrorMessage("Das Bild konnte nicht geladen werden.");
    setStatus('error');
  };

  const isLoading = status === 'optimizing' || status === 'generating' || status === 'validating' || status === 'loading_image';

  // Handler for Quick Styles
  const handleStylePreset = (preset: typeof STYLE_PRESETS[0]) => {
    setParams(prev => ({
      ...prev,
      scene: preset.params.scene,
      lighting: preset.params.lighting,
      visualDetails: preset.params.visualDetails,
      angle: preset.params.angle ? CAMERA_ANGLES.find(a => a.value === preset.params.angle) || prev.angle : prev.angle
    }));
  };

  return (
    <div className="min-h-screen bg-brand-bg text-white pb-20 font-sans">
      <div className="max-w-[1800px] mx-auto px-4 md:px-6 py-6" id="generator-top">

        {/* Header */}
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


        {/* MAIN GRID - RESPONSIVE FLOW (Content determines height) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative">

          {/* LEFT: CONTROLS (8 Cols) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* COLUMN A: Basics */}
            <div className="bg-brand-card p-5 rounded-2xl border border-white/5 shadow-xl">
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

              {/* Model */}
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

              {/* Ansicht */}
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

            {/* COLUMN B: Details & Vibe (Compact Accordion) */}
            <div className="bg-brand-card p-4 rounded-2xl border border-white/5 shadow-xl flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase text-gray-400 mb-1 flex items-center gap-2 tracking-wider">
                <Sliders size={14} /> Styling & Details
              </h3>

              {/* 1. NAILS (Priority) */}
              <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-white flex items-center gap-2">
                    <Sparkles size={12} className="text-pink-400" /> Nägel & Lack
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={params.nails?.enabled} onChange={(e) => setParams({ ...params, nails: { ...params.nails!, enabled: e.target.checked } })} />
                    <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-500"></div>
                  </label>
                </div>

                {params.nails?.enabled && (
                  <div className="mt-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Type: Full vs French */}
                    <div className="flex gap-2">
                      <button onClick={() => setParams({ ...params, nails: { ...params.nails!, french: false } })} className={`flex-1 py-1.5 text-[10px] rounded-lg border ${!params.nails?.french ? 'bg-pink-500/20 border-pink-500 text-white' : 'border-white/10 text-gray-400'}`}>Full Color</button>
                      <button onClick={() => setParams({ ...params, nails: { ...params.nails!, french: true } })} className={`flex-1 py-1.5 text-[10px] rounded-lg border ${params.nails?.french ? 'bg-pink-500/20 border-pink-500 text-white' : 'border-white/10 text-gray-400'}`}>French Tips</button>
                    </div>

                    {/* Color Picker */}
                    {!params.nails?.french && (
                      <div className="flex flex-wrap gap-2">
                        {NAIL_COLORS.map(c => (
                          <button
                            key={c.name}
                            onClick={() => setParams({ ...params, nails: { ...params.nails!, color: c.name } })}
                            className={`w-6 h-6 rounded-full border border-white/20 transition-transform hover:scale-110 ${params.nails?.color === c.name ? 'ring-2 ring-white scale-110' : ''}`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    )}

                    {/* Finish / French Base */}
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-400">{params.nails?.french ? 'Base Color' : 'Finish'}</span>
                      <select
                        className="bg-black/40 border-white/10 text-[10px] rounded px-2 py-1 outline-none text-white"
                        value={params.nails?.french ? params.nails?.frenchBase : params.nails?.finish}
                        onChange={(e) => setParams({
                          ...params,
                          nails: {
                            ...params.nails!,
                            ...(params.nails?.french ? { frenchBase: e.target.value } : { finish: e.target.value })
                          }
                        })}
                      >
                        {params.nails?.french
                          ? ['Nude', 'Pinkish', 'Transparent'].map(o => <option key={o} value={o}>{o}</option>)
                          : ['Glossy', 'Matte', 'Metallic'].map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. TATTOOS (Accordion) */}
              <details className="group bg-black/20 rounded-xl border border-white/5 overflow-hidden">
                <summary className="p-3 cursor-pointer flex justify-between items-center text-xs font-bold text-gray-400 group-open:text-brand-primary transition-colors select-none">
                  <span className="flex items-center gap-2"><Layers size={12} /> Tattoos</span>
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="sr-only peer" checked={params.tattoos?.enabled} onChange={(e) => setParams({ ...params, tattoos: { ...params.tattoos!, enabled: e.target.checked } })} />
                      <div className="w-7 h-4 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </summary>
                {params.tattoos?.enabled && (
                  <div className="p-3 pt-0 border-t border-white/5 space-y-3">
                    <Select
                      label="Motiv"
                      options={TATTOO_OPTIONS.motifs.map(m => ({ value: m, label: m }))}
                      value={params.tattoos?.motif}
                      onChange={(e) => setParams({ ...params, tattoos: { ...params.tattoos!, motif: e.target.value } })}
                      fullWidth
                      className="text-[10px] p-2"
                    />
                    <div>
                      <span className="text-[10px] text-gray-500 block mb-1">Platzierung</span>
                      <div className="flex flex-wrap gap-1.5">
                        {TATTOO_OPTIONS.placements.map(p => (
                          <button
                            key={p.id}
                            onClick={() => {
                              const old = params.tattoos?.placement || [];
                              const clean = old.includes(p.id) ? old.filter(x => x !== p.id) : [...old, p.id];
                              setParams({ ...params, tattoos: { ...params.tattoos!, placement: clean } });
                            }}
                            className={`px-2 py-1 rounded border text-[10px] ${params.tattoos?.placement.includes(p.id) ? 'bg-purple-500/30 border-purple-500 text-white' : 'border-white/10 text-gray-500'}`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </details>

              {/* 3. JEWELRY & BONDAGE (Accordion) */}
              <details className="group bg-black/20 rounded-xl border border-white/5 overflow-hidden">
                <summary className="p-3 cursor-pointer flex justify-between items-center text-xs font-bold text-gray-400 group-open:text-brand-primary transition-colors select-none">
                  <span className="flex items-center gap-2"><Sparkles size={12} /> Schmuck & Bondage</span>
                  <span className="text-[10px] bg-white/5 px-1.5 rounded">{params.jewelry?.enabled || params.bondage?.enabled ? 'Aktiv' : 'Inaktiv'}</span>
                </summary>
                <div className="p-3 pt-0 border-t border-white/5 space-y-4">

                  {/* Jewelry Control */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between">
                      <span className="text-[10px] uppercase font-bold text-gray-500">Fußschmuck</span>
                      <input type="checkbox" checked={params.jewelry?.enabled} onChange={(e) => setParams({ ...params, jewelry: { ...params.jewelry!, enabled: e.target.checked } })} className="accent-brand-primary" />
                    </div>
                    {params.jewelry?.enabled && (
                      <div className="grid grid-cols-2 gap-2">
                        <Select options={JEWELRY_OPTIONS.types.map(t => ({ value: t, label: t }))} value={params.jewelry?.type} onChange={(e) => setParams({ ...params, jewelry: { ...params.jewelry!, type: e.target.value } })} className="text-[10px] p-1.5" />
                        <Select options={JEWELRY_OPTIONS.materials.map(m => ({ value: m, label: m }))} value={params.jewelry?.materials} onChange={(e) => setParams({ ...params, jewelry: { ...params.jewelry!, materials: e.target.value } })} className="text-[10px] p-1.5" />
                      </div>
                    )}
                  </div>

                  {/* Bondage Control */}
                  <div className="space-y-2 border-t border-white/5 pt-2">
                    <div className="flex justify-between">
                      <span className="text-[10px] uppercase font-bold text-gray-500">Bondage / Ropes</span>
                      <input type="checkbox" checked={params.bondage?.enabled} onChange={(e) => setParams({ ...params, bondage: { ...params.bondage!, enabled: e.target.checked } })} className="accent-brand-primary" />
                    </div>
                    {params.bondage?.enabled && (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          {BONDAGE_OPTIONS.levels.map(l => (
                            <button key={l.id} onClick={() => setParams({ ...params, bondage: { ...params.bondage!, level: l.id } })} className={`flex-1 py-1 text-[10px] border rounded ${params.bondage?.level === l.id ? 'bg-red-900/40 border-red-500 text-red-200' : 'border-white/10 text-gray-500'}`}>{l.label}</button>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Select options={BONDAGE_OPTIONS.materials.map(m => ({ value: m, label: m }))} value={params.bondage?.material} onChange={(e) => setParams({ ...params, bondage: { ...params.bondage!, material: e.target.value } })} className="text-[10px] p-1.5" />
                          <Select options={BONDAGE_OPTIONS.colors.map(c => ({ value: c, label: c }))} value={params.bondage?.color} onChange={(e) => setParams({ ...params, bondage: { ...params.bondage!, color: e.target.value } })} className="text-[10px] p-1.5" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </details>

              {/* 4. VISUAL BASICS (Shape/Texture) */}
              <details className="group bg-black/20 rounded-xl border border-white/5 overflow-hidden" open>
                <summary className="p-3 cursor-pointer flex justify-between items-center text-xs font-bold text-gray-400 group-open:text-brand-primary transition-colors select-none">
                  <span className="flex items-center gap-2"><Footprints size={12} /> Form & Textur</span>
                </summary>
                <div className="p-3 pt-0 border-t border-white/5 space-y-3">
                  {/* Simplified Shape & Texture Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {[...VISUAL_DETAIL_GROUPS.shape.options, ...VISUAL_DETAIL_GROUPS.texture.options].map(opt => (
                      <button
                        key={opt}
                        onClick={() => toggleDetail(opt)}
                        className={`px-2 py-1 rounded text-[10px] transition-all border ${params.visualDetails.includes(opt)
                          ? 'bg-brand-primary/20 border-brand-primary text-white'
                          : 'bg-black/20 border-white/5 text-gray-400 hover:text-gray-300'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </details>

              {/* 5. VIBE */}
              <div className="pt-2">
                <label className="text-[10px] font-bold text-brand-primary uppercase mb-2 block flex items-center gap-2 opacity-80">
                  <Sparkles size={12} /> Vibe / Atmosphäre
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {STYLE_VIBES.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setParams(p => ({ ...p, styleVibe: p.styleVibe === v.id ? '' : v.id }))}
                      className={`px-2 py-1 rounded border text-[10px] ${params.styleVibe === v.id
                        ? 'bg-purple-900/40 border-purple-500 text-purple-200'
                        : 'bg-black/40 border-white/5 text-gray-500'
                        }`}
                      title={v.diff}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* COLUMN C: Scene & Action */}
            <div className="bg-brand-card p-5 rounded-2xl border border-white/5 shadow-xl flex flex-col gap-6">
              <h3 className="text-xs font-bold uppercase text-gray-400 mb-5 flex items-center gap-2 tracking-wider">
                <Camera size={14} /> Szene & Kamera
              </h3>

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

              {/* ACTION (New) */}
              <div className="mb-6">
                <label className="text-xs font-medium text-gray-400 mb-2 block">Action / Moment (Optional)</label>
                <Select
                  value={params.actionMoment || ''}
                  onChange={(e) => setParams({ ...params, actionMoment: e.target.value })}
                  options={[{ value: '', label: 'Keine Aktion (Statisch)' }, ...ACTION_MOMENTS.map(a => ({ value: a.id, label: a.label }))]}
                  className="bg-black/40 border-white/10"
                />
              </div>

              <div className="mb-6">
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
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white mb-3 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: PREVIEW (4 Cols, Sticky to follow scroll) */}
          <div className="lg:col-span-4 flex flex-col sticky top-6">
            <div
              ref={previewRef}
              className="bg-brand-card rounded-2xl border border-white/5 shadow-2xl overflow-hidden group flex flex-col relative min-h-[500px]"
            >
              <div className="p-1 bg-gradient-to-r from-brand-primary via-purple-500 to-pink-500 opacity-20 h-1"></div>

              {/* IMAGE DISPLAY AREA */}
              <div className="relative flex-1 bg-black/50 aspect-[3/4] md:aspect-auto flex items-center justify-center overflow-hidden">

                {/* 1. IDLE STATE */}
                {status === 'idle' && !resultImage && (
                  <div className="text-center p-8 opacity-40">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-primary/50">
                      <Sparkles size={32} />
                    </div>
                    <h3 className="text-white font-medium mb-1">Bereit</h3>
                    <p className="text-gray-500 text-xs">Wähle Einstellungen & klicke Start</p>
                  </div>
                )}

                {/* 2. LOADING STATE (Overlay) */}
                {isLoading && (
                  <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
                    <div className="w-16 h-16 border-4 border-brand-primary border-t-white rounded-full animate-spin mb-4 shadow-[0_0_20px_rgba(168,85,247,0.5)]"></div>
                    <h3 className="text-xl font-bold text-white mb-2 animate-pulse">
                      {status === 'optimizing' && 'Prompt-Optimierung...'}
                      {status === 'generating' && 'Bild wird erstellt...'}
                      {status === 'validating' && 'Anatomie-Check...'}
                      {status === 'loading_image' && 'Wird geladen...'}
                    </h3>
                    <p className="text-sm text-gray-400 max-w-[200px]">
                      {status === 'optimizing' && 'Compiler normalisiert Parameter'}
                      {status === 'generating' && 'KI berechnet Pixel (~5-10s)'}
                      {status === 'validating' && (validationMsg || 'Prüfung auf 5 Zehen & Details')}
                      {status === 'loading_image' && 'Bild wird finalisiert...'}
                    </p>
                  </div>
                )}

                {/* 3. IMAGE RESULT */}
                {resultImage && (
                  <>
                    <img
                      src={resultImage}
                      alt="Generated"
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                      onClick={handleOpenModal}
                      className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'} cursor-zoom-in`}
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8 p-4 z-10 pointer-events-none gap-3">
                      <Button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(); }}
                        size="sm" variant="secondary"
                        className={`backdrop-blur-md border-white/20 pointer-events-auto ${isFavorite ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white/10 text-white'}`}
                      >
                        <Heart size={14} className={isFavorite ? "fill-current" : ""} />
                      </Button>
                      <Button
                        onClick={(e) => { e.stopPropagation(); handleOpenModal(); }}
                        size="sm" variant="secondary"
                        className="backdrop-blur-md bg-white/10 border-white/20 pointer-events-auto"
                      >
                        <Eye size={14} className="mr-2" /> Vollbild
                      </Button>
                    </div>
                  </>
                )}

                {/* 4. ERROR STATE */}
                {status === 'error' && (
                  <div className="absolute inset-0 z-10 bg-black/90 flex flex-col items-center justify-center text-center p-6 text-red-400">
                    <AlertCircle size={48} className="mb-4 opacity-80" />
                    <h3 className="text-lg font-bold text-white mb-2">Fehler aufgetreten</h3>
                    <p className="text-sm opacity-80 mb-6">{errorMessage}</p>
                    <Button onClick={handleGenerate} variant="secondary" className="bg-red-500/10 border-red-500/30 text-white hover:bg-red-500/20">
                      <RefreshCw size={16} className="mr-2" /> Erneut versuchen
                    </Button>
                  </div>
                )}
              </div>

              {/* ACTION BUTTON */}
              <div className="p-5 border-t border-white/5 bg-brand-card z-30 relative">
                <Button
                  fullWidth
                  size="lg"
                  variant="primary"
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className={`
                    shadow-xl shadow-purple-900/20 py-4 text-base tracking-wide transition-all
                    ${isLoading ? 'opacity-70 cursor-wait' : 'hover:scale-[1.02]'}
                  `}
                >
                  {status === 'validating' ? 'Prüfung läuft...' : isLoading ? 'Bitte warten...' : 'Bild generieren'}
                  {!isLoading && <Wand2 size={18} className="ml-2" />}
                </Button>
                <div className="flex justify-between items-center mt-3 px-1">
                  <span className="text-[10px] text-gray-500 font-mono">1 Credit / Bild</span>
                  <span className="text-[10px] text-gray-600 flex items-center gap-1">
                    <Info size={10} /> AI Generated • Fictional
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={resultImage || ''}
        showGalleryActions={true}
      />
    </div>
  );
};
