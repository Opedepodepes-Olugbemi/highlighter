# Quick Start Guide

Get up and running with the EXA Library app in 5 minutes!

## Prerequisites

- Node.js 16+ installed
- Chrome or Chromium-based browser
- (Optional) EXA API key from [dashboard.exa.ai](https://dashboard.exa.ai)

## Installation Steps

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd <repo-name>

# Install dependencies
npm install
```

### 2. Configure (Optional)

For real EXA search results:

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your EXA API key
# VITE_EXA_API_KEY=your_actual_key_here
```

**Skip this step to use demo mode with mock results!**

### 3. Development Mode

```bash
# Start the dev server
npm run dev
```

Open http://localhost:5173 in your browser.

### 4. Build for Production

```bash
# Build the extension
npm run build
```

### 5. Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `dist` folder from your project

Done! Click the extension icon to start using it.

## First Use

1. **Click the extension icon** in your Chrome toolbar
2. **Go to "EXA Library" tab** (should be selected by default)
3. **Try a search**: Type "machine learning" and click Search
4. **Save an item**: Click "Select & Save" on any result
5. **Add details**: 
   - Edit the extracted text
   - Add tags like "ai", "tutorial", etc.
   - Click "Save to Library"
6. **View your library**: Scroll down to see all saved items

## Demo Mode vs Production Mode

### Demo Mode (No API Key)
- ✅ Works immediately
- ✅ All features functional
- ✅ Perfect for testing
- ⚠️ Shows mock search results only

### Production Mode (With API Key)
- ✅ Real EXA search results
- ✅ Access to EXA's AI-powered search
- ✅ Find actual books, articles, papers
- ⚠️ Requires API key setup

## Common Commands

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── lib/
│   ├── ExaLibrary.svelte    # Main library component
│   └── exaConfig.js         # EXA API integration
├── App.svelte               # Main app
└── app.css                  # Global styles

public/
└── manifest.json            # Chrome extension config
```

## Key Features to Try

1. **Search**: Find books and articles using EXA
2. **Save**: Store links with extracted quotes and notes
3. **Tag**: Organize with custom tags
4. **Filter**: Search and filter your library
5. **Sort**: By date, title, or source

## Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Extension Won't Load
- Make sure you selected the `dist` folder, not the root folder
- Check that the build completed successfully
- Look for errors in Chrome's extension page

### Search Not Working
- Demo mode always works - check if you see mock results
- If using real API, verify your key in `.env`
- Check browser console for errors

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [USAGE_GUIDE.md](USAGE_GUIDE.md) for feature walkthroughs
- Explore the code in `src/lib/ExaLibrary.svelte`
- Customize the UI in `src/app.css`

## Get Help

- Check existing documentation
- Look at browser console for errors
- Open an issue on GitHub

---

**Ready to organize your research! 🚀**
