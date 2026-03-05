import { fetchComments, fetchReplies } from "./youtube";

export interface ExportComment {
  id: string;
  parentId: string;
  authorName: string;
  text: string;
  likeCount: number;
  publishedAt: string;
}

export async function fetchAllComments(
  videoId: string,
  apiKey: string,
  onProgress?: (count: number) => void,
  signal?: AbortSignal,
): Promise<ExportComment[]> {
  const all: ExportComment[] = [];
  let pageToken: string | undefined;

  do {
    signal?.throwIfAborted();
    const result = await fetchComments(videoId, apiKey, pageToken);
    for (const c of result.comments) {
      signal?.throwIfAborted();
      all.push({
        id: c.id,
        parentId: "",
        authorName: c.authorName,
        text: c.text,
        likeCount: c.likeCount,
        publishedAt: c.publishedAt,
      });

      if (c.replyCount > 0) {
        let replyPageToken: string | undefined;
        do {
          signal?.throwIfAborted();
          const replyResult = await fetchReplies(c.id, apiKey, replyPageToken);
          for (const r of replyResult.replies) {
            all.push({
              id: r.id,
              parentId: r.parentId,
              authorName: r.authorName,
              text: r.text,
              likeCount: r.likeCount,
              publishedAt: r.publishedAt,
            });
          }
          replyPageToken = replyResult.nextPageToken;
        } while (replyPageToken);
      }

      onProgress?.(all.length);
    }
    pageToken = result.nextPageToken;
  } while (pageToken);

  return all;
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
