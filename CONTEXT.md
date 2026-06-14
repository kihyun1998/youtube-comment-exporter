# YouTube Comment Exporter

A Chrome extension that pulls the comments off a YouTube video through the official YouTube Data API and writes them out as a downloadable CSV or JSON file.

## Language

**Fetch**:
Retrieving comments from YouTube by calling the official YouTube Data API v3.
_Avoid_: Crawl, scrape — those imply parsing page HTML, which this extension does not do.

**Video**:
The single YouTube video an **Export** targets. Its **Comments** are what get fetched.

**Video ID**:
The 11-character code (`[A-Za-z0-9_-]{11}`) that identifies a **Video**. The user supplies it as a raw ID, a full YouTube URL it's pulled from, or via auto-detection of the active tab.

**API key**:
The user's own YouTube Data API v3 key, which the extension uses to **Fetch** on their behalf. The user obtains it from Google Cloud; the extension never issues one.

**Comment**:
A single comment on a video — either the root of a Thread or a Reply. The most general unit.

**Reply**:
A Comment that hangs off another Comment (its `parentId` points at the root). A response within a Thread.
_Avoid_: Child comment, sub-comment.

**Thread**:
One root **Comment** plus all of its **Replies**, taken as a group. The unit that Split and counts operate on.
_Avoid_: Conversation. Don't use "top-level comment" as a standalone term — call it "the Thread's root Comment".

**Export**:
The whole act a user triggers: **Fetch** every Thread for a video, format the result as CSV or JSON, and download it as a file. Always a verb (the action), never the output file.
_Avoid_: Using "export" for the downloaded file — that's "the exported file". Don't conflate with **Fetch**, which is only the first step.

**Split**:
Dividing one **Export** across multiple files. The boundary is always a **Thread** — a Thread (root Comment and all its Replies) is never broken across two files.

**Split size**:
The maximum number of **Threads** per file when an Export is Split. Counted in Threads, not Comments. A Split size of 0 means no splitting — one file.

**Filename template**:
A user-defined pattern for naming exported files (default `comments-{videoId}`). Holds **placeholders** that are filled with real values at Export time.

**Placeholder**:
A `{...}` token inside a **Filename template** that is replaced when the file is named: `{videoId}`, `{date}`, and `{count}` — where **count is the total number of Comments** exported (root Comments plus Replies), not the number of Threads.

## Relationships

- A **Video** is identified by exactly one **Video ID**
- An **Export** targets exactly one **Video** and **Fetches** its **Threads**
- A **Thread** has exactly one root **Comment** and zero or more **Replies**
- A **Reply** belongs to exactly one **Thread**
- A **Fetch** returns **Threads**, each carrying its **Replies**
- An **Export** is one **Fetch** followed by formatting and download
- A **Split** breaks an **Export** into files at **Thread** boundaries, at most **Split size** Threads each

## Example dialogue

> **Dev:** "When we **Fetch** a video, do we get every **Reply**?"
> **Domain expert:** "The API returns up to 5 **Replies** inline per **Thread**, and isn't guaranteed to include all of them even when there are 5 or fewer. Whenever a **Thread**'s inline **Replies** are fewer than its reported count, we **Fetch** the rest separately and stitch them in."
> **Dev:** "So a **Thread** with 200 **Replies** is still one **Thread**?"
> **Domain expert:** "Right — one root **Comment**, 200 **Replies**, one **Thread**."

## Flagged ambiguities

- "Comment" was used to mean both *any comment* and *a top-level comment* — resolved: **Comment** is the general unit; a top-level one is just "the Thread's root Comment", and a **Thread** is the root plus its **Replies**.

- "Crawl" was used loosely to describe how comments are obtained — resolved: the extension **Fetches** via the official API; it does not crawl or scrape HTML.
