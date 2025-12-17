import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Search, Filter, ArrowLeft, Star, Trash2 } from 'lucide-react';

import { GalleryService, GalleryItem } from '../services/GalleryService';

interface GalleryProps {
  images?: any[]; // Legacy prop, might be redundant if we fully switch
  onToggleFavorite?: (id: string) => void;
  onDelete?: (id: string) => void;
}

import { ImageModal } from '../components/ImageModal';

// ... interface ...

export const Gallery: React.FC<GalleryProps> = ({ images = [], onToggleFavorite, onDelete }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>(GalleryService.getImages());
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const tabs = ['All', 'Favorites', 'Soles', 'Arches'];

  const displayImages = galleryImages.filter(img => {
    if (filter === 'All') return true;
    if (filter === 'Favorites') return img.isFavorite;
    return img.tags?.some(tag => tag.toLowerCase().includes(filter.toLowerCase())) || false;
  });

  const handleToggleFav = (idOrUrl: string) => {
    GalleryService.toggleFavorite(idOrUrl);
    setGalleryImages(GalleryService.getImages()); // Refresh local state
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this image?')) {
      GalleryService.deleteImage(id);
      setGalleryImages(GalleryService.getImages());
    }
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-3xl md:text-4xl font-bold">Private Gallery</h2>
          <Lock size={20} className="text-gray-500" />
        </div>
        <p className="text-sm text-gray-400">Encrypted storage. Visible only to you.</p>
      </header>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Search tags (e.g., 'soles', 'arch')..."
          className="w-full bg-brand-card border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-brand-primary outline-none"
        />
        <Filter className="absolute right-3 top-3 text-gray-500" size={18} />
      </div>

      {/* Tabs - Constrained width */}
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${filter === tab ? 'bg-brand-primary text-white' : 'bg-brand-card border border-white/10 text-gray-400'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: 2-col mobile, 3-col tablet, 4-col laptop, 5-col desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-8">
        <div
          onClick={() => navigate('/generator')}
          className="aspect-[4/5] bg-brand-card border border-white/10 rounded-xl flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:border-brand-primary/50 transition-colors"
        >
          <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center mb-2 text-brand-primary">
            <span className="text-2xl">+</span>
          </div>
          <span className="text-sm font-medium">Create New</span>
        </div>

        {displayImages.map((img, idx) => (
          <div
            key={img.id || idx}
            onClick={() => setSelectedImage(img)}
            className="aspect-[4/5] rounded-xl overflow-hidden relative group cursor-pointer bg-gray-800"
          >
            <img src={img.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Gallery item" />

            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
              <div className="flex justify-end gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); handleToggleFav(img.id); }}
                  className={`p-2 rounded-full backdrop-blur-md ${img.isFavorite ? 'bg-yellow-500 text-white' : 'bg-black/50 text-white hover:bg-yellow-500/50'}`}
                >
                  <Star size={14} fill={img.isFavorite ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(img.id); }}
                  className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedImage(img); }}
                  className="text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white hover:bg-white/30 transition-colors"
                >
                  View
                </button>
              </div>
            </div>

            {img.tag === 'Saved' && <span className="absolute top-2 left-2 bg-brand-primary text-[10px] font-bold px-2 py-0.5 rounded text-white">NEW</span>}
          </div>
        ))}
      </div>

      {/* Viewer Modal */}
      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage.url}
          showGalleryActions={true}
        />
      )}
    </div>
  );
};
