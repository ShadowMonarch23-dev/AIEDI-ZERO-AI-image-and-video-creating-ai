# AIEDI-ZERO-AI-image-and-video-creating-ai
# AIEDI ZERO - Unbound Synthesis Terminal

![Version](https://img.shields.io/badge/Version-3.1_Zero-FF006E?style=for-the-badge)
![Engine](https://img.shields.io/badge/Engine-Gemini_&_Veo-000?style=for-the-badge&logo=google)

**AIEDI ZERO** is a high-performance, cyberpunk-industrial interface designed for unrestricted visual synthesis. By leveraging the latest Gemini 2.5 and Veo 3.1 models, the terminal provides a direct conduit for generating cinematic motion and high-fidelity static assets with minimal safety constraints.

## 🛠 Core Protocols

- **Static Synthesis**: Powered by `gemini-2.5-flash-image`. Optimized for near-instant high-resolution image generation.
- **Motion Synthesis**: Powered by `veo-3.1-fast-generate-preview`. Generates cinematic 720p video sequences from text or image prompts.
- **Zero-Filter Logic**: Implements `BLOCK_NONE` safety thresholds across all categories (Harassment, Hate Speech, Sexually Explicit, Dangerous Content) to provide a raw, unbound creative experience.
- **Seed Buffer**: Support for image-to-image and image-to-video workflows.

## 🚀 Technical Architecture

- **Frontend**: React 19 + TypeScript + Tailwind CSS.
- **AI Core**: `@google/genai` (SDK v1.35.0).
- **Environment**: ESM-native browser execution with zero build step requirements via importmaps.
- **Persistence**: Local history buffering via `localStorage`.

## ⚙️ Installation & Setup

### Environment Variables
The application expects `process.env.API_KEY` to be available. For **Motion Synthesis** (Veo), the system utilizes an integrated Kernel Access protocol requiring a paid-tier API key.

### Local Execution
1. Clone the repository.
2. Serve the root directory using any local web server (e.g., `npx serve .` or Live Server).
3. The `importmap` in `index.html` will automatically resolve all dependencies from `esm.sh`.

## 🕹 Usage Guide

1. **Select Modality**: Toggle between **Static** (Images) and **Motion** (Video) via the dashboard.
2. **Inject Prompt**: Enter your synthesis parameters in the Command Center.
3. **Configure Geometry**: Select desired aspect ratios (1:1, 16:9, 9:16, etc.). Note: Video synthesis is locked to cinematic 16:9 or vertical 9:16.
4. **Seed Buffer (Optional)**: Upload an image to serve as a visual anchor for the generation.
5. **Synthesize**: Execute the protocol.
   - *Note*: If synthesizing video for the first time, you will be prompted to authenticate via the **Kernel Access Required** overlay. Follow the prompts to select a billing-enabled API key.

## ⚠️ Protocol Notices

- **Safety Settings**: This terminal explicitly overrides default safety guardrails (`BLOCK_NONE`). Users are responsible for the content generated.
- **API Billing**: Motion Synthesis (Veo) can incur costs on your GCP project. Monitor your usage at the [Google AI Studio Dashboard](https://aistudio.google.com/).
- **Persistence**: Asset history is stored locally in your browser. Clearing browser data will purge the history buffer.

---
*SYS_MSG: Protocol initialized. Awaiting creative injection.*
