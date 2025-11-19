# EXA Library - Usage Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Searching for Content](#searching-for-content)
3. [Saving Items to Your Library](#saving-items-to-your-library)
4. [Managing Your Library](#managing-your-library)
5. [Tips & Best Practices](#tips--best-practices)
6. [Troubleshooting](#troubleshooting)

---

## Getting Started

### First Time Setup

1. **Install the Extension**: Follow the installation instructions in the README.md
2. **Optional - Add EXA API Key**: 
   - Create a `.env` file in the root directory
   - Add your key: `VITE_EXA_API_KEY=your_key_here`
   - Rebuild the extension: `npm run build`
3. **Open the Extension**: Click the extension icon in your browser toolbar

### Demo Mode

Don't have an EXA API key? No problem! The app includes a demo mode with mock search results so you can explore all features without any setup.

---

## Searching for Content

### How to Search

1. Navigate to the **EXA Library** tab
2. Enter your search query in the search box
3. Click the **Search** button or press Enter

### Search Query Examples

**For Books:**
- "machine learning textbooks"
- "best books on quantum physics"
- "javascript programming guide"

**For Articles:**
- "climate change research articles"
- "web development tutorials"
- "artificial intelligence breakthroughs 2024"

**For Research Papers:**
- "neural networks research"
- "quantum computing papers"
- "renewable energy studies"

### Understanding Search Results

Each result card shows:
- **Title**: The title of the book/article/page
- **URL**: The web address
- **Preview Text**: A snippet of the content
- **Select & Save Button**: Click to save this result to your library

---

## Saving Items to Your Library

### Step-by-Step Guide

1. **Find Content**: Search for content using EXA
2. **Select a Result**: Click "Select & Save" on any result card
3. **Extract Content**: 
   - The preview text will be auto-filled in the "Extract Words/Notes" field
   - Edit this to include specific quotes, passages, or your own notes
   - This is where you save the exact words or information you want to remember
4. **Add Tags**:
   - Type a tag name and press Enter or click "Add"
   - Add multiple tags to organize your content
   - Examples: "tutorial", "reference", "important", "chapter-3"
5. **Save**: Click the "Save to Library" button

### What Can You Save?

- **Direct Quotes**: Copy exact passages from books or articles
- **Key Concepts**: Summarize important ideas in your own words
- **Code Snippets**: Save programming examples from tutorials
- **Research Notes**: Keep track of important findings
- **References**: Store links with context for later citation

### Tagging Strategies

**By Topic:**
- #javascript, #python, #biology, #history

**By Type:**
- #tutorial, #reference, #research, #example

**By Priority:**
- #important, #review-later, #in-progress

**By Project:**
- #thesis, #work-project, #personal-learning

---

## Managing Your Library

### Filtering Your Library

**Text Search:**
- Type in the filter box to search across:
  - Titles
  - Extracted content
  - Tags
- Example: Search "quantum" to find all quantum-related items

**Tag Filter:**
- Use the "All Tags" dropdown to filter by specific tags
- Only items with the selected tag will be shown

### Sorting Options

**Sort by Date** (Default):
- Shows newest items first
- Great for finding recently saved content

**Sort by Title**:
- Alphabetical ordering
- Useful for finding specific items by name

**Sort by Source**:
- Groups items from the same website together
- Helpful when you've saved multiple items from one source

### Viewing Item Details

Each library card displays:
- **Title**: The name of the saved item
- **Source**: Website/domain with favicon
- **Date**: When you saved it
- **Excerpt**: First 200 characters of your extracted content
- **Tags**: All associated tags as colored badges
- **Actions**:
  - **Open Source →**: Visit the original page
  - **× (Delete)**: Remove from your library

---

## Tips & Best Practices

### Organizing Your Library

1. **Use Consistent Tags**: Develop a tagging system and stick to it
2. **Add Context**: Don't just save links - add your own notes and thoughts
3. **Review Regularly**: Periodically review your library to keep it relevant
4. **Be Specific**: Extract only the most important quotes or concepts

### Making the Most of EXA Search

1. **Be Specific**: More detailed queries get better results
2. **Use Categories**: EXA is great for academic and research content
3. **Try Variations**: If you don't find what you need, rephrase your query

### Storage Management

- **Chrome Extension**: Saves to Chrome sync storage (limited to ~100KB)
- **Web Version**: Uses localStorage (more capacity)
- **Export/Backup**: Consider copying important items elsewhere for backup

### Workflow Examples

**Research Workflow:**
1. Search for topic: "neural networks basics"
2. Save 3-5 key articles
3. Tag with: #neural-networks, #research, #ai-fundamentals
4. Extract key definitions and concepts
5. Return later to review by filtering by tag

**Learning Workflow:**
1. Search for tutorials: "react hooks tutorial"
2. Save step-by-step guides
3. Tag with: #react, #tutorial, #hooks
4. Extract code examples
5. Sort by date to follow learning progression

---

## Troubleshooting

### Search Returns No Results

**If using EXA API:**
- Check your API key is correctly set in `.env`
- Verify you have API credits remaining
- Try a different search query

**If using Demo Mode:**
- Demo mode always returns mock results
- This is normal behavior for testing

### Items Not Saving

1. Check browser console for errors
2. Verify Chrome storage permissions
3. Try clearing extension storage and starting fresh

### Search is Slow

- EXA API calls may take a few seconds
- Network speed affects response time
- Demo mode is instant

### Tags Not Appearing

- Make sure to click "Add" or press Enter after typing a tag
- Tags are case-sensitive
- Duplicate tags are automatically prevented

### Can't Find Saved Items

1. Check your filter settings - clear any active filters
2. Try searching with different keywords
3. Check if you're looking at the right tab

---

## Advanced Features

### Chrome Storage vs localStorage

The app automatically detects the environment:
- **Chrome Extension**: Uses Chrome sync storage (syncs across devices)
- **Web App**: Uses localStorage (local to browser)

### Mobile Support

The UI is responsive and works on mobile browsers, though the extension is designed for desktop Chrome.

### Keyboard Shortcuts

- **Enter**: Submit search query
- **Enter**: Add tag when focused on tag input
- **Escape**: Close modals and clear selections

---

## Getting Help

If you encounter issues:
1. Check this guide first
2. Review the main README.md
3. Check the browser console for error messages
4. Open an issue on GitHub with:
   - Description of the problem
   - Steps to reproduce
   - Browser and version
   - Console error messages (if any)

---

## Feature Requests

Have ideas for new features? We'd love to hear them! Consider:
- Export/import functionality
- Note-taking integration
- Citation generation
- Collaboration features
- Browser reading mode integration

Submit feature requests via GitHub issues!

---

**Happy organizing! 📚**
