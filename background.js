// Background service worker for YouTube URL Cleaner
let isEnabled = true;
let lastCleanedUrl = '';

// Function to clean YouTube URL
function cleanYouTubeUrl(url) {
  try {
    const urlObj = new URL(url);
    
    // Check if it's a YouTube URL using wildcard patterns
    const youtubePatterns = [
      /^.*\.youtube\.com$/,    // Any subdomain of youtube.com
      /^youtube\.com$/,        // Plain youtube.com
      /^.*\.youtu\.be$/,       // Any subdomain of youtu.be
      /^youtu\.be$/            // Plain youtu.be
    ];
    
    const isYouTube = youtubePatterns.some(pattern => pattern.test(urlObj.hostname));
    
    if (!isYouTube) return null;
    
    // Unified approach for all YouTube domains
    const params = new URLSearchParams(urlObj.search);
    let hasTracking = false;
    
    // Remove all common tracking parameters
    const trackingParams = ['si', 'feature', 'gclid', 'fbclid', 'utm_source', 'utm_medium', 'utm_campaign'];
    trackingParams.forEach(param => {
      if (params.has(param)) {
        params.delete(param);
        hasTracking = true;
      }
    });
    
    if (!hasTracking) return null;
    
    const cleanedSearch = params.toString();
    return urlObj.origin + urlObj.pathname + (cleanedSearch ? '?' + cleanedSearch : '');
    
  } catch (e) {
    return null;
  }
}

// Function to check clipboard and clean URL using chrome.action
async function checkAndCleanClipboard(tab) {
  if (!isEnabled) return;
  
  try {
    // Use chrome.scripting to read clipboard from active tab
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        return navigator.clipboard.readText();
      }
    });
    
    const text = await results[0].result;
    
    if (!text || text === lastCleanedUrl) return;
    
    const cleanedUrl = cleanYouTubeUrl(text);
    
    if (cleanedUrl && cleanedUrl !== text) {
      lastCleanedUrl = cleanedUrl;
      
      // Write cleaned URL back to clipboard
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (url) => {
          navigator.clipboard.writeText(url);
        },
        args: [cleanedUrl]
      });
      
      // Show notification -- commented out, notifications go to the Windows notification center and would just be annoying.
      // chrome.notifications.create(
      //   {
      //     type: 'basic',
      //     iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      //     priority: 1,
      //     title: 'YouTube URL Cleaned',
      //     message: 'Tracking parameters removed from YouTube URL'
      //   }
      // );
      
      console.log('YouTube URL cleaned:', text, '->', cleanedUrl);
    }
  } catch (error) {
    console.log('Clipboard access error:', error);
  }
}

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'clipboard-changed') {
    // Get active tab and process clipboard
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        checkAndCleanClipboard(tabs[0]);
      }
    });
  } else if (message.type === 'toggle-enabled') {
    isEnabled = !isEnabled;
    sendResponse({ enabled: isEnabled });
    return true; // Keep message channel open for async response
  } else if (message.type === 'get-status') {
    sendResponse({ enabled: isEnabled });
    return true; // Keep message channel open for async response
  }
});

// Welcome notification on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    title: 'YouTube URL Cleaner Installed',
    message: 'Extension is now ready! Copy YouTube URLs to clean them automatically.'
  });
});