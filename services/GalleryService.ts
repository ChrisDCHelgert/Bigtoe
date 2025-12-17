
export interface GalleryItem {
    id: string;
    url: string;
    timestamp: number;
    prompt?: string;
    params?: any; // Store generation params for "Remix" features later
    isFavorite: boolean;
    tags?: string[];
}

const STORAGE_KEY = 'bigtoe_gallery_v1';

export const GalleryService = {
    // Get all images (descending timestamp)
    getImages: (): GalleryItem[] => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error("Failed to load gallery", e);
            return [];
        }
    },

    // Save a new generated image
    addImage: (item: Omit<GalleryItem, 'id' | 'timestamp' | 'isFavorite'>): GalleryItem => {
        const images = GalleryService.getImages();

        // Idempotency check: prevent saving exact same URL twice
        const existing = images.find(img => img.url === item.url);
        if (existing) return existing;

        const newItem: GalleryItem = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            isFavorite: false, // Default to false
            ...item
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify([newItem, ...images]));
        console.log("[GalleryService] Saved new image:", newItem.id);
        return newItem;
    },

    // Toggle favorite status
    toggleFavorite: (idOrUrl: string): boolean => {
        const images = GalleryService.getImages();
        const index = images.findIndex(img => img.id === idOrUrl || img.url === idOrUrl);

        if (index === -1) return false;

        const img = images[index];
        img.isFavorite = !img.isFavorite;

        // Update storage
        images[index] = img;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(images));

        return img.isFavorite;
    },

    // Delete image
    deleteImage: (id: string): void => {
        const images = GalleryService.getImages();
        const filtered = images.filter(img => img.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    },

    // Get only favorites helper
    getFavorites: (): GalleryItem[] => {
        return GalleryService.getImages().filter(img => img.isFavorite);
    }
};
