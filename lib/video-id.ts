/**
 * A Video ID is the 11-character code that identifies a Video (see CONTEXT.md).
 * The user may supply it as a raw ID or inside a full YouTube URL; this module
 * extracts and validates it. Kept dependency-free so it stays trivially testable.
 */
export const VIDEO_ID_RE = /^[A-Za-z0-9_-]{11}$/;

export function extractVideoId(input: string): { id: string; error: boolean } {
  const trimmed = input.trim();
  if (!trimmed) return { id: "", error: false };

  try {
    const url = new URL(trimmed);
    if (url.hostname.includes("youtube.com")) {
      const v = url.searchParams.get("v");
      if (v && VIDEO_ID_RE.test(v)) return { id: v, error: false };
      return { id: trimmed, error: true };
    }
    if (url.hostname === "youtu.be") {
      const v = url.pathname.slice(1);
      if (VIDEO_ID_RE.test(v)) return { id: v, error: false };
      return { id: trimmed, error: true };
    }
  } catch {
    // not a URL, treat as raw video ID
  }

  if (VIDEO_ID_RE.test(trimmed)) return { id: trimmed, error: false };
  return { id: trimmed, error: true };
}
