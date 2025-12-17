import React, { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    icon?: React.ReactNode;
    options: { value: string; label: string }[];
    containerClassName?: string;
    fullWidth?: boolean;
}

export const Select: React.FC<SelectProps> = ({
    label,
    icon,
    options,
    value,
    onChange,
    className = '',
    containerClassName = '',
    fullWidth = true,
    disabled,
    ...props
}) => {
    return (
        <div className={`relative ${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
            {label && (
                <label className="text-xs font-semibold text-gray-400 uppercase mb-2 block flex items-center gap-1">
                    {icon && <span className="mr-1">{icon}</span>}
                    {label}
                </label>
            )}

            <div className="relative">
                <select
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`
            w-full appearance-none
            bg-brand-bg md:bg-black/20 
            border border-white/10 
            rounded-lg p-3 pr-10
            text-sm text-white 
            outline-none 
            focus:border-brand-primary 
            focus:ring-1 focus:ring-brand-primary/50
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all
            ${className}
          `}
                    style={{
                        backgroundImage: 'none', // Remove native arrow
                        backgroundColor: '#0f172a', // Force dark background for dropdown options in some browsers
                        color: 'white'
                    }}
                    {...props}
                >
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="bg-brand-bg text-white py-2" // Tailwind class for options (Firefox/Chrome support varies)
                            style={{ backgroundColor: '#0f172a', color: 'white' }} // Inline fallback for options
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Custom Chevron */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <ChevronDown size={16} />
                </div>
            </div>
        </div>
    );
};
