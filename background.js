chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "newHighlight") {
      chrome.storage.sync.get('highlights', function(data) {
        let highlights = data.highlights || [];
        highlights.unshift(request.highlight);
        chrome.storage.sync.set({highlights: highlights});
      });
    }
  });