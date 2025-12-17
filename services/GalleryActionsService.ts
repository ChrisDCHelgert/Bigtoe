
import { GalleryService, GalleryItem } from './GalleryService';

// Mock types for action jobs
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';
export interface JobResult {
    jobId: string;
    status: JobStatus;
    resultUrl?: string;
    error?: string;
}

export const GalleryActionsService = {
    /**
     * 1. DOWNLOAD
     * Download blob from URL to Client
     */
    downloadImage: async (imageUrl: string, filenameBase = 'bigtoe_image'): Promise<void> => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // Generate robust filename
            const ext = blob.type.split('/')[1] || 'png';
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `${filenameBase}_${timestamp}.${ext}`;

            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;

            document.body.appendChild(a);
            a.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Download failed:", error);
            throw new Error("Download fehlgeschlagen (Netzwerkfehler oder CORS).");
        }
    },

    /**
     * 2. UPSCALE (Simulation)
     * Starts an async job, polls, returns new URL.
     */
    startUpscaleJob: async (imageId: string): Promise<string> => {
        // Return a mock Job ID
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`job_upscale_${imageId}_${Date.now()}`);
            }, 500);
        });
    },

    /**
     * 3. VARIANT (Simulation)
     * Starts an async job for Aspect Ratio change
     */
    startVariantJob: async (imageId: string, aspect: '16:9' | '9:16'): Promise<string> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`job_variant_${aspect.replace(':', '-')}_${imageId}_${Date.now()}`);
            }, 500);
        });
    },

    /**
     * POLLING SIMULATION
     * Checks job status. In a real app, this hits an API endpoint.
     */
    pollJobStatus: async (jobId: string): Promise<JobResult> => {
        // Simulate processing time (random 2-4s)
        return new Promise((resolve) => {
            setTimeout(() => {
                // Mock Success
                // We'll append a query param to the original URL to make it "new" but still valid image data
                // In reality, the backend would generate a fresh image.
                resolve({
                    jobId,
                    status: 'completed',
                    resultUrl: '' // Will be filled by the caller using logic, or here if we had the original URL
                });
            }, 2000);
        });
    },

    /**
     * Helper to Create & Save the new Item
     */
    saveResultAsNewItem: (originalUrl: string, tag: string): GalleryItem => {
        // Mock new URL (append query to make unique ID possible)
        const separator = originalUrl.includes('?') ? '&' : '?';
        const newUrl = `${originalUrl}${separator}variant=${tag}`;

        return GalleryService.addImage({
            url: newUrl,
            tags: ['generated', tag]
        });
    }
};
