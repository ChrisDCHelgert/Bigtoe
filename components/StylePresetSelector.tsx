import React from 'react';
import { Sparkles } from 'lucide-react';
import { STYLE_PRESETS } from '../constants';

interface StylePresetSelectorProps {
    onSelect: (preset: typeof STYLE_PRESETS[0]) => void;
}

export const StylePresetSelector: React.FC<StylePresetSelectorProps> = ({ onSelect }) => {
    return (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex items-center gap-2 bg-brand-primary/10 px-3 py-1.5 rounded-full text-brand-primary text-xs font-bold border border-brand-primary/20 shrink-0">
                <Sparkles size={12} />
                QUICK START
            </div>
            {STYLE_PRESETS.map((preset) => (
                <button
                    key={preset.id}
                    onClick={() => onSelect(preset)}
                    className="
      px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap
      bg-black/20 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white
    "
                >
                    {preset.label}
                </button>
            ))}
        </div>
    );
};
