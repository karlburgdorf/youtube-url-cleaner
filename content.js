// Content script to monitor clipboard changes
let lastClipboardContent = '';
let clipboardMonitorInterval;

// Function to safely send messages to background script
function safeSendMessage(message) {
  try {
    if (chrome.runtime && chrome.runtime.id) {
      chrome.runtime.sendMessage(message);
    }
  } catch (error) {
    // Extension context invalidated, stop monitoring
    if (error.message.includes('Extension context invalidated')) {
      console.log('Extension context invalidated, stopping clipboard monitoring');
      if (clipboardMonitorInterval) {
        clearInterval(clipboardMonitorInterval);
      }
    }
  }
}

// Function to check clipboard
async function monitorClipboard() {
  try {
    // Check if we can access clipboard
    if (!navigator.clipboard || !navigator.clipboard.readText) {
      return;
    }
    
    const currentContent = await navigator.clipboard.readText();
    
    if (currentContent !== lastClipboardContent) {
      lastClipboardContent = currentContent;
      
      // Notify background script about clipboard change
      safeSendMessage({
        type: 'clipboard-changed',
        content: currentContent
      });
    }
  } catch (error) {
    // Clipboard access might be restricted, ignore silently
  }
}

// Monitor clipboard changes every 500ms
clipboardMonitorInterval = setInterval(monitorClipboard, 500);

// Also monitor copy events
document.addEventListener('copy', () => {
  setTimeout(() => {
    safeSendMessage({ type: 'clipboard-changed' });
  }, 100);
});

// Monitor keyboard shortcuts (Ctrl+C)
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
    setTimeout(() => {
      safeSendMessage({ type: 'clipboard-changed' });
    }, 100);
  }
});