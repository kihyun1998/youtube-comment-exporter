# YouTube Comment Exporter

A Chrome extension that exports YouTube video comments to CSV/JSON format.

## Features

- Fetch comments and replies from any YouTube video
- Export to CSV or JSON format
- Auto-detect Video ID from the active YouTube tab
- Real-time progress tracking during export
- Cancel ongoing exports
- Collapsible reply threads

## Tech Stack

- [WXT](https://wxt.dev) - Browser extension framework
- React 19 + TypeScript
- Tailwind CSS 4 + shadcn/ui
- Zustand - State management
- YouTube Data API v3

## Getting Started

### Prerequisites

- Node.js 18+
- YouTube Data API v3 key (from [Google Cloud Console](https://console.cloud.google.com/))

### Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Package as zip
npm run zip
```

### Usage

1. Install the extension and enter your YouTube Data API key.
2. Navigate to a YouTube video and click the extension icon.
3. The Video ID is auto-filled. (You can also paste a full URL or enter it manually.)
4. Choose CSV or JSON from the export button dropdown and download.

## Project Structure

```
entrypoints/
  popup/           # Popup UI (React)
    components/    # CommentList, CommentItem, ExportBar, SettingsForm
  background.ts    # Service worker
  content.ts       # Content script (Video ID extraction)
components/ui/     # shadcn/ui components
lib/
  api/             # YouTube API, export logic
  store/           # Zustand stores (settings, comments)
  types.ts         # Type definitions
```

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for details.
