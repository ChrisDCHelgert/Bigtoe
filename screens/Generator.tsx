import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, Zap, HelpCircle, Save, Sliders, PlayCircle, Shuffle, Eye, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/Button';
import { enhancePrompt } from '../services/geminiService';
import { imageService } from '../services/image/ImageService';
import { QUALITY_PRESETS, QualityPresetId, getPreset } from '../services/image/presets';
import { PRESETS, MEDICAL_CONDITIONS, FORBIDDEN_WORDS, CAMERA_ANGLES, FOOT_SIDES, MEDICAL_TRANSLATIONS } from '../constants';
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
  const [prompt, setPrompt] = useState('');
  const [enhancing, setEnhancing] = useState(false);
  const [freeText, setFreeText] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<QualityPresetId>('standard');

  // Form State
  const [params, setParams] = useState<GeneratorParams>({
    gender: 'female',
    realism: 'photo',
    footSize: 38,
    toeShape: 'Egyptian',
    perspective: 'POV', // Keeping for legacy, mapped to Camera Angle
    cameraAngle: 'top',
    side: 'both',
    scene: 'Indoor',
    skinTone: '#f8d9c3',
    customPrompt: '',
    medicalConditions: [],
    isRandomMode: false
  });

  const handleRandomMode = () => {
    // Toggle
    if (params.isRandomMode) {
      setParams({ ...params, isRandomMode: false });
    } else {
      // Smart Random Logic
      const sides: any[] = ['left', 'right', 'both'];
      const angles: any[] = ['top', 'side', '45', 'macro'];

      let randomSide = sides[Math.floor(Math.random() * sides.length)];
      let randomAngle = angles[Math.floor(Math.random() * angles.length)];

      // Prevent "Both Feet + Side View" (physically awkward)
      if (randomSide === 'both' && randomAngle === 'side') {
        randomAngle = 'top';
      }

      setParams({
        ...params,
        isRandomMode: true,
        gender: ['female', 'male', 'diverse'][Math.floor(Math.random() * 3)] as any,
        footSize: 35 + Math.floor(Math.random() * 10),
        scene: 'Random',
        customPrompt: 'Random Surprise',
        side: randomSide,
        cameraAngle: randomAngle
      });
      setPrompt('A complete surprise composition');
    }
  };

  const validatePrompt = (text: string): boolean => {
    const found = FORBIDDEN_WORDS.find(w => text.toLowerCase().includes(w));
    if (found) {
      alert(`⚠️ Validation Warning: The word "${found}" is not allowed.`);
      return false;
    }
    // Logic Check: 3D Render vs Macro (Example from prompt)
    if (params.realism === 'anime' && params.cameraAngle === 'macro') {
      // Not strictly forbidden but maybe weird. Allowing for now but could warn.
    }
    return true;
  };

  const handleMedicalCondition = (condition: string) => {
    const current = params.medicalConditions || [];
    const updated = current.includes(condition)
      ? current.filter(c => c !== condition)
      : [...current, condition];
    setParams({ ...params, medicalConditions: updated });
  };

  const buildDetailedPrompt = (): string => {
    if (params.isRandomMode) return "A high quality photorealistic image of feet, surprise composition, 8k, masterpiece";

    // 1. Core Subject
    const sideText = FOOT_SIDES[params.side] || 'feet';
    const angleText = CAMERA_ANGLES[params.cameraAngle] || 'view';
    const styleText = params.realism === 'photo' ? 'highly detailed photorealistic' : 'anime style';

    let promptStr = `A ${styleText} ${angleText} of ${params.gender} ${sideText}, EU size ${params.footSize}`;

    // 2. Details
    promptStr += `, ${params.skinTone === '#f8d9c3' ? 'light' : params.skinTone === '#e0ac69' ? 'medium' : 'dark'} skin tone`;
    promptStr += `, showing ${params.toeShape} toe structure`;

    // 3. Conditions
    if (params.medicalConditions && params.medicalConditions.length > 0) {
      const conditionsEnglish = params.medicalConditions.map(c => MEDICAL_TRANSLATIONS[c] || c).join(', ');
      promptStr += `, featuring ${conditionsEnglish}`;
    }

    // 4. Scene & Lighting (Auto-Enhancement)
    if (freeText) {
      promptStr += `. Scene: ${freeText}`;
    } else {
      promptStr += `. Shot on a soft background with professional studio lighting`;
    }

    // 5. Technical (Strict Realism Standards)
    if (params.realism === 'photo') {
      promptStr += `, Canon EOS 5D Mark IV, 85mm lens, f/1.8, ISO 100. Hyper-realistic skin texture, visible pores, anatomically perfect, 5 toes, natural joint alignment, subsurface scattering, 8k resolution, raw photo.`;
    } else {
      promptStr += `, anime style, vibrant colors.`;
    }

    // 6. User Custom
    if (prompt) {
      promptStr += ` Details: ${prompt}`;
    }

    return promptStr;
  };

  const handlePreviewPrompt = () => {
    const full = buildDetailedPrompt();
    alert(`📝 Prompt Preview:\n\n${full}`);
  };

  const handleEnhance = async () => {
    if (!prompt) return;
    setEnhancing(true);
    const newPrompt = await enhancePrompt(prompt);
    setPrompt(newPrompt);
    setEnhancing(false);
  };

  const handleGenerate = async () => {
    const preset = getPreset(selectedPreset);

    // Check credits (now based on preset cost)
    if (!user.isPremium && user.freeTrialUsed >= user.freeTrialTotal && user.credits < preset.creditCost) {
      navigate('/premium');
      return;
    }

    if (!validatePrompt(prompt) || !validatePrompt(freeText)) return;

    setLoading(true);
    handleConsumption(preset.creditCost, 'generate');

    // Construct full prompt
    const fullPrompt = buildDetailedPrompt();

    try {
      // Use ImageService instead of direct geminiService
      const result = await imageService.generate(
        {
          prompt: fullPrompt,
          width: preset.width,
          height: preset.height,
          params: params
        },
        user.isPremium
      );

      // Create metadata
      const metadata = {
        fullPrompt,
        title: params.isRandomMode ? "Zufallskreation" : "Benutzerdefinierte Generierung",
        provider: result.provider,
        preset: selectedPreset
      };

      onGenerate(result.url, metadata);
      setLoading(false);
      navigate('/result');
    } catch (error: any) {
      console.error('Generation failed:', error);
      alert(`Generation failed: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Desktop: 2-column (Controls | Preview), Mobile: Stack */}
      <div className="lg:grid lg:grid-cols-[480px_1fr] gap-8">

        {/* LEFT COLUMN: Controls (Fixed width, sticky on desktop) */}
        <div className="lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto space-y-6">

          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-brand-primary">BigToe</span> AI
            </h2>
            <button
              onClick={handleRandomMode}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${params.isRandomMode ? 'bg-brand-primary border-brand-primary text-white' : 'bg-brand-card border-white/10 text-gray-400'}`}
            >
              <Shuffle size={14} /> Random
            </button>
          </div>

          {/* Controls Container with max-width for inputs */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <Sliders size={14} /> Model Specs
              </h3>
              <button className="text-xs text-brand-primary flex items-center gap-1">
                <Save size={12} /> Save
              </button>
            </div>

            {/* Quality Preset Selector */}
            <GeneratorPresetsSelector
              user={user}
              onChangePreset={setSelectedPreset}
            />

            {/* Gender - Constrained width */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase">Gender</label>
              <div className="grid grid-cols-3 gap-2">
                {['Female', 'Male', 'Diverse'].map(g => (
                  <button
                    key={g}
                    onClick={() => setParams({ ...params, gender: g.toLowerCase() as any })}
                    className={`py-2 text-xs rounded-lg border transition-colors ${params.gender === g.toLowerCase() ? 'bg-brand-primary border-brand-primary text-white' : 'bg-brand-card border-white/10 text-gray-400'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Foot Size */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase flex justify-between">
                <span>Foot Size (EU)</span>
                <span className="font-mono text-brand-primary">{params.footSize}</span>
              </label>
              <input
                type="range"
                min="35"
                max="45"
                value={params.footSize}
                onChange={(e) => setParams({ ...params, footSize: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* Skin Tone */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase">Skin Tone</label>
              <input
                type="color"
                value={params.skinTone}
                onChange={(e) => setParams({ ...params, skinTone: e.target.value })}
                className="w-full h-12 bg-brand-card border border-white/10 rounded-lg cursor-pointer"
              />
            </div>

            {/* Toe Shape */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase">Toe Shape</label>
              <select
                value={params.toeShape}
                onChange={(e) => setParams({ ...params, toeShape: e.target.value })}
                className="w-full bg-brand-card border border-white/10 rounded-lg p-2 text-sm text-white focus:border-brand-primary outline-none"
              >
                <option value="Egyptian">Egyptian (Long)</option>
                <option value="Greek">Greek (Morton's)</option>
                <option value="Roman">Roman (Square)</option>
              </select>
            </div>

            {/* Side & Camera Angle */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase">Side</label>
                <div className="flex bg-brand-card rounded-lg border border-white/10 p-1">
                  {['left', 'right', 'both'].map(s => (
                    <button
                      key={s}
                      onClick={() => setParams({ ...params, side: s as any })}
                      className={`flex-1 py-1 text-xs rounded capitalize ${params.side === s ? 'bg-brand-primary text-white' : 'text-gray-400'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase">Angle</label>
                <select
                  value={params.cameraAngle}
                  onChange={(e) => setParams({ ...params, cameraAngle: e.target.value as any })}
                  className="w-full bg-brand-card border border-white/10 rounded-lg p-2 text-sm text-white focus:border-brand-primary outline-none"
                >
                  <option value="top">Top Down</option>
                  <option value="side">Side</option>
                  <option value="45">45°</option>
                  <option value="macro">Macro</option>
                </select>
              </div>
            </div>

            {/* Medical Conditions */}
            <div className={`space-y-2 ${params.isRandomMode ? 'opacity-50 pointer-events-none' : ''}`}>
              <label className="text-xs font-semibold text-gray-400 uppercase flex items-center gap-1">
                <AlertTriangle size={12} className="text-orange-400" /> Medical
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
                    className={`px-2 py-1 text-xs rounded border transition-colors ${params.medicalConditions?.includes(cond) ? 'border-orange-400 bg-orange-400/10 text-orange-300' : 'border-white/10 text-gray-400'}`}
                  >
                    {cond.split('(')[0].trim()}
                  </button>
                ))}
              </div>
            </div>

            {/* Scene */}
            <div className={`space-y-2 ${params.isRandomMode ? 'opacity-50 pointer-events-none' : ''}`}>
              <label className="text-xs font-semibold text-gray-400 uppercase">Scene</label>
              <select
                value={params.scene}
                onChange={(e) => setParams({ ...params, scene: e.target.value })}
                className="w-full bg-brand-card border border-white/10 rounded-lg p-2 text-sm text-white focus:border-brand-primary outline-none"
              >
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Beach">Beach</option>
                <option value="Studio">Studio</option>
              </select>
            </div>

            {/* Free Text */}
            <div className={`space-y-2 ${params.isRandomMode ? 'opacity-50 pointer-events-none' : ''}`}>
              <label className="text-xs font-semibold text-gray-400 uppercase">Lighting / Atmosphere</label>
              <input
                type="text"
                className="w-full bg-brand-card border border-white/10 rounded-lg p-3 text-sm text-white focus:border-brand-primary outline-none"
                placeholder="e.g. sunlight from left, cinematic..."
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
              />
            </div>

            {/* Submit Button - scoped to controls width */}
            <div className="pt-4 space-y-3">
              <button onClick={handlePreviewPrompt} className="w-full text-xs text-brand-primary hover:text-white flex justify-center items-center gap-2">
                <Eye size={14} /> Preview Prompt
              </button>

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
                    {user.isPremium ? 'Unlimited' : (user.freeTrialUsed < user.freeTrialTotal ? 'Free Trial' : `${getPreset(selectedPreset).creditCost} Credits`)}
                  </span>
                </div>
              </Button>
              {(!user.isPremium && user.freeTrialUsed >= user.freeTrialTotal && user.credits < getPreset(selectedPreset).creditCost) && (
                <p className="text-center text-xs text-red-400 mt-2">
                  Nicht genügend Credits. <button onClick={() => navigate('/premium')} className="underline">Aufladen</button>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Preview/Result (Flexible width, dominant) */}
        <div className="mt-6 lg:mt-0">
          <div className="sticky top-20">
            {/* Preview Canvas */}
            <div className="aspect-square rounded-2xl bg-brand-card border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mb-4 text-brand-primary">
                <Wand2 size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Ready to create</h3>
              <p className="text-gray-400 text-sm max-w-sm">Configure your model specs on the left, then click Generate to create your masterpiece.</p>

              {loading && (
                <div className="mt-6">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-primary border-t-transparent"></div>
                  <p className="text-sm text-gray-400 mt-4">Generating...</p>
                </div>
              )}
            </div>

            {/* Credits Display (In Preview Area on Desktop) */}
            <div className="mt-4 bg-brand-card px-4 py-3 rounded-lg border border-white/10 flex items-center justify-between">
              <span className="text-sm text-gray-400">Available Credits</span>
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-brand-primary" fill="currentColor" />
                <span className="font-mono font-bold text-lg">{user.credits}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
