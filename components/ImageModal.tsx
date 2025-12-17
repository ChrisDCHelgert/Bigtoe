// components/ImageModal.tsx
// Lightbox modal for image zoom and pan functionality

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, ZoomIn, ZoomOut, ArrowRight, Smartphone, Monitor, Maximize } from 'lucide-react';

interface ImageModalProps {
    imageUrl: string;
    onClose: () => void;
    title?: string;
    isOpen: boolean;
    showGalleryActions?: boolean; // New prop for Gallery context
}

export const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose, title, isOpen, showGalleryActions = false }) => {
    const [zoom, setZoom] = React.useState(1);
    const [hasError, setHasError] = React.useState(false);

    // Reset state when opening new image
    useEffect(() => {
        if (isOpen) {
            setZoom(1);
            setHasError(false);
        }
    }, [isOpen, imageUrl]);

    if (!isOpen) return null;

    // ESC key to close & Overflow
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    const handleZoomIn = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setZoom(prev => Math.min(prev + 0.25, 3));
    };

    const handleZoomOut = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setZoom(prev => Math.max(prev - 0.25, 0.5));
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md"
            onClick={onClose}
        >
            {/* Close button */}
            <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white z-50 cursor-pointer"
                aria-label="Close"
            >
                <X size={24} />
            </button>

            {/* Top Left Controls (Zoom) */}
            {!hasError && (
                <div
                    className="absolute top-4 left-4 flex gap-2 z-50 pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button onClick={handleZoomOut} disabled={zoom <= 0.5} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-50">
                        <ZoomOut size={20} />
                    </button>
                    <button onClick={handleZoomIn} disabled={zoom >= 3} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-50">
                        <ZoomIn size={20} />
                    </button>

                    {/* Basic Download for everyone */}
                    {!showGalleryActions && (
                        <a href={imageUrl} download onClick={(e) => e.stopPropagation()} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white">
                            <Download size={20} />
                        </a>
                    )}
                </div>
            )}

            {/* Gallery Actions (Bottom Bar) - Only shown if requested */}
            {!hasError && showGalleryActions && (
                <div
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-4 pointer-events-auto bg-black/80 backdrop-blur-xl p-2 rounded-2xl border border-white/10 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* 1. Download */}
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-colors" title="Download">
                        <Download size={16} />
                        <span>Download</span>
                    </button>

                    {/* 2. HD Upscale (Upsell) */}
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-500/50 text-white text-xs font-medium transition-all group">
                        <Maximize size={16} className="text-purple-400 group-hover:scale-110 transition-transform" />
                        <span>HD Upscale</span>
                        <span className="bg-purple-500 text-[9px] px-1 rounded text-white ml-1">PRO</span>
                    </button>

                    {/* 3. Format (Upsell) */}
                    <div className="h-full w-px bg-white/10 mx-1"></div>
                    <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white" title="Mobile Wallpaper">
                        <Smartphone size={18} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white" title="Desktop Wallpaper">
                        <Monitor size={18} />
                    </button>
                </div>
            )}

            {/* Image Container */}
            <div
                className="w-full h-full flex items-center justify-center overflow-hidden p-4"
                onClick={onClose}
            >
                {hasError ? (
                    <div className="text-center text-red-400 bg-black/50 p-6 rounded-xl border border-red-500/30 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-bold mb-2">Fehler beim Laden</h3>
                        <p className="text-sm mb-4">Das Bild konnte nicht geladen werden.</p>
                        <button onClick={onClose} className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 text-white text-sm">Schließen</button>
                    </div>
                ) : (
                    <img
                        src={imageUrl}
                        alt={title || 'Preview'}
                        className="max-w-full max-h-full object-contain transition-transform duration-200 cursor-move shadow-2xl"
                        style={{ transform: `scale(${zoom})` }}
                        draggable={false}
                        onClick={(e) => e.stopPropagation()}
                        onError={() => setHasError(true)}
                    />
                )}
            </div>
        </div>,
        document.body
    );
};
