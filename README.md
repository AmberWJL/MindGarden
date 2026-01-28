<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1i1GVIO2sZ6qM7quypzeJDmXS3OkUCAJa

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set up API keys in [.env](.env):
   - `GEMINI_API_KEY`: Your Gemini API key
   - `SPOTIFY_CLIENT_ID`: Your Spotify Client ID (see below)
   - `SPOTIFY_CLIENT_SECRET`: Your Spotify Client Secret (see below)
3. Run the app:
   `npm run dev`

### Getting Spotify API Credentials

To enable mood-based music recommendations:

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account (or create one)
3. Click **"Create app"**
4. Fill in the app details:
   - App name: "MindGarden" (or any name)
   - App description: "Personal journaling app"
   - Redirect URI: `http://localhost:5173` (or leave blank for now)
   - Check the box to agree to terms
5. Click **"Save"**
6. In your app settings, you'll see:
   - **Client ID** - Copy this to `.env` as `SPOTIFY_CLIENT_ID`
   - **Client Secret** - Click "View client secret" and copy to `.env` as `SPOTIFY_CLIENT_SECRET`

**Note:** Music recommendations are optional. If Spotify credentials are not configured, thoughts will still be planted without music.
