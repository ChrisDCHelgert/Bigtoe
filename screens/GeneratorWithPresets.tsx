// screens/GeneratorWithPresets.tsx (Staged Replacement)

import React, { useState } from 'react';
import { QUALITY_PRESETS, QualityPresetId } from '../services/image/presets';
import { UserProfile } from '../types';
import { Lock } from 'lucide-react';

interface Props {
    user: UserProfile;
    onChangePreset: (presetId: QualityPresetId) => void;
}

export const GeneratorPresetsSelector: React.FC<Props> = ({ user, onChangePreset }) => {
    const [selected, setSelected] = useState<QualityPresetId>('standard');

    const handleSelect = (id: QualityPresetId) => {
        // Entitlement Check logic would go here or be passed down
        setSelected(id);
        onChangePreset(id);
    };

    const isLocked = (minPlan: string) => {
        const plans = ['Free', 'Basic', 'Pro', 'Premium'];
        const userPlanIndex = plans.indexOf(user.plan);
        const requiredIndex = plans.indexOf(minPlan);
        return userPlanIndex < requiredIndex;
    };

    return (
        <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-400 uppercase">Quality Preset</label>
            <div className="grid grid-cols-1 gap-2">
                {QUALITY_PRESETS.map(preset => {
                    const locked = isLocked(preset.minPlan);
                    return (
                        <button
                            key={preset.id}
                            onClick={() => !locked && handleSelect(preset.id)}
                            disabled={locked}
                            className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all
                ${selected === preset.id ? 'border-brand-primary bg-brand-primary/10 ring-1 ring-brand-primary' : 'border-white/10 bg-brand-card'}
                ${locked ? 'opacity-50 cursor-not-allowed' : 'hover:border-white/30'}
              `}
                        >
                            <div>
                                <div className="font-bold text-sm text-white flex items-center gap-2">
                                    {preset.label}
                                    {locked && <Lock size={12} className="text-gray-400" />}
                                </div>
                                <div className="text-xs text-gray-400">{preset.description}</div>
                            </div>
                            <div className="text-xs font-mono font-bold bg-black/20 px-2 py-1 rounded text-gray-300">
                                {preset.creditCost} Credits
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    );
};
