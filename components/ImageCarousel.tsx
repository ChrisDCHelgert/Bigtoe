
import React from 'react';

// Using high-quality placeholders or assets that mimic the desired style
// Since we don't have real generated assets, we use placeholder URLs that represent the 'concept' or generic placeholders
// In a real app, these would be local assets or CDN links.
const PLACEHOLDER_IMAGES = [
    // Specific foot/sole/aesthetic focus
    'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=400&h=600', // Soles
    'https://images.unsplash.com/photo-1621252179027-94459d27d3ee?auto=format&fit=crop&q=80&w=400&h=600', // Toes/Pedicure
    'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=400&h=600', // Barefoot
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=400&h=600', // Sneaker/Bare combo
    'https://images.unsplash.com/photo-1624545082142-b9cf6d427218?auto=format&fit=crop&q=80&w=400&h=600', // Arches
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400&h=600', // Legs/Feet
    'https://images.unsplash.com/photo-1605559911160-a29632f802d9?auto=format&fit=crop&q=80&w=400&h=600', // Aesthetic
    'https://images.unsplash.com/photo-1574102294972-032f16d091b0?auto=format&fit=crop&q=80&w=400&h=600', // Soft light
    'https://images.unsplash.com/photo-1560060141-7b9018741ced?auto=format&fit=crop&q=80&w=400&h=600', // High arch
    'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?auto=format&fit=crop&q=80&w=400&h=600', // Relaxed
];

export const ImageCarousel: React.FC = () => {
    // Duplicate for infinite scroll loop
    const images = [...PLACEHOLDER_IMAGES, ...PLACEHOLDER_IMAGES];

    return (
        <div className="w-full overflow-hidden relative group my-12">
            {/* Fade Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-brand-bg to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-brand-bg to-transparent pointer-events-none" />

            {/* Scroll Container */}
            <div className="flex animate-scroll hover:[animation-play-state:paused] w-[200%]">
                {images.map((src, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 w-[110px] h-[160px] mx-1.5 relative rounded-lg overflow-hidden border border-white/5 shadow-lg opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-500"
                    >
                        <img
                            src={src}
                            alt="AI generated foot aesthetic"
                            className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                    animation: scroll 40s linear infinite;
                }
            `}</style>
        </div>
    );
};
