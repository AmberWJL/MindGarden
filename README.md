# 🌿 MindGarden

MindGarden is a spatial digital garden where your thoughts and ideas are nurtured by AI. Using Google Gemini 3 Flash and Pro, MindGarden transforms your text inputs into visual "plants," categorizes them, and provides insightful reflections and actionable next steps.

**Available on Web & iOS/Android (React Native)**

View the web app in AI Studio: [MindGarden App](https://ai.studio/apps/drive/1i1GVIO2sZ6qM7quypzeJDmXS3OkUCAJa)

## ✨ Key Features

- **Spatial Garden Visualization**: Organize your thoughts in a beautiful, interactive 2D garden layout.
- **AI-Powered Growth**: Thoughts evolve through different growth stages (Seed, Sprout, Bloom, Fruit) as you interact with them.
- **Intelligent Reflection**: Gemini 3 Flash analyzes your thoughts to identify emotions, intents, and provides metaphors.
- **Symbolic AI Art**: Gemini 3 Pro Image generates unique botanical-inspired watercolor art for every thought.
- **Actionable Next Steps**: Automatically generates suggestions for what to "do," "clarify," or "reflect" on next.
- **Categorization**: Automatically maps thoughts to 4 garden zones: **Duties** (todo), **Ideas**, **Feelings**, and **Goals**.

## 🛠️ Tech Stack

### Web
- **Frontend**: React 19, Vite, TailwindCSS
- **Fonts**: Playfair Display (serif), Outfit (sans-serif)
- **Animation**: Framer Motion
- **AI**: Google Gemini 3 Flash (Text) & Gemini 3 Pro (Image) via `@google/genai`
- **Storage**: IndexedDB (via `idb-keyval`) and Supabase integration
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Mobile (React Native)
- **Framework**: Expo
- **Fonts**: @expo-google-fonts/playfair-display, @expo-google-fonts/outfit
- **UI**: React Native components with custom styling
- **Icons**: lucide-react-native
- **Storage**: Shared services with web (IndexedDB/Supabase)

## 🚀 Run Locally

### Web App

**Prerequisites:** Node.js (v18+)

1.  **Clone and Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Environment Setup**:
    Create a `.env.local` file and add your Gemini API key:
    ```env
    VITE_GEMINI_API_KEY=your_api_key_here
    ```
3.  **Launch the Garden**:
    ```bash
    npm run dev
    ```

### Mobile App

1.  **Navigate to mobile directory**:
    ```bash
    cd mobile
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Setup**:
    Create a `.env` file in the mobile directory:
    ```env
    EXPO_PUBLIC_GEMINI_API_KEY=your_api_key_here
    ```
4.  **Start Expo**:
    ```bash
    npx expo start
    ```
5.  **Run on device**:
    - Scan QR code with Expo Go app (iOS/Android)
    - Or press `i` for iOS simulator / `a` for Android emulator

## 🏗️ Architecture

For a deep dive into how MindGarden is built, see [ARCHITECTURE.md](./ARCHITECTURE.md).
