<div align="center">
<img width="1200" height="475" alt="MindGarden Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🌿 MindGarden

**Plant a thought, watch it grow into art.**

MindGarden is an AI-powered reflective journaling application that transforms your thoughts into living botanical illustrations. Using advanced AI (Gemini 3), each thought you plant becomes a unique piece of generative art that evolves through growth stages as you reflect and update it over time.

---

## ✨ Features

- 🎨 **AI-Generated Botanical Art** - Every thought becomes a unique watercolor plant illustration
- 🌱 **Growth Stages** - Thoughts evolve from seed → sprout → bloom → fruit
- 🤖 **Poetic Reflections** - AI analyzes your thoughts and generates insightful reflections
- 💡 **Actionable Next Steps** - Get AI-suggested actions: do, clarify, or reflect
- 🏝️ **Visual Garden** - Organize thoughts spatially on beautiful floating islands
- 💧 **Watering System** - Add updates to thoughts and watch them grow
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🔐 **Privacy-First** - Local storage by default, optional cloud sync with Supabase
- 🎭 **Emotion Tracking** - Each thought is tagged with emotional qualities
- 📊 **Multiple Views** - Switch between immersive garden view and organized list view
- 🎵 **Mood-based Music** (optional) - AI suggests Spotify tracks that match your thought’s mood

---

## 🎯 What Makes It Special

Unlike traditional journaling apps, MindGarden:
- **Visualizes thoughts spatially** rather than chronologically
- **Creates unique art** for each thought using generative AI
- **Encourages revisiting** through the "watering" metaphor
- **Provides AI companionship** with thoughtful reflections and suggestions
- **Celebrates growth** by showing visual evolution through stages

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- A Gemini API key from [Google AI Studio](https://aistudio.google.com)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up your API key:**
   
   Create a `.env` file in the project root:
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Run the app:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173`

---

## 📖 Documentation

- **[USER_GUIDE.md](USER_GUIDE.md)** - Complete user manual with tips and best practices
- **[DOCUMENTATION.md](DOCUMENTATION.md)** - Technical documentation and architecture diagrams
- **[DEPLOY_VERCEL.md](DEPLOY_VERCEL.md)** - Deploy to Vercel step-by-step
- **[DEMO_SCRIPT.md](DEMO_SCRIPT.md)** - Demo script and talking points

---

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS + Custom Design System
- **Animations**: Framer Motion
- **AI**: Google Gemini 3 Flash (text) + Imagen (visual generation)
- **Storage**: Hybrid (IndexedDB local + optional Supabase cloud)
- **Icons**: Lucide React

---

## 🌱 How It Works

1. **Plant** - Write a thought and select a category (idea, todo, worry, feeling, goal, memory)
2. **AI Magic** - Gemini analyzes your thought, generates a reflection, and creates botanical art
3. **Garden** - Your thought appears as a plant on a floating island
4. **Water** - Add updates over time to help your thought grow through stages
5. **Bloom** - Watch as your thoughts evolve from seeds to fully mature plants

### Architecture (user perspective)

<div align="center">
<img src="architecture-user-hd.png" alt="MindGarden user flow: You → Plant or Water → AI (art & reflection) → Your Garden → Saved" width="900" />
</div>

*From your perspective: you write a thought, plant or water it, AI creates art and reflections, and your garden is saved on your device or in the cloud.*

For the **technical architecture** (components, services, APIs), see [DOCUMENTATION.md](DOCUMENTATION.md#architecture).

---

## 🎨 Growth Stages

| Stage | Icon | Description |
|-------|------|-------------|
| **Seed** | 🌰 | Freshly planted, full of potential |
| **Sprout** | 🌱 | Beginning to emerge and take shape |
| **Bloom** | 🌸 | Flourishing with insights and growth |
| **Fruit** | 🍎 | Mature and complete |

Each stage brings new AI-generated artwork showing your plant's development!

---

## 🔧 Configuration (Optional)

### Supabase Cloud Storage

For cross-device synchronization:

1. Create a Supabase project at [supabase.com](https://supabase.com)

2. Set up the database:
   ```sql
   CREATE TABLE thoughts (
     id TEXT PRIMARY KEY,
     user_id TEXT NOT NULL,
     data JSONB NOT NULL,
     created_at BIGINT NOT NULL
   );
   
   CREATE INDEX idx_thoughts_user_id ON thoughts(user_id);
   ```

3. Add to `.env`:
   ```bash
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   ```

Or configure via the Settings modal (⚙️) in the app.

### Optional: Spotify (mood-based music)

To enable AI-suggested music for your thoughts:

1. Create an app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Add to `.env`:
   ```bash
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   ```
3. Redirect URI: `http://localhost:5173` (for local dev).

The app works without Spotify; thoughts will plant and grow normally.

---

## 📦 Building for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

The built files will be in the `dist/` directory.

---

## 🎭 Use Cases

- **Creative Brainstorming** - Plant ideas and watch them develop
- **Goal Tracking** - Water your goals with progress updates
- **Emotional Processing** - Reflect on feelings as they evolve
- **Gratitude Practice** - Plant memories and positive moments
- **Problem Solving** - Break down worries through AI-guided reflection
- **Personal Growth** - Track how your thinking changes over time

---

## 🤝 Contributing

This project is part of Google AI Studio. For contributions:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is developed as part of AI Studio. See the repository for license details.

---

## 🙏 Acknowledgments

- **Google DeepMind** - Gemini AI models
- **AI Studio** - Platform and infrastructure
- **Open Source Community** - React, Vite, TailwindCSS, and all dependencies

---

## 🐛 Troubleshooting

**Images not generating?**  
Check your API key has Imagen permissions. Fallback SVGs will appear if generation fails.

**Thoughts not saving?**  
Verify you're not in incognito/private browsing mode, or configure Supabase for cloud storage.

**Need help?**  
Check [USER_GUIDE.md](USER_GUIDE.md) or [DOCUMENTATION.md](DOCUMENTATION.md)

---

<div align="center">

**Made with 🌱 and AI**

[Documentation](DOCUMENTATION.md) • [User Guide](USER_GUIDE.md) • [Deploy to Vercel](DEPLOY_VERCEL.md)

</div>
