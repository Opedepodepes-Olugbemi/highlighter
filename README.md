# AI-Lighter with EXA Library

A powerful browser extension that combines text highlighting capabilities with an intelligent library powered by EXA search API. Store and organize links, quotes, and specific words from online books, articles, and web pages.

![image](https://github.com/user-attachments/assets/6188066b-b9e8-4cf4-add0-a2c77ddd3ae7)

## Features

### EXA Library (New!)
- **Smart Search**: Search for books, articles, and research papers using EXA's AI-powered search engine
- **Save Links & Content**: Store specific links with extracted words, quotes, and notes
- **Tagging System**: Organize your saved items with custom tags
- **Advanced Filtering**: Filter by tags, search content, and sort by date, title, or source
- **Beautiful UI**: Clean, modern interface inspired by DiceUI design principles
- **Persistent Storage**: All data saved locally using Chrome storage or localStorage

### Highlighter
- **Quick Highlighting**: Select and highlight text on any webpage
- **Organize Highlights**: View all your highlights in one place
- **Dark Mode**: Easy on the eyes with dark mode support

## Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up EXA API (optional, demo mode works without it):
   - Get your API key from [EXA Dashboard](https://dashboard.exa.ai)
   - Copy `.env.example` to `.env`
   - Add your API key: `VITE_EXA_API_KEY=your_key_here`

4. Build the extension:
   ```bash
   npm run build
   ```

5. Load in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

## Development

Run the development server:
```bash
npm run dev
```

## How to Use

### EXA Library

1. **Search for Content**:
   - Open the extension and go to the "EXA Library" tab
   - Enter your search query (e.g., "machine learning books", "quantum physics articles")
   - Click "Search" to find relevant content

2. **Save Items**:
   - Click "Select & Save" on any search result
   - Add or edit extracted words/quotes in the text area
   - Add tags to organize your library (press Enter or click Add)
   - Click "Save to Library"

3. **Manage Your Library**:
   - Use the filter input to search within your saved items
   - Filter by specific tags using the dropdown
   - Sort by date, title, or source
   - Click "Open Source →" to visit the original page
   - Click "×" to remove items from your library

### Highlights

1. Click the FAB (+ button) to start highlighting
2. Select text on any webpage to create a highlight
3. View all highlights in the "My Highlights" tab

## Technical Stack

- **Frontend**: Svelte 4
- **Build Tool**: Vite
- **Search API**: EXA AI
- **Storage**: Chrome Storage API / localStorage
- **Styling**: CSS with custom properties for theming

## API Configuration

The app uses EXA's search API to find content. You have two options:

1. **Demo Mode** (Default): Works without an API key, shows mock results for testing
2. **Production Mode**: Add your EXA API key to `.env` for real search results

### EXA API Features Used:
- `/search` - Find webpages using embeddings-based or keyword search
- Text extraction and highlights
- Category filtering (research papers, articles, etc.)

## Project Structure

```
src/
├── lib/
│   ├── ExaLibrary.svelte    # Main EXA library component
│   ├── exaConfig.js         # EXA API configuration and helpers
│   └── About.svelte         # About page
├── assets/                  # Images and icons
├── App.svelte              # Main app component
├── app.css                 # Global styles
└── main.js                 # Entry point

public/
├── manifest.json           # Chrome extension manifest
└── ai-lighter.svg         # Extension icon
```

## Design Principles

The UI follows DiceUI design principles:
- **Composable Components**: Modular, reusable components
- **Accessibility**: Proper ARIA attributes and keyboard navigation
- **Responsive Design**: Works on all screen sizes
- **Clean Aesthetics**: Modern, minimalist design with smooth transitions
- **Dark Mode Support**: Toggle between light and dark themes

## Browser Compatibility

- Chrome/Chromium-based browsers (tested)
- Edge (should work)
- Firefox (with manifest adjustments)

## Security Notes

- Never commit your `.env` file with real API keys
- For production, implement a backend proxy for API calls
- The current implementation includes demo mode for testing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- [EXA](https://exa.ai) - AI-powered search engine
- [DiceUI](https://diceui.com) - Design inspiration
- [Svelte](https://svelte.dev) - Reactive framework
- [Vite](https://vitejs.dev) - Build tool
