import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchComments, fetchReplies, fetchCommentCount } from "./youtube";

function mockFetchOnce(body: unknown, ok = true, status = 200) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => body,
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchComments", () => {
  it("maps a Thread's root Comment and inline Replies from the API shape", async () => {
    const fetchMock = mockFetchOnce({
      items: [
        {
          id: "t1",
          snippet: {
            totalReplyCount: 1,
            topLevelComment: {
              snippet: {
                authorDisplayName: "Alice",
                authorProfileImageUrl: "http://img/alice",
                textDisplay: "top comment",
                likeCount: 5,
                publishedAt: "2020-01-01T00:00:00Z",
              },
            },
          },
          replies: {
            comments: [
              {
                id: "r1",
                snippet: {
                  parentId: "t1",
                  authorDisplayName: "Bob",
                  authorProfileImageUrl: "http://img/bob",
                  textDisplay: "a reply",
                  likeCount: 2,
                  publishedAt: "2020-01-02T00:00:00Z",
                },
              },
            ],
          },
        },
      ],
      nextPageToken: "NEXT",
      pageInfo: { totalResults: 1 },
    });

    const result = await fetchComments("vid", "key");

    expect(result.nextPageToken).toBe("NEXT");
    expect(result.totalResults).toBe(1);
    expect(result.comments).toHaveLength(1);
    const thread = result.comments[0];
    expect(thread).toMatchObject({
      id: "t1",
      parentId: "",
      authorName: "Alice",
      text: "top comment",
      likeCount: 5,
      replyCount: 1,
    });
    expect(thread.replies).toEqual([
      {
        id: "r1",
        parentId: "t1",
        authorName: "Bob",
        authorProfileImage: "http://img/bob",
        text: "a reply",
        likeCount: 2,
        publishedAt: "2020-01-02T00:00:00Z",
      },
    ]);

    // The request targets the commentThreads endpoint with the right params.
    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain("/youtube/v3/commentThreads");
    expect(url).toContain("videoId=vid");
    expect(url).toContain("key=key");
  });

  it("defaults replies to an empty array when the Thread has none", async () => {
    mockFetchOnce({
      items: [
        {
          id: "t1",
          snippet: {
            totalReplyCount: 0,
            topLevelComment: {
              snippet: {
                authorDisplayName: "Alice",
                authorProfileImageUrl: "",
                textDisplay: "lonely",
                likeCount: 0,
                publishedAt: "2020-01-01T00:00:00Z",
              },
            },
          },
        },
      ],
      pageInfo: { totalResults: 1 },
    });

    const result = await fetchComments("vid", "key");
    expect(result.comments[0].replies).toEqual([]);
    expect(result.nextPageToken).toBeUndefined();
  });

  it("forwards a pageToken when provided", async () => {
    const fetchMock = mockFetchOnce({ items: [], pageInfo: { totalResults: 0 } });
    await fetchComments("vid", "key", "PAGE2");
    expect(String(fetchMock.mock.calls[0][0])).toContain("pageToken=PAGE2");
  });

  it("throws the API error message on a non-ok response", async () => {
    mockFetchOnce({ error: { message: "quotaExceeded" } }, false, 403);
    await expect(fetchComments("vid", "key")).rejects.toThrow("quotaExceeded");
  });

  it("falls back to an HTTP status message when no error body is present", async () => {
    mockFetchOnce(null, false, 500);
    await expect(fetchComments("vid", "key")).rejects.toThrow("HTTP 500");
  });
});

describe("fetchCommentCount", () => {
  it("reads the numeric commentCount from video statistics", async () => {
    mockFetchOnce({ items: [{ statistics: { commentCount: "1234" } }] });
    expect(await fetchCommentCount("vid", "key")).toBe(1234);
  });

  it("returns 0 on a non-ok response instead of throwing", async () => {
    mockFetchOnce(null, false, 404);
    expect(await fetchCommentCount("vid", "key")).toBe(0);
  });

  it("returns 0 when statistics are absent", async () => {
    mockFetchOnce({ items: [] });
    expect(await fetchCommentCount("vid", "key")).toBe(0);
  });
});

describe("fetchReplies", () => {
  it("maps Reply items and returns the nextPageToken", async () => {
    const fetchMock = mockFetchOnce({
      items: [
        {
          id: "r1",
          snippet: {
            parentId: "t1",
            authorDisplayName: "Bob",
            authorProfileImageUrl: "http://img/bob",
            textDisplay: "reply text",
            likeCount: 3,
            publishedAt: "2020-01-02T00:00:00Z",
          },
        },
      ],
      nextPageToken: "MORE",
    });

    const result = await fetchReplies("t1", "key");
    expect(result.nextPageToken).toBe("MORE");
    expect(result.replies).toEqual([
      {
        id: "r1",
        parentId: "t1",
        authorName: "Bob",
        authorProfileImage: "http://img/bob",
        text: "reply text",
        likeCount: 3,
        publishedAt: "2020-01-02T00:00:00Z",
      },
    ]);

    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain("/youtube/v3/comments");
    expect(url).toContain("parentId=t1");
  });

  it("throws the API error message on a non-ok response", async () => {
    mockFetchOnce({ error: { message: "commentsDisabled" } }, false, 403);
    await expect(fetchReplies("t1", "key")).rejects.toThrow("commentsDisabled");
  });
});
