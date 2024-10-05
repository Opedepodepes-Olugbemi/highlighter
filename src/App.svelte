  <script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  let activeTab = 'highlights';
  let highlights = [];
  const darkMode = writable(false);
  let showFabMenu = false;

  function switchTab(tab) {
    activeTab = tab;
  }

  function toggleFabMenu() {
    showFabMenu = !showFabMenu;
  }

  function startNewHighlight() {
    // @ts-ignore
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // @ts-ignore
      chrome.tabs.sendMessage(tabs[0].id, { action: "startHighlighting" }, (response) => {
        if (response && response.status === 'success') {
          console.log('Highlighting started!');
        }
      });
    });
    window.close(); // Close the popup
  }

  function addHighlight(highlight) {
    highlights = [highlight, ...highlights];
    // Save highlights to chrome.storage
    // @ts-ignore
    chrome.storage.sync.set({ highlights: highlights });
  }

  function goToSite(url) {
    // @ts-ignore
    chrome.tabs.create({ url });
  }

 // @ts-ignore
  // @ts-ignore
    $: if (typeof window !== 'undefined') {
    if ($darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  onMount(() => {
    // Fetch highlights from chrome.storage
    // @ts-ignore
    chrome.storage.sync.get('highlights', (data) => {
      highlights = data.highlights || [];
    });

    // Listen for messages from content script
    // @ts-ignore
    chrome.runtime.onMessage.addListener((request) => {
      if (request.action === 'newHighlight') {
        addHighlight(request.highlight);
      }
    });
  });
</script>

<div class="popup">
  <header>
    <div class="logo">
      <img src="src/assets/ai-lighter.svg" alt="AI-Lighter Logo" width="24" height="24">
      <span>AI-Lighter</span>
    </div>
  </header>
  
  <nav>
    <button class="tab" class:active={activeTab === 'highlights'} on:click={() => switchTab('highlights')}>My Highlights</button>
    <button class="tab" class:active={activeTab === 'settings'} on:click={() => switchTab('settings')}>Settings</button>
  </nav>
  
  <main>
    {#if activeTab === 'highlights'}
      <section id="highlights" class="tab-content">
        <input type="text" class="search" placeholder="Search highlights...">
        <ul class="highlight-list">
          {#each highlights as highlight}
            <li>
              <div class="highlight-item">
                <p>{highlight.text}</p>
                <div class="highlight-meta">
                  <img src="https://www.google.com/s2/favicons?domain={highlight.site}" alt="{highlight.site} favicon" width="16" height="16">
                  <a href={highlight.url} class="site-link" on:click|preventDefault={() => goToSite(highlight.url)}>{highlight.site}</a>
                  <span>{highlight.date}</span>
                </div>
              </div>
            </li>
          {/each}
        </ul>
        <div class="fab-container">
          <button class="fab" on:click={toggleFabMenu} aria-label="Add new highlight">+</button>
          {#if showFabMenu}
            <div class="fab-menu">
              <button class="fab-item" on:click={startNewHighlight}>New Highlight</button>
            </div>
          {/if}
        </div>
      </section>
    {:else}
      <section id="settings" class="tab-content">
        <div class="setting">
          <span>Dark Mode</span>
          <label class="switch">
            <input type="checkbox" bind:checked={$darkMode}>
            <span class="slider"></span>
          </label>
        </div>
        <a href="About.svelte" class="link">About AI-Lighter</a>
      </section>
    {/if}
  </main>
  
  <footer>
    <span>Powered by AI-Lighter</span>
    <span>v1.0.0</span>
  </footer>
</div>

<style>

.fab-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

</style>
