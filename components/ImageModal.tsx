// components/ImageModal.tsx
// Lightbox modal for image zoom and pan functionality

import React, { useEffect } from 'react';
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageModalProps {
    imageUrl: string;
    onClose: () => void;
    title?: string;
}

export const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose, title }) => {
    const [zoom, setZoom] = React.useState(1);

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white z-10"
                aria-label="Close"
            >
                <X size={24} />
            </button>

            {/* Controls */}
            <div className="absolute top-4 left-4 flex gap-2 z-10">
                <button
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.5}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Zoom out"
                >
                    <ZoomOut size={20} />
                </button>
                <button
                    onClick={handleZoomIn}
                    disabled={zoom >= 3}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Zoom in"
                >
                    <ZoomIn size={20} />
                </button>
                <a
                    href={imageUrl}
                    download
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                    aria-label="Download"
                >
                    <Download size={20} />
                </a>
            </div>

            {/* Zoom level indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 px-3 py-1 rounded-full text-white text-sm z-10">
                {Math.round(zoom * 100)}%
            </div>

            {/* Image container */}
            <div
                className="max-w-[90vw] max-h-[90vh] overflow-auto cursor-move"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={imageUrl}
                    alt={title || 'Preview'}
                    className="transition-transform duration-200"
                    style={{ transform: `scale(${zoom})` }}
                    draggable={false}
                />
            </div>

            {/* Click outside to close */}
            <div
                className="absolute inset-0 -z-10"
                onClick={onClose}
            />
        </div>
    );
};
