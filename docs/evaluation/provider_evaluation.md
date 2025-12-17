# Image Provider Evaluation Matrix

**Date:** 2025-12-17
**Application:** BigToe AI (High Fidelity / Compliance Critical)

---

## 1. Provider Matrix

| Feature | **Pollinations.ai (Current)** | **Vertex AI Imagen 3** | **Gemini Developer API (Imagen)** | **OpenAI DALL-E 3** |
| :--- | :--- | :--- | :--- | :--- |
| **Quality (Photorealism)** | Good (SDXL/Flux) | **Excellent** (SOTA) | Very Good | Excellent |
| **Anatomy Handling** | Inconsistent (5-6 toes common) | **Superior** | Good | Good |
| **Latency** | 5-10s | 8-12s | 10-15s | 15s+ |
| **Cost** | Free / Low | Moderate (~$0.04/img) | Moderate | High (~$0.04-$0.08) |
| **Safety Filters** | Weak (Reliance on Prompt) | **Strict (Enterprise)** | Strict | Strict |
| **Compliance** | No Indemnification | **Google Indemnification** | Google Terms | Microsoft Terms |
| **Rate Limits** | Varies | High (Quota based) | Moderate | Moderate |
| **Integration** | URL-based (Simple) | IAM / Server-Side (Complex) | API Key (Simple) | API Key (Simple) |

---

## 2. Analysis

### Vertex AI Imagen 3 (Fast/High Quality)
*   **Pros:** Best-in-class photorealism, enterprise-grade safety filters (Person Filter, NSFW filter), high reliability. Data sovereignty options.
*   **Cons:** Requires Google Cloud Project, Service Account, and enabled APIs. Higher implementation complexity than a simple API key.
*   **Compliance:** Top tier. Filter levels can be adjusted (within reason) but generally default to "Safe".

### Gemini Developer API (Imagen)
*   **Pros:** Simple integration (same API key as text model). Good quality.
*   **Cons:** Rate limits can be restrictive for production apps without heavy quota upgrades.
*   **Compliance:** Standard consumer safety policies.

### Pollinations.ai (Flux/SDXL)
*   **Pros:** Very fast, easy to use, diverse models.
*   **Cons:** "Wild West" of safety. Requires us to build *all* the guardrails. Quality varies heavily.
*   **Compliance:** Risky for a strict policy app.

---

## 3. Recommendation

### **Primary Provider: Vertex AI Imagen 3**
*   **Reason:** The "Quality vs. Compliance" tradeoff is best handled here. We need the specific "Person/Face/NSFW" filters that Google provides out-of-the-box to enforce our 18+ but Safe policy. The photorealism is unmatched for the use case.

### **Fallback Provider: Pollinations.ai (Flux)**
*   **Reason:** Use only if Vertex is down or Quota exceeded. Must warn user that quality might vary.

### **Strategy:**
1.  Implement **Server-Side Generation** (Cloud Function).
2.  Client sends prompt -> Backend validates -> Backend calls Vertex AI -> Returns signed URL.
3.  **Feature Flag:** `ENABLE_VERTEX_IMAGEN=true`.
