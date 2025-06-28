// Popup script for YouTube URL Cleaner
document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.getElementById('toggleSwitch');
    const status = document.getElementById('status');
    const testButton = document.getElementById('testButton');
    
    // Function to clean YouTube URL (same as background script)
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
    
    // Update UI based on status
    function updateUI(enabled) {
        if (enabled) {
            toggleSwitch.classList.add('active');
            status.textContent = '✅ Active - Monitoring clipboard text';
        } else {
            toggleSwitch.classList.remove('active');
            status.textContent = '⏸️ Paused - Click to enable';
        }
    }
    
    // Get current status
    chrome.runtime.sendMessage({ type: 'get-status' }, function(response) {
        if (response) {
            updateUI(response.enabled);
        }
    });
    
    // Toggle switch click handler
    toggleSwitch.addEventListener('click', function() {
        chrome.runtime.sendMessage({ type: 'toggle-enabled' }, function(response) {
            if (response) {
                updateUI(response.enabled);
            }
        });
    });
    
    // Test button click handler
    testButton.addEventListener('click', async function() {
        try {
            const clipboardText = await navigator.clipboard.readText();
            
            if (!clipboardText) {
                status.textContent = '📋 Clipboard has no text';
                setTimeout(() => {
                    chrome.runtime.sendMessage({ type: 'get-status' }, function(response) {
                        if (response) updateUI(response.enabled);
                    });
                }, 2000);
                return;
            }
            
            const cleanedUrl = cleanYouTubeUrl(clipboardText);
            
            if (cleanedUrl && cleanedUrl !== clipboardText) {
                await navigator.clipboard.writeText(cleanedUrl);
                status.textContent = '✨ URL cleaned and copied!';
                
                setTimeout(() => {
                    chrome.runtime.sendMessage({ type: 'get-status' }, function(response) {
                        if (response) updateUI(response.enabled);
                    });
                }, 2000);
            } else if (cleanYouTubeUrl(clipboardText) === null) {
                status.textContent = '❌ Not a YouTube URL';
                setTimeout(() => {
                    chrome.runtime.sendMessage({ type: 'get-status' }, function(response) {
                        if (response) updateUI(response.enabled);
                    });
                }, 2000);
            } else {
                status.textContent = '✅ URL already clean';
                setTimeout(() => {
                    chrome.runtime.sendMessage({ type: 'get-status' }, function(response) {
                        if (response) updateUI(response.enabled);
                    });
                }, 2000);
            }
        } catch (error) {
            status.textContent = '❌ Clipboard access denied';
            setTimeout(() => {
                chrome.runtime.sendMessage({ type: 'get-status' }, function(response) {
                    if (response) updateUI(response.enabled);
                });
            }, 2000);
        }
    });
});