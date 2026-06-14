# Fetch comments via the official YouTube Data API, with a user-supplied API key

We collect comments by calling the official YouTube Data API v3 rather than scraping the video page's HTML. Because every request needs a key, each user supplies their own YouTube Data API v3 key (obtained from Google Cloud); the extension never ships or issues one.

## Considered Options

- **Scrape the page HTML** — no key required, but brittle (breaks whenever YouTube changes its markup), against YouTube's Terms of Service, and hard to paginate reliably across large comment sets.
- **Fetch via the official API (chosen)** — stable, paginated, ToS-compliant, and returns structured Threads and Replies. The cost is that callers need an API key and are bound by its daily quota.
- **Ship a shared/embedded key** — rejected: a single key's quota would be exhausted across all users almost immediately, and an embedded key would be trivially extractable and abused.

## Consequences

- The user must obtain and enter an API key before any **Export** — this is a required onboarding step, not optional config.
- Quota is the user's own; heavy exports are limited by their personal daily quota, not a shared pool.
- The architecture (key-entry UI, full-Fetch pagination, Thread/Reply shape) is built around the API and would be expensive to swap for scraping.
