/**
 * Centralized configuration module.
 * Manages environment variables and application constants.
 */

export const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';

if (!GOOGLE_API_KEY) {
    console.warn('⚠️ Kein Google API-Schlüssel konfiguriert (VITE_GOOGLE_API_KEY fehlt in .env)');
} else {
    // console.log('✅ Google API-Schlüssel geladen'); // Optional: for debugging
}
