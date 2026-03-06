# Changelog

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
