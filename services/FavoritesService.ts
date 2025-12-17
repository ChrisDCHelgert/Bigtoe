
export interface FavoriteImage {
    id: string; // Since we only have URLs mostly, we might use URL as ID or hash it
    url: string;
    timestamp: number;
}

const STORAGE_KEY = 'bigtoe_favorites';

export const FavoritesService = {
    getFavorites: (): FavoriteImage[] => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error("Failed to load favorites", e);
            return [];
        }
    },

    isFavorite: (url: string): boolean => {
        const favorites = FavoritesService.getFavorites();
        return favorites.some(f => f.url === url);
    },

    addFavorite: (url: string): void => {
        const favorites = FavoritesService.getFavorites();
        if (favorites.some(f => f.url === url)) return;

        const newFav: FavoriteImage = {
            id: crypto.randomUUID(),
            url,
            timestamp: Date.now()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify([newFav, ...favorites]));
    },

    removeFavorite: (url: string): void => {
        const favorites = FavoritesService.getFavorites();
        const filtered = favorites.filter(f => f.url !== url);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    },

    toggleFavorite: (url: string): boolean => {
        if (FavoritesService.isFavorite(url)) {
            FavoritesService.removeFavorite(url);
            return false; // is not favorite anymore
        } else {
            FavoritesService.addFavorite(url);
            return true; // is now favorite
        }
    }
};
