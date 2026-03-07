# Changelog

## v0.3.0

- **i18n**: Add 14 language translations (ja, zh, zh-TW, es, pt, de, fr, hi, id, vi, th, ru, tr, ar) (`7ef6b2e`)
- **UI**: Replace language toggle buttons with dropdown menu (`54a6bdb`)
- **i18n**: Add `_locales` for multi-language support on Chrome Web Store (`86fae7c`)
- **UX**: Add video ID validation with tooltip hint and shadcn Tooltip (`4361344`)

## v0.2.1

- **UX**: Add video ID/URL validation with inline error message
- **UX**: Add info tooltip explaining auto video ID extraction from YouTube links
- **UI**: Update input label and placeholder to indicate URL support

## v0.2.0

- **Performance**: Optimize export with inline replies and parallel fetching (8x concurrency) (`7563660`)
- **UX**: Add API key missing banner with shortcut to settings page (`86fdbc4`)
- **i18n**: Add internationalization support (Korean/English) with settings page (`881b7fe`)
- **UI**: Replace theme selector with dark/light toggle button (`cce1aae`)
- **Fix**: Fix scan button height to match video ID input field (`6d2d4b1`)

## v0.1.0

- **Export**: Split export button with CSV/JSON format dropdown and cancel support (`f58008c`)
- **Replies**: Collapsible reply fetching via YouTube comments.list API (`b2932a1`)
- **URL parsing**: Extract Video ID from full YouTube URLs (`5bd69fc`)
- **Refactor**: Separate store, API, and components by concern (`f19ca9f`)
- **Permissions**: Add storage permission (`45ba18a`)
- **API key storage**: Persist API key using browser.storage.local (`7939378`)
- **State management**: Add Zustand store, videoId extraction, and API key input (`9900d2f`)
- **UI foundation**: Set up Tailwind CSS, shadcn/ui, and theme toggle (`4ede76d`)
- **Init**: WXT + React project setup (`efe7194`)
