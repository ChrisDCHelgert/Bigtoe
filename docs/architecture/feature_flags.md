# Feature Flag Strategy

**System:** BigToe Config
**Tool:** Firebase Remote Config (Client) / Envrionment Variables (Server)

---

## 1. Flags Definition

| Key | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `enable_vertex_imagen` | boolean | `false` | Master switch for the Vertex AI Provider. |
| `vertex_rollout_percentage` | number | `0` | Gradual rollout (0-100%). |
| `max_resolution_free` | number | `1024` | Max pixel dimension for non-premium. |
| `enable_inpaint` | boolean | `false` | Experimental editor features. |

---

## 2. Rollout Strategy (Vertex AI)

### Phase 1: Internal (Dev)
*   `enable_vertex_imagen`: `true`
*   Target: `user_email` IN verified_testers

### Phase 2: Canary (Pro Users)
*   `enable_vertex_imagen`: `true`
*   Target: `user_property.plan` == 'pro' AND `random_percent` < 10.

### Phase 3: Full Pro Rollout
*   `enable_vertex_imagen`: `true`
*   Target: `user_property.plan` == 'pro'

---

## 3. Implementation

```typescript
// services/config.ts
export const getFeatureFlag = (key: string, defaultValue: any) => {
  // 1. Check Env Vars (Dev Override)
  // 2. Check Remote Config Cache
  // 3. Return Default
}
```
