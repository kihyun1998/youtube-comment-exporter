import type {
  Comment,
  CommentThread,
  FetchCommentsResult,
  FetchRepliesResult,
} from "../types";

export async function fetchComments(
  videoId: string,
  apiKey: string,
  pageToken?: string,
): Promise<FetchCommentsResult> {
  const params = new URLSearchParams({
    part: "snippet,replies",
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
    const inlineReplies: Comment[] =
      item.replies?.comments?.map((r: any) => ({
        id: r.id,
        parentId: r.snippet.parentId,
        authorName: r.snippet.authorDisplayName,
        authorProfileImage: r.snippet.authorProfileImageUrl,
        text: r.snippet.textDisplay,
        likeCount: r.snippet.likeCount,
        publishedAt: r.snippet.publishedAt,
      })) ?? [];
    return {
      id: item.id,
      parentId: "",
      authorName: s.authorDisplayName,
      authorProfileImage: s.authorProfileImageUrl,
      text: s.textDisplay,
      likeCount: s.likeCount,
      publishedAt: s.publishedAt,
      replyCount: item.snippet.totalReplyCount,
      replies: inlineReplies,
    };
  });

  return {
    comments,
    nextPageToken: data.nextPageToken,
    totalResults: data.pageInfo.totalResults,
  };
}

export async function fetchCommentCount(
  videoId: string,
  apiKey: string,
): Promise<number> {
  const params = new URLSearchParams({
    part: "statistics",
    id: videoId,
    key: apiKey,
  });

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?${params}`,
  );

  if (!res.ok) {
    return 0;
  }

  const data = await res.json();
  return Number(data.items?.[0]?.statistics?.commentCount ?? 0);
}

export async function fetchReplies(
  parentId: string,
  apiKey: string,
  pageToken?: string,
): Promise<FetchRepliesResult> {
  const params = new URLSearchParams({
    part: "snippet",
    parentId,
    key: apiKey,
    maxResults: "100",
    textFormat: "plainText",
  });
  if (pageToken) params.set("pageToken", pageToken);

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/comments?${params}`,
  );

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    const msg = err?.error?.message ?? `HTTP ${res.status}`;
    throw new Error(msg);
  }

  const data = await res.json();

  const replies: Comment[] = data.items.map((item: any) => {
    const s = item.snippet;
    return {
      id: item.id,
      parentId: s.parentId,
      authorName: s.authorDisplayName,
      authorProfileImage: s.authorProfileImageUrl,
      text: s.textDisplay,
      likeCount: s.likeCount,
      publishedAt: s.publishedAt,
    };
  });

  return {
    replies,
    nextPageToken: data.nextPageToken,
  };
}
