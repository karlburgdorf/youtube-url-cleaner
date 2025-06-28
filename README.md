# YouTube URL Cleaner

A browser extension that automatically removes tracking parameters from YouTube URLs when they're copied to your clipboard.

## 🚀 Features

- **Automatic URL Cleaning**: Removes tracking parameters like `si=`, `feature=`, `gclid=`, `fbclid=`, and UTM parameters from YouTube URLs
- **Real-time Monitoring**: Monitors your clipboard for YouTube URLs and cleans them automatically
- **Toggle Control**: Easy on/off switch via popup interface
- **Universal Support**: Works with all YouTube domains (`youtube.com`, `youtu.be`, and their subdomains)
- **Clean Interface**: Modern, gradient-styled popup with toggle controls

## 📋 Supported Parameters Removed

- `si` - YouTube tracking parameter
- `feature` - YouTube feature tracking
- `gclid` - Google Click Identifier
- `fbclid` - Facebook Click Identifier  
- `utm_source`, `utm_medium`, `utm_campaign` - UTM tracking parameters

## 🔧 Installation

**Note**: This extension is only available as an unpacked developer extension and cannot be published to the Chrome Web Store due to its clipboard monitoring functionality.

1. Download or clone this repository to your local machine
2. Open Chrome/Edge and navigate to `chrome://extensions/` or `edge://extensions/`
3. Enable "Developer mode" (toggle switch in the top right)
4. Click "Load unpacked" and select the extension folder
5. The extension icon should appear in your browser toolbar
6. **Important**: Keep the extension folder in place - don't delete it as the browser references the files directly

## 💡 How It Works

1. The extension monitors your clipboard when you're on YouTube pages
2. When a YouTube URL is detected in your clipboard, it automatically removes tracking parameters
3. The cleaned URL replaces the original in your clipboard
4. You can toggle the extension on/off using the popup interface

## 🛠️ Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: 
  - `activeTab` - Access to current tab
  - `clipboardRead/Write` - Monitor and modify clipboard
  - `scripting` - Inject content scripts
  - `notifications` - Show cleaning notifications
- **Host Permissions**: `*.youtube.com/*` and `youtu.be/*`

## 📁 File Structure

```
├── manifest.json      # Extension configuration
├── background.js      # Service worker for URL processing
├── content.js         # Content script for clipboard monitoring  
├── popup.html         # Extension popup interface
├── popup.js           # Popup functionality
├── icon.png          # Extension icon
└── README.md         # This file
```

## 🎯 Usage

1. Click the extension icon to open the popup
2. Use the toggle switch to enable/disable URL cleaning
3. Copy any YouTube URL while browsing
4. The extension will automatically clean tracking parameters from copied URLs

## 🔒 Privacy

This extension only processes URLs locally in your browser. No data is sent to external servers.

## � Acknowledgments

- Icon made by bearicons at [Flaticon](https://www.flaticon.com/authors/bearicons) - Thank you for providing high-quality icons for open source projects

## �📝 License

This project is open source. Feel free to modify and distribute as needed.
