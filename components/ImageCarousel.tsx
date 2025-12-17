
import React from 'react';

// Using high-quality placeholders or assets that mimic the desired style
// Since we don't have real generated assets, we use placeholder URLs that represent the 'concept' or generic placeholders
// In a real app, these would be local assets or CDN links.
const PLACEHOLDER_IMAGES = [
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=600&h=800', // Texture/Mood
    'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=600&h=800', // Feet/Socks concept
    'https://images.unsplash.com/photo-1621252179027-94459d27d3ee?auto=format&fit=crop&q=80&w=600&h=800',
    'https://images.unsplash.com/photo-1632057993072-f6723220bebd?auto=format&fit=crop&q=80&w=600&h=800',
    'https://images.unsplash.com/photo-1560060141-7b9018741ced?auto=format&fit=crop&q=80&w=600&h=800',
    'https://images.unsplash.com/photo-1605559911160-a29632f802d9?auto=format&fit=crop&q=80&w=600&h=800',
    'https://images.unsplash.com/photo-1624545082142-b9cf6d427218?auto=format&fit=crop&q=80&w=600&h=800',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=600&h=800',
    'https://images.unsplash.com/photo-1582298538104-fe2e74c2ed54?auto=format&fit=crop&q=80&w=600&h=800',
    'https://images.unsplash.com/photo-1574102294972-032f16d091b0?auto=format&fit=crop&q=80&w=600&h=800',
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
                        className="flex-shrink-0 w-[200px] h-[300px] mx-2 relative rounded-xl overflow-hidden border border-white/5 shadow-lg opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-500"
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
