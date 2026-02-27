# DeepShield AI 🛡️

> **Free AI-powered deepfake & synthetic media detector — built for everyone.**

DeepShield AI uses a dual-model approach (EfficientNet-B4 face-swap detector + SDXL AI-generation detector) to identify deepfakes, AI-generated images, cloned voices, and manipulated videos in seconds.

---

## 🔥 Features

- 🖼️ **Image Detection** — Face-swap deepfakes, AI-generated images (SDXL, Midjourney, DALL-E, etc.)
- 🎬 **Video Detection** — Frame-by-frame dual-model analysis with temporal consistency checks
- 🎙️ **Audio Detection** — Voice clone detection via spectral entropy & prosody fingerprinting
- ⚡ **Instant Results** — Real AI analysis in seconds with a fully deterministic verdict
- 🔒 **Privacy First** — Files are analyzed locally, never stored, never sent to external servers
- 📊 **Detailed Breakdown** — Per-check anomaly scores with confidence levels and downloadable reports

---

## 🧠 AI Models Used

| Model | Purpose |
|---|---|
| `dima806/deepfake_vs_real_image_detection` | Face-swap & facial deepfake detection (EfficientNet-B4) |
| `Organika/sdxl-detector` | AI-generated synthetic content detection |
| `OpenCV Haar Cascade` | Face region extraction before classification |

**Scoring:** Weighted average: `0.65 × M1 + 0.35 × M2`  
**Thresholds:** > 60% → DEEPFAKE DETECTED · 42–60% → SUSPICIOUS · < 42% → AUTHENTIC

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 7 + CSS Modules |
| Backend | Python 3, Flask, HuggingFace Transformers |
| ML | PyTorch (CPU), EfficientNet-B4 |
| Computer Vision | OpenCV (face detection) |
| Fonts | Inter + Space Grotesk (Google Fonts) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ (for frontend)
- **Python** 3.9+ (for backend)
- **pip** (Python package manager)

---

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/deepshield-ai.git
cd deepshield-ai
```

---

### 2. Start the Frontend

```bash
# Install dependencies
npm install

# Start dev server (runs on http://localhost:5173)
npm run dev
```

---

### 3. Start the Backend (Python AI Server)

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the Flask server (runs on http://localhost:5000)
python server.py
```

> ⚠️ **First run:** The server will automatically download the AI models (~1–2 GB) from HuggingFace. This only happens once — they are cached locally after that.

---

### 4. Open the app

Once both servers are running, open your browser at:

```
http://localhost:5173
```

Upload any image, video, or audio file and click **"Analyse with Real AI"** to get results.

---

## 📁 Project Structure

```
deepshield-ai/
├── index.html              # HTML entry point
├── vite.config.js          # Vite config
├── package.json            # Frontend dependencies
│
├── src/
│   ├── main.jsx            # React entry point
│   ├── App.jsx             # Root app & CTA section
│   ├── index.css           # Global design system (CSS variables, animations)
│   ├── App.module.css
│   │
│   ├── components/
│   │   ├── Navbar.jsx/.css         # Responsive navbar with mobile hamburger
│   │   ├── Hero.jsx/.css           # Hero section with animated scan card
│   │   ├── Ticker.jsx/.css         # Live threat feed ticker
│   │   ├── Features.jsx/.css       # Feature cards
│   │   ├── HowItWorks.jsx/.css     # Step-by-step process
│   │   ├── Detector.jsx/.css       # 🔬 Main AI detector UI (file upload, results)
│   │   ├── Stats.jsx/.css          # Animated statistics
│   │   ├── Tips.jsx/.css           # Safety tips
│   │   ├── About.jsx/.css          # About / mission
│   │   ├── Footer.jsx/.css         # Footer with links
│   │   └── ParticleCanvas.jsx/.css # Background particle animation
│   │
│   └── hooks/
│       └── useInView.js    # Intersection Observer hook (scroll animations)
│
└── backend/
    ├── server.py           # Flask API server (main backend)
    ├── requirements.txt    # Python dependencies
    └── test_model.py       # Diagnostic tool for model label verification
```

---

## 🔌 API Reference

### `POST /analyze`
Upload a file for deepfake analysis.

**Request:** `multipart/form-data` with field `file`  
**Supported types:** Images (JPG, PNG, WEBP, GIF), Videos (MP4, MOV, AVI, WEBM), Audio (MP3, WAV, AAC, OGG)

**Response:**
```json
{
  "verdict": "DEEPFAKE DETECTED | SUSPICIOUS | AUTHENTIC",
  "confidence": 87.3,
  "risk": "HIGH | MEDIUM | LOW | UNKNOWN",
  "desc": "Human-readable summary of findings",
  "breakdown": [
    { "name": "ML Deepfake Classifier", "score": 91, "label": "HIGH", "color": "#f72585" },
    ...
  ],
  "file_hash": "abc123...",
  "faces_found": 2,
  "no_face": false
}
```

### `GET /health`
Returns server status and loaded models.

---

## ⚠️ Disclaimer

DeepShield AI is built for **educational and public safety purposes only**.  
Results are probabilistic — not legally conclusive. Always verify from the original source.  
No files are stored. All analysis is performed locally on your machine.

---

## 🏆 Built for Hackathon

Built with ❤️ to fight misinformation and synthetic media manipulation.

---

*© 2026 DeepShield AI — Built to defend digital truth. Free forever.*
