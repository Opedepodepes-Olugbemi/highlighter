let isHighlighting = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startHighlighting") {
    isHighlighting = true;
    alert("Highlighting mode activated. Select text to highlight.");
  }
});

document.addEventListener('mouseup', function() {
  if (isHighlighting) {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0) {
      chrome.runtime.sendMessage({
        action: "newHighlight",
        highlight: {
          text: selectedText,
          site: window.location.hostname,
          url: window.location.href,
          date: new Date().toISOString().split('T')[0]
        }
      });
      isHighlighting = false;
      alert("Text highlighted and saved!");
    }
  }
});