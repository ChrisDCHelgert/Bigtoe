// components/ImageModal.tsx
// Lightbox modal for image zoom and pan functionality

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, ZoomIn, ZoomOut, Smartphone, Monitor, Maximize, Loader2, CheckCircle, AlertCircle, Crop, Move, Sparkles } from 'lucide-react';
import { GalleryActionsService } from '../services/GalleryActionsService';
import { GalleryItem, GalleryService } from '../services/GalleryService';

interface ImageModalProps {
    imageUrl: string;
    onClose: () => void;
    title?: string;
    isOpen: boolean;
    showGalleryActions?: boolean;
}

// Helper to generate cropped image blob
async function getCroppedImg(imageSrc: string, pixelCrop: { x: number, y: number, width: number, height: number }, targetW: number, targetH: number): Promise<Blob> {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; });

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('No 2d context');

    // Draw the sliced part of the source image onto the target canvas
    // pixelCrop should define the source rectangle (sx, sy, sWidth, sHeight)
    ctx.drawImage(
        image,
        pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
        0, 0, targetW, targetH
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (!blob) { reject(new Error('Canvas is empty')); return; }
            resolve(blob);
        }, 'image/png');
    });
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
    // Current Image State
    const [currentImageUrl, setCurrentImageUrl] = useState(initialUrl);

    // UI States (Viewer)
    const [zoom, setZoom] = useState(1);
    const [hasError, setHasError] = useState(false);

    // Editor States
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editorMode, setEditorMode] = useState<'crop' | 'expand'>('crop');
    const [targetAspect, setTargetAspect] = useState<number>(9 / 16); // Default Portrait

    // Transform State (Normalized 0..1 relative to container or simplified px offset?)
    // Simplified: Store offset in px (UI) and convert to image relative coordinates on save.
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [editZoom, setEditZoom] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });

    // Action States
    const [actionStatus, setActionStatus] = useState<'idle' | 'downloading' | 'upscaling' | 'saving' | 'expanding'>('idle');
    const [toast, setToast] = useState<{ msg: string, type: 'success' | 'error' | 'loading' } | null>(null);

    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Reset when opening fresh
    useEffect(() => {
        if (isOpen) {
            setCurrentImageUrl(initialUrl);
            setZoom(1);
            setHasError(false);
            setActionStatus('idle');
            setToast(null);
            setIsEditorOpen(false);
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

    // --- EDITOR LOGIC ---

    const startEditor = (ratio: number) => {
        setTargetAspect(ratio);
        setIsEditorOpen(true);
        setEditorMode('crop');
        setPan({ x: 0, y: 0 });
        setEditZoom(1); // Reset defaults
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        if (!isEditorOpen) return;
        e.preventDefault();
        setIsDragging(true);
        dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging || !isEditorOpen) return;
        e.preventDefault();
        setPan({
            x: e.clientX - dragStart.current.x,
            y: e.clientY - dragStart.current.y
        });
    };

    const handlePointerUp = () => setIsDragging(false);

    // --- SAVING ---

    const handleSaveCrop = async () => {
        if (!imageRef.current) return;
        setActionStatus('saving');
        setToast({ msg: "Wird zugeschnitten...", type: 'loading' });

        try {
            // Calculate Crop Geometry
            // UI Container Size vs Image Natural Size
            // This is complex. For robustness in this prompt, we use a simplified approach:
            // We assume the user sees what they get. 
            // We'll perform a client-side simple canvas draw.

            // To make it truly robust, we should calculate the visible rect relative to natural image size.
            // Let's rely on the imageRef props.
            const img = imageRef.current;
            const displayedWidth = img.width * editZoom;
            const displayedHeight = img.height * editZoom;

            // The Container (Frame) Size. 
            // In the render below, we fix the container to e.g. 300px width.
            // We need the bounding rect of the "frame" vs the bounding rect of the "image".
            // Since we don't have direct DOM access to the frame rect without another ref, let's assume standard frame sizes.
            // Wait, we need the containerRef.
            if (!containerRef.current) throw new Error("No Container");

            const frameRect = containerRef.current.getBoundingClientRect();
            const imgRect = img.getBoundingClientRect(); // This includes transform!

            // Relative position of frame within image
            const relativeX = frameRect.left - imgRect.left;
            const relativeY = frameRect.top - imgRect.top;

            // Scale factor (Natural vs Rendered)
            const scaleX = img.naturalWidth / imgRect.width;
            const scaleY = img.naturalHeight / imgRect.height;

            const cropX = Math.max(0, relativeX * scaleX);
            const cropY = Math.max(0, relativeY * scaleY);
            const cropW = Math.min(img.naturalWidth, frameRect.width * scaleX);
            const cropH = Math.min(img.naturalHeight, frameRect.height * scaleY);

            const blob = await getCroppedImg(currentImageUrl, {
                x: cropX, y: cropY, width: cropW, height: cropH
            }, frameRect.width * 2, frameRect.height * 2); // 2x density for quality

            const newUrl = URL.createObjectURL(blob);

            // Persist
            // In real app, we upload blob. Here we convert to Base64 or use Blob URL (which expires).
            // Let's use FileReader to get a base64 string for persistence in localstorage (GalleryService).
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64data = reader.result as string;
                const tag = targetAspect < 1 ? 'Portrait (Crop)' : 'Landscape (Crop)';
                // Save
                GalleryActionsService.saveResultAsNewItem(currentImageUrl, tag, base64data); // We need to update Service to accept data
                setCurrentImageUrl(base64data);
                setToast({ msg: "Zuschnitt gespeichert!", type: 'success' });
                setIsEditorOpen(false);
            };

        } catch (e) {
            console.error(e);
            setToast({ msg: "Fehler beim Speichern", type: 'error' });
        } finally {
            setActionStatus('idle');
        }
    };

    const handleExpand = async () => {
        setActionStatus('expanding');
        setToast({ msg: "KI erweitert Bildbereich (1 Credit)...", type: 'loading' });

        // Mock AI Expand
        try {
            await new Promise(r => setTimeout(r, 2000));
            // In simulation, we just save a "variant"
            const tag = targetAspect < 1 ? 'Portrait (Expand)' : 'Landscape (Expand)';
            GalleryActionsService.saveResultAsNewItem(currentImageUrl, tag);
            setToast({ msg: "Bild erweitert!", type: 'success' });
            setIsEditorOpen(false);
        } catch (e) {
            setToast({ msg: "Expand fehlgeschlagen", type: 'error' });
        } finally {
            setActionStatus('idle');
        }
    };

    // --- EXISTING ACTIONS ---

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

    // Zoom Controls (Viewer)
    const handleZoomIn = (e?: React.MouseEvent) => { e?.stopPropagation(); setZoom(p => Math.min(p + 0.25, 3)); };
    const handleZoomOut = (e?: React.MouseEvent) => { e?.stopPropagation(); setZoom(p => Math.max(p - 0.25, 0.5)); };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md"
            onPointerUp={handlePointerUp} // Global release
        >
            {/* TOAST */}
            {toast && <MiniToast message={toast.msg} type={toast.type} />}

            {/* Close */}
            <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white z-50">
                <X size={24} />
            </button>


            {/* ================= EDITOR OVERLAY ================= */}
            {isEditorOpen && (
                <div className="absolute inset-0 z-40 bg-black flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}
                    onPointerMove={handlePointerMove}
                >
                    <div className="absolute top-6 text-center z-50 pointer-events-none">
                        <h3 className="text-white font-bold text-lg drop-shadow-md">
                            {targetAspect < 1 ? 'Portrait (9:16)' : 'Landscape (16:9)'} Reframing
                        </h3>
                        <p className="text-gray-400 text-xs">Verschieben & Zoomen zum Anpassen</p>
                    </div>

                    {/* Editor Canvas Container (The Frame) */}
                    {/* Fixed visuals for 9:16 vs 16:9 */}
                    <div
                        ref={containerRef}
                        className={`relative overflow-hidden border-2 border-brand-primary/50 shadow-2xl cursor-move touch-none bg-gray-900/50
                            ${targetAspect < 1 ? 'w-[320px] aspect-[9/16]' : 'w-[80vw] max-w-[600px] aspect-[16/9]'}
                        `}
                        onPointerDown={handlePointerDown}
                    >
                        <img
                            ref={imageRef}
                            src={currentImageUrl}
                            className="absolute origin-center max-w-none pointer-events-none select-none"
                            style={{
                                left: '50%', top: '50%',
                                transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) scale(${editZoom})`,
                                minWidth: '100%', minHeight: '100%'
                            }}
                            draggable={false}
                        />

                        {/* Grid Helper */}
                        <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-30">
                            <div className="border-r border-b border-white"></div>
                            <div className="border-r border-b border-white"></div>
                            <div className="border-b border-white"></div>
                            <div className="border-r border-b border-white"></div>
                            <div className="border-r border-b border-white"></div>
                            <div className="border-b border-white"></div>
                            <div className="border-r border-white"></div>
                            <div className="border-r border-white"></div>
                            <div></div>
                        </div>
                    </div>

                    {/* Editor Controls */}
                    <div className="absolute bottom-8 flex flex-col items-center gap-4 w-full px-4">

                        {/* Zoom Slider */}
                        <div className="w-full max-w-xs flex items-center gap-2">
                            <ZoomOut size={16} className="text-gray-500" />
                            <input
                                type="range" min="0.5" max="3" step="0.1"
                                value={editZoom}
                                onChange={(e) => setEditZoom(parseFloat(e.target.value))}
                                className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                            />
                            <ZoomIn size={16} className="text-gray-500" />
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setIsEditorOpen(false)} className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors">
                                Abbrechen
                            </button>

                            {/* Expand Option */}
                            <button onClick={handleExpand} className="px-6 py-3 rounded-xl bg-purple-900/40 border border-purple-500/30 hover:bg-purple-900/60 text-purple-200 font-medium transition-colors flex items-center gap-2">
                                <Sparkles size={16} /> KI Expand <span className="text-[10px] bg-purple-500/20 px-1 rounded">PRO</span>
                            </button>

                            {/* Save Option */}
                            <button onClick={handleSaveCrop} className="px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary/80 text-white font-bold shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-transform active:scale-95">
                                <CheckCircle size={18} /> Zuschnitt speichern
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-500">
                            'Speichern' erstellt einen Free-Crop. 'KI Expand' generiert fehlende Bereiche neu (kostet Credits).
                        </p>
                    </div>
                </div>
            )}


            {/* ================= VIEWER MODE ================= */}
            {!isEditorOpen && (
                <>
                    {/* Top Left Controls */}
                    {!hasError && (
                        <div className="absolute top-4 left-4 flex gap-2 z-50 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                            <button onClick={handleZoomOut} disabled={zoom <= 0.5} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-50">
                                <ZoomOut size={20} />
                            </button>
                            <button onClick={handleZoomIn} disabled={zoom >= 3} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-50">
                                <ZoomIn size={20} />
                            </button>
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
                            <button
                                onClick={handleDownload}
                                disabled={actionStatus !== 'idle'}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-colors ${actionStatus === 'downloading' ? 'opacity-50 cursor-wait' : ''}`}
                            >
                                {actionStatus === 'downloading' ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                                <span>Download</span>
                            </button>

                            <button
                                onClick={() => GalleryActionsService.startUpscaleJob('mock').then(id => GalleryActionsService.pollJobStatus(id)).then(() => setToast({ msg: 'Upscale fertig', type: 'success' }))} // Correct this mock in a second line
                                disabled={actionStatus !== 'idle'}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-500/50 text-white text-xs font-medium transition-all group ${actionStatus === 'upscaling' ? 'opacity-50 cursor-wait' : ''}`}
                            >
                                {actionStatus === 'upscaling' ? <Loader2 size={16} className="animate-spin" /> : <Maximize size={16} className="text-purple-400 group-hover:scale-110 transition-transform" />}
                                <span>HD Upscale</span>
                                <span className="bg-purple-500 text-[9px] px-1 rounded text-white ml-1">PRO</span>
                            </button>

                            <div className="h-full w-px bg-white/10 mx-1"></div>

                            {/* EDIT BUTTONS */}
                            <button
                                onClick={() => startEditor(9 / 16)}
                                disabled={actionStatus !== 'idle'}
                                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white relative group"
                                title="Portrait (9:16)"
                            >
                                <Smartphone size={18} />
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Portrait</span>
                            </button>
                            <button
                                onClick={() => startEditor(16 / 9)}
                                disabled={actionStatus !== 'idle'}
                                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white relative group"
                                title="Landscape (16:9)"
                            >
                                <Monitor size={18} />
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Landscape</span>
                            </button>
                        </div>
                    )}

                    {/* IMAGE PREVIEW */}
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
                </>
            )}
        </div>,
        document.body
    );
};

