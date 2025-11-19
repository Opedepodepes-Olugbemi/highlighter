<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { searchExa, generateMockResults } from './exaConfig.js';

  // Store for saved items (links and words from books/pages)
  let savedItems = writable([]);
  let searchQuery = '';
  let exaSearchQuery = '';
  let isSearching = false;
  let searchResults = [];
  let selectedResult = null;
  let extractedWords = '';
  let tags = [];
  let currentTag = '';
  let filterTag = '';
  let sortBy = 'date'; // date, title, source

  // Load saved items from storage
  onMount(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get('exaLibraryItems', (data) => {
        savedItems.set(data.exaLibraryItems || []);
      });
    } else {
      // Fallback to localStorage for web version
      const stored = localStorage.getItem('exaLibraryItems');
      if (stored) {
        savedItems.set(JSON.parse(stored));
      }
    }
  });

  // Search using EXA API
  async function searchWithExa() {
    if (!exaSearchQuery.trim()) return;
    
    isSearching = true;
    searchResults = [];
    
    try {
      const result = await searchExa(exaSearchQuery, {
        numResults: 10,
        type: 'auto',
        category: 'research paper',
      });

      if (result.success && result.results.length > 0) {
        searchResults = result.results;
      } else {
        // Show mock results for demo if API fails or returns no results
        console.log('Using mock results for demo');
        searchResults = generateMockResults(exaSearchQuery);
      }
    } catch (error) {
      console.error('Error searching with EXA:', error);
      // Show mock results for demo
      searchResults = generateMockResults(exaSearchQuery);
    } finally {
      isSearching = false;
    }
  }



  // Select a search result to save
  function selectResult(result) {
    selectedResult = result;
    extractedWords = result.text ? result.text.substring(0, 500) : '';
    tags = [];
  }

  // Add a tag
  function addTag() {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      tags = [...tags, currentTag.trim()];
      currentTag = '';
    }
  }

  // Remove a tag
  function removeTag(tag) {
    tags = tags.filter(t => t !== tag);
  }

  // Save the selected item
  function saveItem() {
    if (!selectedResult) return;

    const newItem = {
      id: Date.now().toString(),
      url: selectedResult.url,
      title: selectedResult.title,
      source: new URL(selectedResult.url).hostname,
      extractedWords: extractedWords.trim(),
      tags: tags,
      savedDate: new Date().toISOString(),
      author: selectedResult.author || 'Unknown'
    };

    savedItems.update(items => {
      const updated = [newItem, ...items];
      
      // Save to storage
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.set({ exaLibraryItems: updated });
      } else {
        localStorage.setItem('exaLibraryItems', JSON.stringify(updated));
      }
      
      return updated;
    });

    // Reset form
    selectedResult = null;
    extractedWords = '';
    tags = [];
    searchResults = [];
    exaSearchQuery = '';
  }

  // Delete an item
  function deleteItem(id) {
    savedItems.update(items => {
      const updated = items.filter(item => item.id !== id);
      
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.set({ exaLibraryItems: updated });
      } else {
        localStorage.setItem('exaLibraryItems', JSON.stringify(updated));
      }
      
      return updated;
    });
  }

  // Filter and sort items
  $: filteredItems = $savedItems
    .filter(item => {
      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.extractedWords.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesTag = !filterTag || item.tags.includes(filterTag);
      
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.savedDate) - new Date(a.savedDate);
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'source') {
        return a.source.localeCompare(b.source);
      }
      return 0;
    });

  // Get all unique tags
  $: allTags = [...new Set($savedItems.flatMap(item => item.tags))];

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function openUrl(url) {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({ url });
    } else {
      window.open(url, '_blank');
    }
  }
</script>

<div class="exa-library">
  <!-- Search Section -->
  <div class="search-section">
    <h2>Search Books & Pages with EXA</h2>
    <div class="search-input-group">
      <input 
        type="text" 
        class="search-input"
        placeholder="Search for books, articles, research papers..."
        bind:value={exaSearchQuery}
        on:keypress={(e) => e.key === 'Enter' && searchWithExa()}
      />
      <button 
        class="btn-search"
        on:click={searchWithExa}
        disabled={isSearching || !exaSearchQuery.trim()}
      >
        {isSearching ? 'Searching...' : 'Search'}
      </button>
    </div>

    {#if searchResults.length > 0}
      <div class="search-results">
        <h3>Search Results</h3>
        <div class="results-grid">
          {#each searchResults as result}
            <div class="result-card" class:selected={selectedResult === result}>
              <h4>{result.title}</h4>
              <p class="result-url">{result.url}</p>
              <p class="result-text">{result.text?.substring(0, 150)}...</p>
              <button class="btn-select" on:click={() => selectResult(result)}>
                Select & Save
              </button>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    {#if selectedResult}
      <div class="save-form">
        <h3>Save to Library</h3>
        <div class="form-field">
          <label>Title:</label>
          <input type="text" value={selectedResult.title} disabled />
        </div>
        <div class="form-field">
          <label>URL:</label>
          <input type="text" value={selectedResult.url} disabled />
        </div>
        <div class="form-field">
          <label>Extract Words/Notes:</label>
          <textarea 
            bind:value={extractedWords}
            placeholder="Add specific words, quotes, or notes from this source..."
            rows="4"
          ></textarea>
        </div>
        <div class="form-field">
          <label>Tags:</label>
          <div class="tag-input-group">
            <input 
              type="text" 
              bind:value={currentTag}
              on:keypress={(e) => e.key === 'Enter' && addTag()}
              placeholder="Add tags..."
            />
            <button class="btn-add-tag" on:click={addTag}>Add</button>
          </div>
          <div class="tags-display">
            {#each tags as tag}
              <span class="tag">
                {tag}
                <button class="tag-remove" on:click={() => removeTag(tag)}>×</button>
              </span>
            {/each}
          </div>
        </div>
        <div class="form-actions">
          <button class="btn-cancel" on:click={() => selectedResult = null}>Cancel</button>
          <button class="btn-save" on:click={saveItem}>Save to Library</button>
        </div>
      </div>
    {/if}
  </div>

  <!-- Library Section -->
  <div class="library-section">
    <h2>My Library ({$savedItems.length} items)</h2>
    
    <div class="library-controls">
      <input 
        type="text" 
        class="filter-input"
        placeholder="Filter library..."
        bind:value={searchQuery}
      />
      
      <div class="control-group">
        <select bind:value={filterTag} class="filter-select">
          <option value="">All Tags</option>
          {#each allTags as tag}
            <option value={tag}>{tag}</option>
          {/each}
        </select>
        
        <select bind:value={sortBy} class="sort-select">
          <option value="date">Sort by Date</option>
          <option value="title">Sort by Title</option>
          <option value="source">Sort by Source</option>
        </select>
      </div>
    </div>

    {#if filteredItems.length === 0}
      <div class="empty-state">
        <p>No items in your library yet. Search and save content from books and pages above!</p>
      </div>
    {:else}
      <div class="library-grid">
        {#each filteredItems as item}
          <div class="library-card">
            <div class="card-header">
              <h4>{item.title}</h4>
              <button class="btn-delete" on:click={() => deleteItem(item.id)}>×</button>
            </div>
            
            <div class="card-meta">
              <span class="card-source">
                <img 
                  src="https://www.google.com/s2/favicons?domain={item.source}" 
                  alt="favicon" 
                  width="16" 
                  height="16"
                />
                {item.source}
              </span>
              <span class="card-date">{formatDate(item.savedDate)}</span>
            </div>

            {#if item.extractedWords}
              <p class="card-excerpt">{item.extractedWords.substring(0, 200)}{item.extractedWords.length > 200 ? '...' : ''}</p>
            {/if}

            {#if item.tags.length > 0}
              <div class="card-tags">
                {#each item.tags as tag}
                  <span class="tag-badge">{tag}</span>
                {/each}
              </div>
            {/if}

            <button class="btn-open" on:click={() => openUrl(item.url)}>
              Open Source →
            </button>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .exa-library {
    padding: 20px;
    max-width: 1400px;
    margin: 0 auto;
  }

  .search-section, .library-section {
    margin-bottom: 40px;
  }

  h2 {
    color: var(--primary);
    margin-bottom: 20px;
    font-size: 24px;
  }

  h3 {
    color: var(--text);
    margin-bottom: 15px;
    font-size: 18px;
  }

  .search-input-group {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  .search-input {
    flex: 1;
    padding: 12px 16px;
    border: 2px solid var(--border);
    border-radius: 8px;
    font-size: 16px;
    background-color: var(--card-bg);
    color: var(--text);
    transition: border-color 0.2s;
  }

  .search-input:focus {
    outline: none;
    border-color: var(--primary);
  }

  .btn-search {
    padding: 12px 24px;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-search:hover:not(:disabled) {
    background-color: var(--secondary);
    color: var(--primary);
    transform: translateY(-2px);
  }

  .btn-search:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .search-results {
    margin-top: 30px;
  }

  .results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 15px;
  }

  .result-card {
    background-color: var(--card-bg);
    border: 2px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    transition: all 0.2s;
  }

  .result-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .result-card.selected {
    border-color: var(--primary);
    background-color: rgba(74, 14, 78, 0.05);
  }

  .result-card h4 {
    margin-bottom: 8px;
    color: var(--text);
    font-size: 16px;
  }

  .result-url {
    font-size: 12px;
    color: #666;
    margin-bottom: 10px;
    word-break: break-all;
  }

  .result-text {
    font-size: 14px;
    color: var(--text);
    margin-bottom: 15px;
    line-height: 1.5;
  }

  .btn-select {
    width: 100%;
    padding: 10px;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
  }

  .btn-select:hover {
    background-color: var(--secondary);
    color: var(--primary);
  }

  .save-form {
    background-color: var(--card-bg);
    border: 2px solid var(--primary);
    border-radius: 12px;
    padding: 24px;
    margin-top: 30px;
  }

  .form-field {
    margin-bottom: 20px;
  }

  .form-field label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: var(--text);
  }

  .form-field input,
  .form-field textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 14px;
    background-color: var(--card-bg);
    color: var(--text);
  }

  .form-field input:disabled {
    background-color: #f5f5f5;
    color: #666;
  }

  .form-field textarea {
    resize: vertical;
    font-family: inherit;
  }

  .tag-input-group {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  }

  .tag-input-group input {
    flex: 1;
  }

  .btn-add-tag {
    padding: 10px 20px;
    background-color: var(--secondary);
    color: var(--primary);
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
  }

  .tags-display {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
  }

  .tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background-color: var(--primary);
    color: white;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }

  .tag-remove {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  }

  .form-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 20px;
  }

  .btn-cancel {
    padding: 12px 24px;
    background-color: var(--border);
    color: var(--text);
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
  }

  .btn-save {
    padding: 12px 24px;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
  }

  .btn-save:hover {
    background-color: var(--secondary);
    color: var(--primary);
  }

  .library-controls {
    display: flex;
    gap: 15px;
    margin-bottom: 25px;
    flex-wrap: wrap;
  }

  .filter-input {
    flex: 1;
    min-width: 250px;
    padding: 10px 14px;
    border: 2px solid var(--border);
    border-radius: 8px;
    font-size: 14px;
    background-color: var(--card-bg);
    color: var(--text);
  }

  .control-group {
    display: flex;
    gap: 10px;
  }

  .filter-select,
  .sort-select {
    padding: 10px 14px;
    border: 2px solid var(--border);
    border-radius: 8px;
    font-size: 14px;
    background-color: var(--card-bg);
    color: var(--text);
    cursor: pointer;
  }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    background-color: var(--card-bg);
    border-radius: 12px;
    color: #666;
  }

  .library-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
  }

  .library-card {
    background-color: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    transition: all 0.2s;
  }

  .library-card:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-3px);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 12px;
  }

  .card-header h4 {
    flex: 1;
    margin: 0;
    color: var(--text);
    font-size: 18px;
  }

  .btn-delete {
    background: none;
    border: none;
    color: #999;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    transition: color 0.2s;
  }

  .btn-delete:hover {
    color: #ff4444;
  }

  .card-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-size: 13px;
    color: #666;
  }

  .card-source {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .card-excerpt {
    margin: 15px 0;
    font-size: 14px;
    line-height: 1.6;
    color: var(--text);
  }

  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 15px 0;
  }

  .tag-badge {
    padding: 4px 10px;
    background-color: rgba(74, 14, 78, 0.1);
    color: var(--primary);
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
  }

  .btn-open {
    width: 100%;
    padding: 10px;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    margin-top: 15px;
    transition: all 0.2s;
  }

  .btn-open:hover {
    background-color: var(--secondary);
    color: var(--primary);
  }

  @media (max-width: 768px) {
    .exa-library {
      padding: 15px;
    }

    .results-grid,
    .library-grid {
      grid-template-columns: 1fr;
    }

    .library-controls {
      flex-direction: column;
    }

    .control-group {
      width: 100%;
    }

    .filter-select,
    .sort-select {
      flex: 1;
    }
  }
</style>
