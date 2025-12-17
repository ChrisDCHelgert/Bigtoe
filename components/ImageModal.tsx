// components/ImageModal.tsx
// Lightbox modal for image zoom and pan functionality

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, ZoomIn, ZoomOut, Smartphone, Monitor, Maximize, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { GalleryActionsService } from '../services/GalleryActionsService';
import { GalleryItem, GalleryService } from '../services/GalleryService'; // To lookup original ID if needed

interface ImageModalProps {
    imageUrl: string;
    onClose: () => void;
    title?: string;
    isOpen: boolean;
    showGalleryActions?: boolean;
}

// Toast Notification internal component
const MiniToast: React.FC<{ message: string; type: 'success' | 'error' | 'loading' }> = ({ message, type }) => (
    <div className={`absolute bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full backdrop-blur-md border text-xs font-medium flex items-center gap-2 shadow-xl animate-in fade-in slide-in-from-bottom-4 z-[10000]
        ${type === 'success' ? 'bg-green-500/20 border-green-500/40 text-green-200' : ''}
        ${type === 'error' ? 'bg-red-500/20 border-red-500/40 text-red-200' : ''}
        ${type === 'loading' ? 'bg-blue-500/20 border-blue-500/40 text-blue-200' : ''}
    `}>
        {type === 'loading' && <Loader2 size={12} className="animate-spin" />}
        {type === 'success' && <CheckCircle size={12} />}
        {type === 'error' && <AlertCircle size={12} />}
        {message}
    </div>
);

export const ImageModal: React.FC<ImageModalProps> = ({ imageUrl: initialUrl, onClose, title, isOpen, showGalleryActions = false }) => {
    // Current Image State (can change due to upscale/variant)
    const [currentImageUrl, setCurrentImageUrl] = useState(initialUrl);

    // UI States
    const [zoom, setZoom] = useState(1);
    const [hasError, setHasError] = useState(false);

    // Action States
    const [actionStatus, setActionStatus] = useState<'idle' | 'downloading' | 'upscaling' | 'varying'>('idle');
    const [toast, setToast] = useState<{ msg: string, type: 'success' | 'error' | 'loading' } | null>(null);

    // Reset when opening fresh
    useEffect(() => {
        if (isOpen) {
            setCurrentImageUrl(initialUrl); // Reset to prop
            setZoom(1);
            setHasError(false);
            setActionStatus('idle');
            setToast(null);
        }
    }, [isOpen, initialUrl]);

    // Cleanup Toast
    useEffect(() => {
        if (toast && toast.type !== 'loading') {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    if (!isOpen) return null;

    // --- ACTIONS ---

    const handleDownload = async () => {
        if (actionStatus !== 'idle') return;
        setActionStatus('downloading');
        setToast({ msg: "Download startet...", type: 'loading' });

        try {
            await GalleryActionsService.downloadImage(currentImageUrl);
            setToast({ msg: "Download erfolgreich", type: 'success' });
        } catch (e: any) {
            setToast({ msg: "Download fehlgeschlagen", type: 'error' });
        } finally {
            setActionStatus('idle');
        }
    };

    const handleJob = async (type: 'upscale' | 'variant_h' | 'variant_v') => {
        if (actionStatus !== 'idle') return;

        let label = '';
        if (type === 'upscale') { setActionStatus('upscaling'); label = "HD Upscale"; }
        else { setActionStatus('varying'); label = type === 'variant_h' ? "Landscape Format" : "Portrait Format"; }

        setToast({ msg: `${label} wird erstellt...`, type: 'loading' });

        try {
            // 1. Start Job
            const jobId = type === 'upscale'
                ? await GalleryActionsService.startUpscaleJob('mock_id')
                : await GalleryActionsService.startVariantJob('mock_id', type === 'variant_h' ? '16:9' : '9:16');

            // 2. Poll (Simulated)
            const result = await GalleryActionsService.pollJobStatus(jobId);

            if (result.status === 'completed') {
                // 3. Save Result
                const tag = type === 'upscale' ? 'Upscale' : (type === 'variant_h' ? '16:9' : '9:16');
                const newItem = GalleryActionsService.saveResultAsNewItem(currentImageUrl, tag);

                // 4. Update View
                setCurrentImageUrl(newItem.url);
                setToast({ msg: `${label} fertiggestellt!`, type: 'success' });
            } else {
                throw new Error("Job Failed");
            }
        } catch (e) {
            setToast({ msg: `Fehler bei ${label}`, type: 'error' });
        } finally {
            setActionStatus('idle');
        }
    };

    // Zoom Controls
    const handleZoomIn = (e?: React.MouseEvent) => { e?.stopPropagation(); setZoom(p => Math.min(p + 0.25, 3)); };
    const handleZoomOut = (e?: React.MouseEvent) => { e?.stopPropagation(); setZoom(p => Math.max(p - 0.25, 0.5)); };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md" onClick={onClose}>

            {/* TOAST NOTIFICATION */}
            {toast && <MiniToast message={toast.msg} type={toast.type} />}

            {/* Close */}
            <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white z-50">
                <X size={24} />
            </button>

            {/* Top Left Controls */}
            {!hasError && (
                <div className="absolute top-4 left-4 flex gap-2 z-50 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                    <button onClick={handleZoomOut} disabled={zoom <= 0.5} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-50">
                        <ZoomOut size={20} />
                    </button>
                    <button onClick={handleZoomIn} disabled={zoom >= 3} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-50">
                        <ZoomIn size={20} />
                    </button>
                    {/* Basic Download if no Action Bar */}
                    {!showGalleryActions && (
                        <button onClick={handleDownload} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white">
                            <Download size={20} />
                        </button>
                    )}
                </div>
            )}

            {/* ACTION BAR (Bottom) */}
            {!hasError && showGalleryActions && (
                <div
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-4 pointer-events-auto bg-black/80 backdrop-blur-xl p-2 rounded-2xl border border-white/10 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* DOWNLOAD */}
                    <button
                        onClick={handleDownload}
                        disabled={actionStatus !== 'idle'}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-colors ${actionStatus === 'downloading' ? 'opacity-50 cursor-wait' : ''}`}
                    >
                        {actionStatus === 'downloading' ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                        <span>Download</span>
                    </button>

                    {/* HD UPSCALE */}
                    <button
                        onClick={() => handleJob('upscale')}
                        disabled={actionStatus !== 'idle'}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-500/50 text-white text-xs font-medium transition-all group ${actionStatus === 'upscaling' ? 'opacity-50 cursor-wait' : ''}`}
                    >
                        {actionStatus === 'upscaling' ? <Loader2 size={16} className="animate-spin" /> : <Maximize size={16} className="text-purple-400 group-hover:scale-110 transition-transform" />}
                        <span>HD Upscale</span>
                        <span className="bg-purple-500 text-[9px] px-1 rounded text-white ml-1">PRO</span>
                    </button>

                    <div className="h-full w-px bg-white/10 mx-1"></div>

                    {/* FORMATS */}
                    <button
                        onClick={() => handleJob('variant_v')}
                        disabled={actionStatus !== 'idle'}
                        className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white relative group"
                        title="Portrait (9:16)"
                    >
                        {actionStatus === 'varying' ? <Loader2 size={18} className="animate-spin" /> : <Smartphone size={18} />}
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Portrait</span>
                    </button>
                    <button
                        onClick={() => handleJob('variant_h')}
                        disabled={actionStatus !== 'idle'}
                        className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white relative group"
                        title="Landscape (16:9)"
                    >
                        {actionStatus === 'varying' ? <Loader2 size={18} className="animate-spin" /> : <Monitor size={18} />}
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Landscape</span>
                    </button>
                </div>
            )}

            {/* IMAGE */}
            <div className="w-full h-full flex items-center justify-center overflow-hidden p-4" onClick={onClose}>
                {hasError ? (
                    <div className="text-center text-red-400 bg-black/50 p-6 rounded-xl border border-red-500/30 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-bold mb-2">Fehler beim Laden</h3>
                        <p className="text-sm mb-4">Das Bild konnte nicht geladen werden.</p>
                        <button onClick={onClose} className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 text-white text-sm">Schließen</button>
                    </div>
                ) : (
                    <img
                        src={currentImageUrl}
                        alt="Preview"
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

