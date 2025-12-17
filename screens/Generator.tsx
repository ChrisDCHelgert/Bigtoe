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
  const [freeText, setFreeText] = useState('');
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

      // Call image generation service
      const result = await imageService.generateImage({
        ...params,
        quality: selectedPreset,
        userEmail: user.email || 'anonymous@bigtoe.ai',
        isPremium: user.isPremium,
      }, user.isPremium);

      setGeneratedImage(result);
      handleConsumption(cost, 'generate');
      onGenerate(result, { params, preset: selectedPreset });
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Configuration Area - 2 Column Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Bild konfigurieren</h2>

        <div className="grid lg:grid-cols-2 gap-6">

          {/* Left Column - Basic Parameters */}
          <div className="space-y-6">
            <div className="bg-brand-card rounded-xl p-6 border border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                <Settings size={14} /> Basis-Einstellungen
              </h3>

              {/* Quality Preset */}
              <div className="mb-4">
                <GeneratorPresetsSelector
                  user={user}
                  onChangePreset={setSelectedPreset}
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase">Geschlecht</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Female', 'Male', 'Diverse'].map(g => (
                    <button
                      key={g}
                      onClick={() => setParams({ ...params, gender: g.toLowerCase() as any })}
                      className={`py-2.5 text-sm rounded-lg border transition-colors font-medium ${params.gender === g.toLowerCase()
                        ? 'bg-brand-primary border-brand-primary text-white'
                        : 'bg-brand-bg border-white/10 text-gray-300 hover:border-white/30'
                        }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Foot Size */}
              <div className="space-y-2 mt-4">
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
                <div className="flex justify-between text-xs text-gray-500">
                  <span>35</span>
                  <span>45</span>
                </div>
              </div>

              {/* Skin Tone - Presets (Medical-Grade) */}
              <div className="space-y-2 mt-4">
                <label className="text-xs font-semibold text-gray-400 uppercase">
                  Hautton (Fitzpatrick-Skala)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SKIN_TONE_PRESETS.map((tone) => (
                    <button
                      key={tone.value}
                      onClick={() => setParams({ ...params, skinTone: tone.value })}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${params.skinTone === tone.value
                        ? 'border-brand-primary bg-brand-primary/10'
                        : 'border-white/10 hover:border-white/30 bg-brand-bg'
                        }`}
                    >
                      <div
                        className="w-8 h-8 rounded-full border-2 border-white/20 flex-shrink-0"
                        style={{ backgroundColor: tone.hex }}
                      />
                      <span className="text-xs text-gray-300 text-left">{tone.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Side & Angle */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase">Seite</label>
                  <select
                    value={params.side}
                    onChange={(e) => setParams({ ...params, side: e.target.value as any })}
                    className="w-full bg-brand-bg border border-white/10 rounded-lg p-3 text-sm text-white focus:border-brand-primary outline-none appearance-none cursor-pointer hover:border-white/30 transition-colors"
                  >
                    <option value="left" className="bg-brand-bg text-white">Links</option>
                    <option value="right" className="bg-brand-bg text-white">Rechts</option>
                    <option value="both" className="bg-brand-bg text-white">Beide</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase">Winkel</label>
                  <select
                    value={params.cameraAngle}
                    onChange={(e) => setParams({ ...params, cameraAngle: e.target.value as any })}
                    className="w-full bg-brand-bg border border-white/10 rounded-lg p-3 text-sm text-white focus:border-brand-primary outline-none appearance-none cursor-pointer hover:border-white/30 transition-colors"
                  >
                    <option value="top" className="bg-brand-bg text-white">Von oben</option>
                    <option value="side" className="bg-brand-bg text-white">Seitlich</option>
                    <option value="45" className="bg-brand-bg text-white">45°</option>
                    <option value="macro" className="bg-brand-bg text-white">Makro</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Advanced/Medical (ALWAYS EXPANDED) */}
          <div className="space-y-6">

            {/* Advanced Options - EXPANDED BY DEFAULT */}
            <div className="bg-brand-card rounded-xl p-6 border border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                <Microscope size={14} /> Erweiterte Optionen
              </h3>

              {/* Scene */}
              <div className="space-y-2 mb-4">
                <label className="text-xs font-semibold text-gray-400 uppercase">Szene</label>
                <select
                  value={params.scene}
                  onChange={(e) => setParams({ ...params, scene: e.target.value })}
                  className="w-full bg-brand-bg border border-white/10 rounded-lg p-3 text-sm text-white focus:border-brand-primary outline-none appearance-none cursor-pointer hover:border-white/30 transition-colors"
                >
                  <option value="Indoor" className="bg-brand-bg text-white">Innenraum</option>
                  <option value="Outdoor" className="bg-brand-bg text-white">Außen</option>
                  <option value="Beach" className="bg-brand-bg text-white">Strand</option>
                  <option value="Studio" className="bg-brand-bg text-white">Studio</option>
                </select>
              </div>

              {/* Lighting / Atmosphere */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase">
                  Beleuchtung / Atmosphäre
                </label>
                <input
                  type="text"
                  className="w-full bg-brand-bg border border-white/10 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:border-brand-primary outline-none hover:border-white/30 transition-colors"
                  placeholder="z.B. Sonnenlicht von links, diffuses Licht..."
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                />
              </div>
            </div>

            {/* Medical Conditions - EXPANDED BY DEFAULT */}
            <div className="bg-brand-card rounded-xl p-6 border border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                <AlertTriangle size={14} className="text-orange-400" /> Medizinische Merkmale
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {MEDICAL_CONDITIONS.map(cond => (
                  <button
                    key={cond}
                    onClick={() => {
                      const newConds = params.medicalConditions?.includes(cond)
                        ? params.medicalConditions.filter(c => c !== cond)
                        : [...(params.medicalConditions || []), cond];
                      setParams({ ...params, medicalConditions: newConds });
                    }}
                    className={`px-3 py-2 text-xs rounded-lg border transition-colors ${params.medicalConditions?.includes(cond)
                      ? 'border-orange-400 bg-orange-400/10 text-orange-300 font-semibold'
                      : 'border-white/10 bg-brand-bg text-gray-300 hover:border-white/30'
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

      {/* Action Zone - Prominent Generate Button */}
      <div className="bg-brand-card rounded-xl p-6 border border-white/10 mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              onClick={handlePreviewPrompt}
              className="text-xs text-brand-primary hover:text-white flex items-center gap-2 transition-colors"
            >
              <Eye size={14} /> Prompt ansehen
            </button>
            <div className="text-sm text-gray-400">
              Kosten: <span className="font-mono font-bold text-brand-primary">{getPreset(selectedPreset).creditCost}</span> Credits
            </div>
          </div>

          <Button
            variant="primary"
            onClick={handleGenerate}
            isLoading={loading}
            disabled={loading}
            className="px-8 py-3 text-base shadow-xl shadow-purple-900/40 w-full sm:w-auto"
          >
            <div className="flex items-center gap-2">
              <PlayCircle size={20} />
              <span>{loading ? 'Generierung läuft...' : 'Bild generieren'}</span>
            </div>
          </Button>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-300">{errorMessage}</p>
          </div>
        )}

        {/* Credit Warning */}
        {(!user.isPremium && user.freeTrialUsed >= user.freeTrialTotal && user.credits < getPreset(selectedPreset).creditCost) && !errorMessage && (
          <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-300">
              Nicht genügend Credits.{' '}
              <button onClick={() => navigate('/premium')} className="underline font-semibold hover:text-yellow-100">
                Jetzt aufladen
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Result Area - Only After Generation */}
      {generatedImage && (
        <div className="bg-brand-card rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold mb-4">Generiertes Bild</h3>
          <div
            className="aspect-square max-w-sm mx-auto rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border border-white/10"
            onClick={() => setShowImageModal(true)}
          >
            <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
          </div>
          <p className="text-center text-sm text-gray-400 mt-4">Klicken zum Vergrößern</p>
        </div>
      )}

      {/* Image Modal */}
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
