// components/ImageModal.tsx
// Lightbox modal for image zoom and pan functionality

import React, { useEffect } from 'react';
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageModalProps {
    imageUrl: string;
    onClose: () => void;
    title?: string;
    isOpen: boolean;
}

export const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose, title, isOpen }) => {
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

    // ESC key to close
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Prevent body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleZoomIn = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setZoom(prev => Math.min(prev + 0.25, 3));
    };

    const handleZoomOut = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setZoom(prev => Math.max(prev - 0.25, 0.5));
    };

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md"
            onClick={onClose} // Backdrop click closes
        >
            {/* Close button */}
            <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white z-50 cursor-pointer"
                aria-label="Close"
            >
                <X size={24} />
            </button>

            {/* Controls */}
            {!hasError && (
                <div
                    className="absolute top-4 left-4 flex gap-2 z-50 pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={handleZoomOut}
                        disabled={zoom <= 0.5}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ZoomOut size={20} />
                    </button>
                    <button
                        onClick={handleZoomIn}
                        disabled={zoom >= 3}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ZoomIn size={20} />
                    </button>
                    <a
                        href={imageUrl}
                        download
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                    >
                        <Download size={20} />
                    </a>
                </div>
            )}

            {/* Image container */}
            <div
                className="w-full h-full flex items-center justify-center overflow-hidden p-4"
                onClick={onClose}
            >
                {hasError ? (
                    <div className="text-center text-red-400 bg-black/50 p-6 rounded-xl border border-red-500/30 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-bold mb-2">Fehler beim Laden</h3>
                        <p className="text-sm mb-4">Das Bild konnte nicht geladen werden.</p>
                        <button onClick={onClose} className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 text-white text-sm">
                            Schließen
                        </button>
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
        </div>
    );
};
