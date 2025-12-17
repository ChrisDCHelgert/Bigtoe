# BigToe: AI Image Generation Platform

> **Note:** This project enforces a strict [Content & Compliance Policy](compliance/policy.md). It is designed as a creative tool for photorealistic aesthetics, NOT for generating non-consensual, illegal, or abusive content.

BigToe is a Progressive Web Application (PWA) that leverages Generative AI to create high-fidelity, photorealistic images based on structured user inputs. It features a robust credit-based monetization system, private asset libraries, and enterprise-grade compliance guardrails.

## 🚀 Key Features

*   **Advanced Generation Engine:** Utilizes SDXL/Flux pipelines via Pollinations.ai and Gemini-enhanced prompting.
*   **Compliance-First Architecture:** Integrated "Prompt Guard" to prevent policy violations before they happen.
*   **Private Library:** User assets are stored in isolated, access-controlled buckets.
*   **Entitlements System:** Credit wallet and subscription management divorced from content logic.
*   **PWA Ready:** Responsive design for Desktop and Mobile with install capabilities.

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
