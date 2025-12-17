// screens/Generator.tsx
// Desktop-first top-down flow: Config → Action → Results

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, Zap, PlayCircle, Eye, AlertTriangle, ChevronDown, Settings, Microscope } from 'lucide-react';
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

export const Generator: React.FC<GeneratorProps> = ({ user, handleConsumption, onGenerate }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [freeText, setFreeText] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<QualityPresetId>('standard');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);

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
    skinTone: '#f8d9c3',
    customPrompt: '',
    medicalConditions: [],
    isRandomMode: false
  });

  const handlePreviewPrompt = () => {
    alert('Preview Prompt (TODO: Show actual prompt)');
  };

  const handleGenerate = async () => {
    if (loading) return;

    const preset = getPreset(selectedPreset);
    const cost = preset.creditCost;

    if (!user.isPremium && user.freeTrialUsed >= user.freeTrialTotal && user.credits < cost) {
      alert('Nicht genügend Credits');
      return;
    }

    try {
      setLoading(true);
      const result = await imageService.generateImage({
        ...params,
        quality: selectedPreset,
        userEmail: user.email,
        isPremium: user.isPremium,
      });

      setGeneratedImage(result);
      handleConsumption(cost, 'generate');
      onGenerate(result, { params, preset: selectedPreset });
    } catch (error: any) {
      console.error('Generation failed:', error);
      alert(`Generation failed: ${error.message}`);
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
          <div className="space-y-4">
            <div className="bg-brand-card rounded-xl p-6 border border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                <Settings size={14} /> Basis-Einstellungen
              </h3>

              {/* Quality Preset */}
              <GeneratorPresetsSelector
                user={user}
                onChangePreset={setSelectedPreset}
              />

              {/* Gender */}
              <div className="space-y-2 mt-4">
                <label className="text-xs font-semibold text-gray-400 uppercase">Geschlecht</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Female', 'Male', 'Diverse'].map(g => (
                    <button
                      key={g}
                      onClick={() => setParams({ ...params, gender: g.toLowerCase() as any })}
                      className={`py-2 text-xs rounded-lg border transition-colors ${params.gender === g.toLowerCase() ? 'bg-brand-primary border-brand-primary text-white' : 'bg-brand-bg border-white/10 text-gray-400'}`}
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
                  <span className="font-mono text-brand-primary">{params.footSize}</span>
                </label>
                <input
                  type="range"
                  min="35"
                  max="45"
                  value={params.footSize}
                  onChange={(e) => setParams({ ...params, footSize: parseInt(e.target.value) })}
                  className="w-full accent-brand-primary"
                />
              </div>

              {/* Skin Tone */}
              <div className="space-y-2 mt-4">
                <label className="text-xs font-semibold text-gray-400 uppercase">Hautton</label>
                <input
                  type="color"
                  value={params.skinTone}
                  onChange={(e) => setParams({ ...params, skinTone: e.target.value })}
                  className="w-full h-10 bg-brand-bg border border-white/10 rounded-lg cursor-pointer"
                />
              </div>

              {/* Side & Angle */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase">Seite</label>
                  <select
                    value={params.side}
                    onChange={(e) => setParams({ ...params, side: e.target.value as any })}
                    className="w-full bg-brand-bg border border-white/10 rounded-lg p-2 text-sm text-white focus:border-brand-primary outline-none"
                  >
                    <option value="left">Links</option>
                    <option value="right">Rechts</option>
                    <option value="both">Beide</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase">Winkel</label>
                  <select
                    value={params.cameraAngle}
                    onChange={(e) => setParams({ ...params, cameraAngle: e.target.value as any })}
                    className="w-full bg-brand-bg border border-white/10 rounded-lg p-2 text-sm text-white focus:border-brand-primary outline-none"
                  >
                    <option value="top">Von oben</option>
                    <option value="side">Seitlich</option>
                    <option value="45">45°</option>
                    <option value="macro">Makro</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Advanced/Medical */}
          <div className="space-y-4">
            {/* Advanced Options - Collapsible */}
            <div className="bg-brand-card rounded-xl border border-white/10 overflow-hidden">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <span className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                  <Microscope size={14} /> Erweiterte Optionen
                </span>
                <ChevronDown size={16} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
              </button>

              {showAdvanced && (
                <div className="px-6 pb-6 space-y-4 border-t border-white/10 pt-4">
                  {/* Scene */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase">Szene</label>
                    <select
                      value={params.scene}
                      onChange={(e) => setParams({ ...params, scene: e.target.value })}
                      className="w-full bg-brand-bg border border-white/10 rounded-lg p-2 text-sm text-white focus:border-brand-primary outline-none"
                    >
                      <option value="Indoor">Innenraum</option>
                      <option value="Outdoor">Außen</option>
                      <option value="Beach">Strand</option>
                      <option value="Studio">Studio</option>
                    </select>
                  </div>

                  {/* Lighting */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase">Beleuchtung / Atmosphäre</label>
                    <input
                      type="text"
                      className="w-full bg-brand-bg border border-white/10 rounded-lg p-3 text-sm text-white focus:border-brand-primary outline-none"
                      placeholder="z.B. Sonnenlicht von links..."
                      value={freeText}
                      onChange={(e) => setFreeText(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Medical Conditions */}
            <div className="bg-brand-card rounded-xl p-6 border border-white/10">
              <label className="text-xs font-semibold text-gray-400 uppercase flex items-center gap-1 mb-4">
                <AlertTriangle size={12} className="text-orange-400" /> Medizinische Merkmale
              </label>
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
                    className={`px-2 py-1.5 text-xs rounded border transition-colors ${params.medicalConditions?.includes(cond) ? 'border-orange-400 bg-orange-400/10 text-orange-300' : 'border-white/10 text-gray-400 hover:border-white/20'}`}
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
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={handlePreviewPrompt} className="text-xs text-brand-primary hover:text-white flex items-center gap-2 transition-colors">
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
            className="px-8 py-3 text-base shadow-xl shadow-purple-900/40"
          >
            <div className="flex items-center gap-2">
              <PlayCircle size={20} />
              <span>Bild generieren</span>
            </div>
          </Button>
        </div>

        {(!user.isPremium && user.freeTrialUsed >= user.freeTrialTotal && user.credits < getPreset(selectedPreset).creditCost) && (
          <p className="text-center text-xs text-red-400 mt-4">
            Nicht genügend Credits. <button onClick={() => navigate('/premium')} className="underline">Jetzt aufladen</button>
          </p>
        )}
      </div>

      {/* Result Area - Only After Generation */}
      {generatedImage && (
        <div className="bg-brand-card rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold mb-4">Generiertes Bild</h3>
          <div
            className="aspect-square max-w-sm mx-auto rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
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
