import { fetchCommentCount, fetchComments, fetchReplies } from "./youtube";

export interface ExportComment {
  id: string;
  parentId: string;
  authorName: string;
  text: string;
  likeCount: number;
  publishedAt: string;
}

const MAX_CONCURRENCY = 8;

async function fetchAllReplies(
  parentId: string,
  apiKey: string,
  signal?: AbortSignal,
): Promise<ExportComment[]> {
  const replies: ExportComment[] = [];
  let pageToken: string | undefined;
  do {
    signal?.throwIfAborted();
    const result = await fetchReplies(parentId, apiKey, pageToken);
    for (const r of result.replies) {
      replies.push({
        id: r.id,
        parentId: r.parentId,
        authorName: r.authorName,
        text: r.text,
        likeCount: r.likeCount,
        publishedAt: r.publishedAt,
      });
    }
    pageToken = result.nextPageToken;
  } while (pageToken);
  return replies;
}

async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  limit: number,
): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let idx = 0;

  async function worker() {
    while (idx < tasks.length) {
      const i = idx++;
      results[i] = await tasks[i]();
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, tasks.length) }, () => worker()),
  );
  return results;
}

export interface ExportProgress {
  fetched: number;
  total: number;
}

export async function fetchAllComments(
  videoId: string,
  apiKey: string,
  onProgress?: (progress: ExportProgress) => void,
  signal?: AbortSignal,
): Promise<ExportComment[]> {
  const all: ExportComment[] = [];
  let pageToken: string | undefined;

  signal?.throwIfAborted();
  const total = await fetchCommentCount(videoId, apiKey);

  do {
    signal?.throwIfAborted();
    const result = await fetchComments(videoId, apiKey, pageToken);

    // Add top-level comments and inline replies (up to 5 per thread)
    for (const c of result.comments) {
      all.push({
        id: c.id,
        parentId: "",
        authorName: c.authorName,
        text: c.text,
        likeCount: c.likeCount,
        publishedAt: c.publishedAt,
      });
      if (c.replies) {
        for (const r of c.replies) {
          all.push({
            id: r.id,
            parentId: r.parentId,
            authorName: r.authorName,
            text: r.text,
            likeCount: r.likeCount,
            publishedAt: r.publishedAt,
          });
        }
      }
    }
    onProgress?.({ fetched: all.length, total });

    // Threads with >5 replies need full fetch (inline only returns up to 5)
    const needFullReplies = result.comments.filter((c) => c.replyCount > 5);
    if (needFullReplies.length > 0) {
      const tasks = needFullReplies.map(
        (c) => () => fetchAllReplies(c.id, apiKey, signal),
      );
      const repliesPerThread = await runWithConcurrency(tasks, MAX_CONCURRENCY);

      // Replace inline replies with full replies for these threads
      for (let i = 0; i < needFullReplies.length; i++) {
        const threadId = needFullReplies[i].id;
        // Remove previously added inline replies for this thread
        const removeStart = all.findIndex((x) => x.parentId === threadId);
        if (removeStart !== -1) {
          let removeEnd = removeStart;
          while (removeEnd < all.length && all[removeEnd].parentId === threadId)
            removeEnd++;
          all.splice(
            removeStart,
            removeEnd - removeStart,
            ...repliesPerThread[i],
          );
        } else {
          all.push(...repliesPerThread[i]);
        }
      }
      onProgress?.({ fetched: all.length, total });
    }

    pageToken = result.nextPageToken;
  } while (pageToken);

  return all;
}

export function splitByThreads(
  comments: ExportComment[],
  threadsPerFile: number,
): ExportComment[][] {
  if (threadsPerFile <= 0) return [comments];

  const chunks: ExportComment[][] = [];
  let chunk: ExportComment[] = [];
  let threadCount = 0;

  for (const c of comments) {
    if (c.parentId === "") {
      if (threadCount > 0 && threadCount % threadsPerFile === 0) {
        chunks.push(chunk);
        chunk = [];
      }
      threadCount++;
    }
    chunk.push(c);
  }
  if (chunk.length > 0) chunks.push(chunk);

  return chunks;
}

export function buildFilename(
  template: string,
  videoId: string,
  count: number,
): string {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  return template
    .replace(/\{videoId\}/g, videoId)
    .replace(/\{date\}/g, date)
    .replace(/\{count\}/g, String(count));
}

export function toCSV(comments: ExportComment[]): string {
  const escape = (s: string) =>
    `"${s.replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;

  const header = "id,parentId,authorName,text,likeCount,publishedAt";
  const rows = comments.map(
    (c) =>
      `${c.id},${c.parentId},${escape(c.authorName)},${escape(c.text)},${c.likeCount},${c.publishedAt}`,
  );
  return [header, ...rows].join("\n");
}

export function toJSON(comments: ExportComment[]): string {
  return JSON.stringify(comments, null, 2);
}

export function download(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
