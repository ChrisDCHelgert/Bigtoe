// screens/Generator.tsx
// Medical-grade image generator with professional UI

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, PlayCircle, Eye, AlertTriangle, Settings, Microscope } from 'lucide-react';
import { Button } from '../components/Button';
import { ImageModal } from '../components/ImageModal';
import { enhancePrompt } from '../services/geminiService';
import { imageService } from '../services/image/ImageService';
import { QUALITY_PRESETS, QualityPresetId, getPreset } from '../services/image/presets';
import { PRESETS, MEDICAL_CONDITIONS, CAMERA_ANGLES, FOOT_SIDES } from '../constants';
import { UserProfile, GeneratorParams } from '../types';
import { GeneratorPresetsSelector } from './GeneratorWithPresets';

interface GeneratorProps {
  user: UserProfile;
  handleConsumption: (amount: number, type: 'generate' | 'upscale') => void;
  onGenerate: (url: string, metadata: any) => void;
}

// Medical-grade skin tone presets
const SKIN_TONE_PRESETS = [
  { name: 'Type I', value: '#fde9dc', hex: '#fde9dc' },
  { name: 'Type II', value: '#f8d9c3', hex: '#f8d9c3' },
  { name: 'Type III', value: '#e8bc9e', hex: '#e8bc9e' },
  { name: 'Type IV', value: '#d4a574', hex: '#d4a574' },
  { name: 'Type V', value: '#ae7e56', hex: '#ae7e56' },
  { name: 'Type VI', value: '#754c29', hex: '#754c29' },
];

export const Generator: React.FC<GeneratorProps> = ({ user, handleConsumption, onGenerate }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // Removed unused freeText state
  const [selectedPreset, setSelectedPreset] = useState<QualityPresetId>('standard');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [params, setParams] = useState<GeneratorParams>({
    gender: 'female',
    realism: 'photo',
    footSize: 38,
    toeShape: 'Egyptian',
    perspective: 'POV',
    cameraAngle: 'top',
    side: 'both',
    scene: 'Indoor',
    skinTone: '#f8d9c3', // Default to Type II
    customPrompt: '',
    medicalConditions: [],
    isRandomMode: false
  });

  const handlePreviewPrompt = () => {
    alert('Prompt Preview (TODO: Show actual generated prompt)');
  };

  const handleGenerate = async () => {
    if (loading) return;

    setErrorMessage(null);
    const preset = getPreset(selectedPreset);
    const cost = preset.creditCost;

    // Check credits
    if (!user.isPremium && user.freeTrialUsed >= user.freeTrialTotal && user.credits < cost) {
      setErrorMessage('Nicht genügend Credits verfügbar. Bitte laden Sie Credits auf oder upgraden Sie zu Premium.');
      return;
    }

    try {
      setLoading(true);

      // Construct detailed prompt from params
      const constructedPrompt = `Professional podiatry photo, ${params.gender} feet, size ${params.footSize}, ${params.skinTone} skin tone, ${params.view} view, ${params.lighting}, ${params.scene} setting. ${params.customPrompt}`;

      // Call image generation service
      const result = await imageService.generateImage({
        ...params,
        prompt: constructedPrompt, // Explicitly map prompt for API
        quality: selectedPreset,
        userEmail: user.email || 'anonymous@bigtoe.ai',
        isPremium: user.isPremium,
      }, user.isPremium);

      setGeneratedImage(result.url); // Fix: valid string URL
      handleConsumption(cost, 'generate');
      onGenerate(result.url, { params, preset: selectedPreset });
      setErrorMessage(null);
    } catch (error: any) {
      console.error('Generation failed:', error);
      // User-friendly error message
      setErrorMessage(
        'Die Bildgenerierung ist fehlgeschlagen. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support, falls das Problem weiterhin besteht.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-80px)] overflow-hidden flex flex-col">
      {/* 3-Column Layout - Takes up remaining height for dashboard feel */}
      <div className="flex-1 grid lg:grid-cols-10 gap-6 overflow-hidden min-h-0">

        {/* LEFT COL (30%) - Core Attributes */}
        <div className="lg:col-span-3 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          <div className="bg-brand-card rounded-xl p-5 border border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
              <Settings size={14} /> Basis-Einstellungen
            </h3>

            <div className="space-y-5">
              <GeneratorPresetsSelector user={user} onChangePreset={setSelectedPreset} />

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase">Geschlecht</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Female', 'Male', 'Diverse'].map(g => (
                    <button
                      key={g}
                      onClick={() => setParams({ ...params, gender: g.toLowerCase() as any })}
                      className={`py-2 text-xs rounded-lg border transition-colors font-medium ${params.gender === g.toLowerCase()
                          ? 'bg-brand-primary border-brand-primary text-white'
                          : 'bg-brand-bg border-white/10 text-gray-400 hover:border-white/30'
                        }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase flex justify-between">
                  <span>Fußgröße (EU)</span>
                  <span className="font-mono text-brand-primary font-bold">{params.footSize}</span>
                </label>
                <input
                  type="range"
                  min="35"
                  max="45"
                  value={params.footSize}
                  onChange={(e) => setParams({ ...params, footSize: parseInt(e.target.value) })}
                  className="w-full accent-brand-primary h-2 bg-brand-bg rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase">Hautton</label>
                <div className="grid grid-cols-2 gap-2">
                  {SKIN_TONE_PRESETS.map((tone) => (
                    <button
                      key={tone.value}
                      onClick={() => setParams({ ...params, skinTone: tone.value })}
                      className={`flex items-center gap-3 p-2 rounded-lg border transition-all ${params.skinTone === tone.value
                          ? 'border-brand-primary bg-brand-primary/10'
                          : 'border-white/10 hover:border-white/30 bg-brand-bg'
                        }`}
                    >
                      <div className="w-6 h-6 rounded-full border border-white/20 flex-shrink-0" style={{ backgroundColor: tone.hex }} />
                      <span className="text-xs text-gray-300">{tone.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE COL (30%) - Medical & Pose */}
        <div className="lg:col-span-3 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          <div className="bg-brand-card rounded-xl p-5 border border-white/10 h-full">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
              <Microscope size={14} /> Medizin & Position
            </h3>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase">Seite</label>
                  <select
                    value={params.side}
                    onChange={(e) => setParams({ ...params, side: e.target.value as any })}
                    className="w-full bg-brand-bg border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-brand-primary outline-none"
                    style={{ backgroundColor: '#0f172a' }}
                  >
                    {[
                      { v: 'left', l: 'Links' }, { v: 'right', l: 'Rechts' }, { v: 'both', l: 'Beide' }
                    ].map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase">Winkel</label>
                  <select
                    value={params.cameraAngle}
                    onChange={(e) => setParams({ ...params, cameraAngle: e.target.value as any })}
                    className="w-full bg-brand-bg border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-brand-primary outline-none"
                    style={{ backgroundColor: '#0f172a' }}
                  >
                    {[
                      { v: 'top', l: 'Von oben' }, { v: 'side', l: 'Seitlich' }, { v: '45', l: '45°' }, { v: 'macro', l: 'Makro' }
                    ].map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold text-gray-400 uppercase flex items-center gap-2">
                  <AlertTriangle size={12} className="text-orange-400" /> Pathologie
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {MEDICAL_CONDITIONS.map(cond => (
                    <button
                      key={cond}
                      onClick={() => {
                        const newConds = params.medicalConditions?.includes(cond)
                          ? params.medicalConditions.filter(c => c !== cond)
                          : [...(params.medicalConditions || []), cond];
                        setParams({ ...params, medicalConditions: newConds });
                      }}
                      className={`px-3 py-2 text-xs text-left rounded-lg border transition-colors ${params.medicalConditions?.includes(cond)
                          ? 'border-orange-400 bg-orange-400/10 text-orange-300 font-semibold'
                          : 'border-white/10 bg-brand-bg text-gray-400 hover:border-white/30'
                        }`}
                    >
                      {cond.split('(')[0].trim()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COL (40%) - Visuals & Result (Fixed Focus) */}
        <div className="lg:col-span-4 flex flex-col gap-4 h-full">
          {/* Scene Config & Action */}
          <div className="bg-brand-card rounded-xl p-5 border border-white/10 flex-shrink-0">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase">Szene</label>
                <select
                  value={params.scene}
                  onChange={(e) => setParams({ ...params, scene: e.target.value })}
                  className="w-full bg-brand-bg border border-white/10 rounded-lg p-2.5 text-xs text-white outline-none"
                  style={{ backgroundColor: '#0f172a' }}
                >
                  {['Indoor', 'Outdoor', 'Beach', 'Studio'].map(s => <option key={s} value={s}>{s === 'Indoor' ? 'Innenraum' : s === 'Outdoor' ? 'Außen' : s === 'Beach' ? 'Strand' : s}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase">Licht</label>
                <input
                  type="text"
                  value={params.lighting || ''}
                  onChange={(e) => setParams({ ...params, lighting: e.target.value })}
                  placeholder="z.B. Softbox"
                  className="w-full bg-brand-bg border border-white/10 rounded-lg p-2.5 text-xs text-white outline-none"
                  style={{ backgroundColor: '#0f172a' }}
                />
              </div>
            </div>

            <div className="mb-4">
              <textarea
                rows={2}
                className="w-full bg-brand-bg border border-white/10 rounded-lg p-3 text-xs text-white placeholder-gray-500 focus:border-brand-primary outline-none resize-none"
                style={{ backgroundColor: '#0f172a' }}
                placeholder="Zusätzliche Details (z.B. keine Socken)... "
                value={params.customPrompt || ''}
                onChange={(e) => setParams({ ...params, customPrompt: e.target.value })}
              />
            </div>

            <Button
              variant="primary"
              fullWidth
              onClick={handleGenerate}
              isLoading={loading}
              disabled={loading}
              className="py-3 shadow-lg shadow-purple-900/30"
            >
              <div className="flex items-center justify-center gap-2">
                <PlayCircle size={18} />
                <span>{loading ? 'Generiere...' : 'Jetzt Generieren'}</span>
              </div>
            </Button>
            {errorMessage && <p className="text-xs text-red-400 mt-2 text-center">{errorMessage}</p>}
          </div>

          {/* Result Area - Always Visible */}
          <div className="flex-1 bg-black/40 rounded-xl border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group min-h-[300px]">
            {generatedImage ? (
              <>
                <img
                  src={generatedImage}
                  alt="Result"
                  className="w-full h-full object-contain cursor-pointer"
                  onClick={() => setShowImageModal(true)}
                />
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setShowImageModal(true)} className="p-2 bg-black/60 rounded-full text-white hover:bg-black">
                    <Eye size={16} />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500">
                <div className="w-16 h-16 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center">
                  <Wand2 size={24} className="opacity-50" />
                </div>
                <p className="text-sm">Vorschau-Bereich</p>
                <p className="text-xs opacity-50 mt-1">Das Ergebnis erscheint hier</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {showImageModal && generatedImage && (
        <ImageModal
          imageUrl={generatedImage}
          onClose={() => setShowImageModal(false)}
          title="Generiertes Bild"
        />
      )}
    </div>
  );
};
