import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchAllComments } from "./export";
import { fetchComments, fetchReplies, fetchCommentCount } from "./youtube";
import type { Comment, CommentThread } from "../types";

vi.mock("./youtube");

const mockedFetchComments = vi.mocked(fetchComments);
const mockedFetchReplies = vi.mocked(fetchReplies);
const mockedFetchCommentCount = vi.mocked(fetchCommentCount);

function reply(id: string, parentId: string): Comment {
  return {
    id,
    parentId,
    authorName: "author",
    authorProfileImage: "",
    text: `reply ${id}`,
    likeCount: 0,
    publishedAt: "2020-01-01T00:00:00Z",
  };
}

function thread(
  id: string,
  replyCount: number,
  inlineReplies: Comment[],
): CommentThread {
  return {
    id,
    parentId: "",
    authorName: "author",
    authorProfileImage: "",
    text: `thread ${id}`,
    likeCount: 0,
    publishedAt: "2020-01-01T00:00:00Z",
    replyCount,
    replies: inlineReplies,
  };
}

// fetchComments returns a single page containing the given threads.
function singlePage(threads: CommentThread[]) {
  mockedFetchComments.mockResolvedValue({
    comments: threads,
    nextPageToken: undefined,
    totalResults: threads.length,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mockedFetchCommentCount.mockResolvedValue(0);
});

describe("fetchAllComments — inline-Reply completeness", () => {
  it("fully fetches a Thread whose inline Replies are incomplete even with <=5 replies (regression guard for the #3 fix)", async () => {
    // Reported 3 replies, but only 1 delivered inline → must trigger a full fetch.
    singlePage([thread("t1", 3, [reply("inline-1", "t1")])]);
    mockedFetchReplies.mockResolvedValue({
      replies: [reply("full-1", "t1"), reply("full-2", "t1"), reply("full-3", "t1")],
      nextPageToken: undefined,
    });

    const result = await fetchAllComments("video", "key");

    // The full fetch ran for this Thread...
    expect(mockedFetchReplies).toHaveBeenCalledWith("t1", "key", undefined);
    // ...and the inline Reply was replaced by the fully-fetched Replies.
    const replyIds = result.filter((c) => c.parentId === "t1").map((c) => c.id);
    expect(replyIds).toEqual(["full-1", "full-2", "full-3"]);
    expect(replyIds).not.toContain("inline-1");
    // Under the old `replyCount > 5` logic this Thread (3) would NOT be fetched,
    // so the result would still hold "inline-1" and this assertion would fail.
  });

  it("does NOT fetch Replies for a Thread whose inline Replies already match its reported count", async () => {
    singlePage([thread("t2", 2, [reply("i1", "t2"), reply("i2", "t2")])]);

    const result = await fetchAllComments("video", "key");

    expect(mockedFetchReplies).not.toHaveBeenCalled();
    const replyIds = result.filter((c) => c.parentId === "t2").map((c) => c.id);
    expect(replyIds).toEqual(["i1", "i2"]);
  });

  it("still fully fetches a Thread with more than 5 Replies", async () => {
    const inline = Array.from({ length: 5 }, (_, i) => reply(`i${i}`, "t3"));
    singlePage([thread("t3", 8, inline)]);
    const full = Array.from({ length: 8 }, (_, i) => reply(`full-${i}`, "t3"));
    mockedFetchReplies.mockResolvedValue({
      replies: full,
      nextPageToken: undefined,
    });

    const result = await fetchAllComments("video", "key");

    expect(mockedFetchReplies).toHaveBeenCalledWith("t3", "key", undefined);
    const replyIds = result.filter((c) => c.parentId === "t3").map((c) => c.id);
    expect(replyIds).toEqual(full.map((r) => r.id));
  });

  it("fetches across multiple comment pages", async () => {
    mockedFetchComments
      .mockResolvedValueOnce({
        comments: [thread("t1", 0, [])],
        nextPageToken: "PAGE2",
        totalResults: 2,
      })
      .mockResolvedValueOnce({
        comments: [thread("t2", 0, [])],
        nextPageToken: undefined,
        totalResults: 2,
      });

    const result = await fetchAllComments("video", "key");

    expect(mockedFetchComments).toHaveBeenCalledTimes(2);
    expect(result.map((c) => c.id)).toEqual(["t1", "t2"]);
  });

  it("rejects cleanly when the AbortSignal is already aborted before the run", async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(
      fetchAllComments("video", "key", undefined, controller.signal),
    ).rejects.toThrow();
    // Aborted up front: not even the first comment page is requested.
    expect(mockedFetchComments).not.toHaveBeenCalled();
  });

  it("rejects mid-Fetch when the signal is aborted between comment pages", async () => {
    const controller = new AbortController();
    // First page returns with a nextPageToken and aborts the signal as a side
    // effect; the loop's in-iteration abort check must then reject before
    // requesting page 2. (Guards the throwIfAborted at the top of the page loop.)
    mockedFetchComments.mockImplementation(async (_videoId, _apiKey, pageToken) => {
      if (!pageToken) {
        controller.abort();
        return {
          comments: [thread("t1", 0, [])],
          nextPageToken: "PAGE2",
          totalResults: 1,
        };
      }
      return { comments: [], nextPageToken: undefined, totalResults: 1 };
    });

    await expect(
      fetchAllComments("video", "key", undefined, controller.signal),
    ).rejects.toThrow();
    // Only the first page was fetched; the abort stopped the next iteration.
    expect(mockedFetchComments).toHaveBeenCalledTimes(1);
  });

  it("rejects mid-Fetch when the signal is aborted before an incomplete Thread's Reply fetch", async () => {
    const controller = new AbortController();
    // The comment page aborts the signal, then an incomplete Thread (3 reported,
    // 1 inline) would trigger a Reply fetch — which must reject on its own abort
    // check before any reply request. (Guards the throwIfAborted in reply paging.)
    mockedFetchComments.mockImplementation(async () => {
      controller.abort();
      return {
        comments: [thread("t1", 3, [reply("inline-1", "t1")])],
        nextPageToken: undefined,
        totalResults: 1,
      };
    });

    await expect(
      fetchAllComments("video", "key", undefined, controller.signal),
    ).rejects.toThrow();
    // The Reply fetch never issued a network request — it aborted first.
    expect(mockedFetchReplies).not.toHaveBeenCalled();
  });
});
