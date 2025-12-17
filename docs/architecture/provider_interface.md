# Image Provider Interface

**Version:** 1.0
**Pattern:** Adapter / Facade

---

## 1. Core Interface

```typescript
export interface ImageProvider {
  /**
   * Unique identifier for the provider (e.g., 'vertex-imagen', 'pollinations').
   */
  readonly id: string;

  /**
   * Returns validation result for a givenprompt.
   * Does NOT generate the image.
   */
  validatePrompt(prompt: string): Promise<ValidationResult>;

  /**
   * Generates an image based on the request.
   * Returns a standard ImageAsset structure.
   */
  generateImage(request: GenerationRequest): Promise<GenerationResult>;

  /**
   * Returns capabilities to help the abstractor decide if this provider
   * can handle the current request.
   */
  getCapabilities(): ProviderCapabilities;
}
```

---

## 2. Common Types

### `GenerationRequest`
*   `prompt`: string (Enhanced/Final)
*   `negativePrompt`: string
*   `width`: number
*   `height`: number
*   `params`: `GeneratorParams` (Raw user inputs for metadata)
*   `identityToken`?: string (For authenticated quotas)

### `GenerationResult`
*   `url`: string (Signed or Public)
*   `provider`: string
*   `metadata`: any
*   `cost`: number (Estimated internal cost)

### `ValidationResult`
*   `isValid`: boolean
*   `flags`: string[] (e.g. ['NSFW', 'HATE_SPEECH'])
*   `rawResponse`?: any

---

## 3. Provider Specifics

### `PrimaryProvider` (Vertex AI)
*   **Auth:** Server-Side (Cloud Function Facade).
*   **Safety:** Strict. Returns specific blocked categories.
*   **Usage:** Production / Premium Users.

### `FallbackProvider` (Pollinations)
*   **Auth:** None / Public URL.
*   **Safety:** Client-side Regex only.
*   **Usage:** Free Tier / Dev / Disaster Recovery.

---

## 4. Selection Logic

```typescript
if (FeatureFlags.ENABLE_VERTEX && user.isPremium) {
  return VertexProvider;
} else {
  return PollinationsProvider;
}
```
