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
  it("fully fetches a Thread whose inline Replies are incomplete even with <=5 replies (regression for #2)", async () => {
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

  it("rejects cleanly when the AbortSignal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(
      fetchAllComments("video", "key", undefined, controller.signal),
    ).rejects.toThrow();
  });
});
