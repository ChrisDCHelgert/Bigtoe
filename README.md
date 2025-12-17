BigToe is a privacy-first AI generation tool designed for creators, artists, and enthusiasts. It enables the creation of high-fidelity, photorealistic, and fictional foot imagery for artistic or commercial projects without the need for real-world photo shoots.

> **Disclaimer:** All generated content is fictional. No real persons are depicted. This software is for creative use only.

## 🚀 Key Features

*   **Creator-Centric Workflow:** Customize every detail (arches, soles, lighting, angles) with a UI designed for artists.
*   **🇩🇪 German First:** Fully localized interface with German as the default language (English fallback available).
*   **Privacy First:** 100% anonymous generation. No data sharing.
*   **High-Fidelity AI:** Powered by advanced diffusion models tailored for realistic skin textures and lighting.
*   **Refined UI:** Dark-mode optimized with enhanced accessibility and usable dropdowns.
*   **Compliance & Safety:** Strict guardrails against non-consensual or illegal content.
*   **PWA Ready:** Installable on Desktop and Mobile.

## 🛠 Tech Stack

*   **Frontend:** React 18, TypeScript, Vite
*   **Styling:** Tailwind CSS, Lucide React
*   **State:** Local React State (Migration to Context/Zustand planned)
*   **Backend (Serverless):** Firebase (Auth, Firestore, Storage)
*   **AI Services:** Google Gemini (Prompt Engineering), Pollinations.ai (Image Synthesis)

## 🏁 Getting Started

### Prerequisites

*   Node.js 18+
*   npm 9+
*   A Firebase Project
*   A Google Cloud API Key (Gemini)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/ChrisDCHelgert/Bigtoe.git
    cd Bigtoe
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Copy the example configuration:
    ```bash
    cp .env.example .env
    ```
    Edit `.env` and populate your keys:
    *   `VITE_GOOGLE_API_KEY`: Required for prompt enhancement.
    *   `VITE_FIREBASE_*`: Required for Auth/DB.

4.  **Run Locally**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

## 🧪 Testing

Run the compliance test suite:
```bash
npm run test:security
```

## 📜 Compliance & Safety

This software includes mandatory safety mechanisms:
*   **Age Gate:** Users must verify age before access.
*   **Hard Blocks:** Forbidden terms are rejected client-side and server-side.
*   **Audit Logging:** All safety events are logged immutably.

See [compliance/policy.md](compliance/policy.md) for the full binding policy.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Built for the "Advanced Agentic Coding" Initiative.*
