import type { CommentThread, FetchCommentsResult } from "../types";

export async function fetchComments(
  videoId: string,
  apiKey: string,
  pageToken?: string,
): Promise<FetchCommentsResult> {
  const params = new URLSearchParams({
    part: "snippet",
    videoId,
    key: apiKey,
    maxResults: "100",
    order: "relevance",
    textFormat: "plainText",
  });
  if (pageToken) params.set("pageToken", pageToken);

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/commentThreads?${params}`,
  );

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    const msg = err?.error?.message ?? `HTTP ${res.status}`;
    throw new Error(msg);
  }

  const data = await res.json();

  const comments: CommentThread[] = data.items.map((item: any) => {
    const s = item.snippet.topLevelComment.snippet;
    return {
      id: item.id,
      authorName: s.authorDisplayName,
      authorProfileImage: s.authorProfileImageUrl,
      text: s.textDisplay,
      likeCount: s.likeCount,
      publishedAt: s.publishedAt,
      replyCount: item.snippet.totalReplyCount,
    };
  });

  return {
    comments,
    nextPageToken: data.nextPageToken,
    totalResults: data.pageInfo.totalResults,
  };
}
