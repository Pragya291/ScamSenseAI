# ScamSense AI — Detect. Explain. Protect.

An AI-powered scam detection, threat intelligence, and cybersecurity awareness platform designed to evaluate suspicious URLs, messages, QR codes, screenshots, emails, and phone numbers.

## 🚀 Key Features

1. **4-in-1 Scan Workspace**:
   - URL, Text/SMS, Email, Phone Number, QR Code, and Screenshot OCR verification.
   - Live circular risk meter (0–100 scale), evidence flags, and safer recommended actions.

2. **Threat Intelligence Feed**:
   - Real-time advisories on active social engineering tactics (e.g. Bank OTP lures, WhatsApp giveaways, APK malware).

3. **Scan History & Export**:
   - History table with verdict filtering, search, pagination, and CSV export.

4. **Security Analytics**:
   - Interactive SVG activity trend line chart, scam distribution donut chart, and source progress bars.

5. **Profile & Account Settings**:
   - Editable personal profile initialized for **Janahvi Loke** and **Pragya Mishra**.
   - Photo upload preview, dark/light theme persistence, and multi-language support (English, Hindi, Marathi).

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite) + Tailwind CSS v4 + Lucide Icons
- **Authentication**: Firebase Authentication (Email/Password & Google OAuth) with fallback demo simulation.
- **Backend / Services**: Node.js / Express API services & Gemini AI models.

---

## 🏃 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Janahvi21/ScamSenseAI.git
cd ScamSenseAI

# Install dependencies in frontend
cd frontend
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173/`.

---

## 🔐 Environment Variables

Create a `.env` file in `frontend/` using `.env.example`:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---


---

## 📜 License & Safety Notice
ScamSense AI provides automated heuristic risk assessments for educational and defensive verification purposes.
