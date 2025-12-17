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

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md">
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white z-20"
                aria-label="Close"
            >
                <X size={24} />
            </button>

            {/* Controls */}
            <div className="absolute top-4 left-4 flex gap-2 z-20">
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
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                >
                    <Download size={20} />
                </a>
            </div>

            {/* Image container */}
            <div
                className="w-full h-full flex items-center justify-center overflow-hidden"
                onClick={onClose}
            >
                <img
                    src={imageUrl}
                    alt={title || 'Preview'}
                    className="max-w-none transition-transform duration-200 cursor-move"
                    style={{ transform: `scale(${zoom})` }}
                    draggable={false}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </div>
    );
};
