# DermAI: Offline-First Skin Diagnostic Intelligence

DermAI is a robust, offline-first healthcare application designed for rural India. It provides instant, on-device screening for 12 skin conditions using TensorFlow Lite, empowering both patients and ASHA workers with clinical-grade AI insights without requiring internet connectivity.

## 🚀 Key Features
- **Offline AI Engine**: Real-time TFLite inference for skin disease detection.
- **Dual Interface**:
  - **Patient Portal**: Simple, high-contrast UI for self-screening.
  - **ASHA Dashboard**: Batch scanning and community health tracking.
- **100% Privacy**: All processing occurs on-device; no clinical data ever leaves the phone.
- **Expo & React Native**: Built for high performance and cross-platform reliability.

## 🛠️ Technology Stack
- **Framework**: Expo / React Native
- **AI/ML**: TensorFlow.js / TFLite
- **Storage**: AsyncStorage (Offline-first)
- **UI/UX**: React Native Reanimated & Lucide Icons

## 📦 Getting Started

### Prerequisites
- Node.js (LTS)
- npm or pnpm
- Expo Go app on your mobile device

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/harshithGowda735/AROGYA-AI.git
   cd AROGYA-AI
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Scan the QR code using the **Expo Go** app to preview.

## 📱 Build for Android (APK)
To generate a production-ready APK:
```bash
eas build -p android --profile preview
```

## 📄 License
This project is part of the Arogya AI initiative.
