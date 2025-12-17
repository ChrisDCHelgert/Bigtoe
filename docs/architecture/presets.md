# Quality Presets Strategy

**Version:** 1.0
**Goal:** Simplify UI for users while maximizing provider capabilities based on Entitlements.

---

## 1. Preset Definitions

| Preset Name | ID | Description | Entitlement | Intended Use |
| :--- | :--- | :--- | :--- | :--- |
| **Standard** | `standard` | Fast, good for drafting. | Free / Basic | Concepts, Quick iterations. |
| **High Quality** | `high_quality` | Better lighting, sharper details. | Basic / Pro | Final output for sharing. |
| **Ultra** | `ultra` | Maximum resolution, enhanced steps. | Pro (Premium) | Large prints, Portfolio. |

---

## 2. Technical Mapping

### A. Pollinations (Fallback Provider)

| Preset | Resolution | Steps | Guidance | Model Tag |
| :--- | :--- | :--- | :--- | :--- |
| `standard` | 1024x768 | Default | Default | `flux` |
| `high_quality` | 1280x960 | High | High | `flux-realism` |
| `ultra` | 1920x1080 | Max | Max | `flux-pro` |

### B. Vertex AI (Primary Provider)

| Preset | Resolution | Aspect Ratio | Sample Count | Model Version |
| :--- | :--- | :--- | :--- | :--- |
| `standard` | 1024x1024 | 1:1 | 1 | `imagen-3.0-fast` |
| `high_quality` | 1280x720 | 16:9 | 2 | `imagen-3.0` |
| `ultra` | 2048x1536 | 4:3 | 4 | `imagen-3.0-ultra` |

---

## 3. Entitlement Logic

*   **Free User:** Can see all, but `high_quality` and `ultra` are **Locked** (padlock icon).
*   **Basic User:** Can use `standard` and `high_quality`. `ultra` is Locked.
*   **Pro User:** Unrestricted access.

---

## 4. UI Implementation (Generator)

*   **Removed:** "Realism" Toggle (Anime/Photo), "Steps" Slider (if any), "Resolution" Selector.
*   **Added:** "Quality" Dropdown (or Radio Cards).
*   **Text:** "Standard (1 Credit)", "High Quality (3 Credits)", "Ultra (5 Credits)".
