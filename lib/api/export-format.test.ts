import { describe, it, expect } from "vitest";
import {
  splitByThreads,
  buildFilename,
  toCSV,
  toJSON,
  type ExportComment,
} from "./export";

function root(id: string): ExportComment {
  return {
    id,
    parentId: "",
    authorName: "author",
    text: `root ${id}`,
    likeCount: 0,
    publishedAt: "2020-01-01T00:00:00Z",
  };
}

function reply(id: string, parentId: string): ExportComment {
  return {
    id,
    parentId,
    authorName: "author",
    text: `reply ${id}`,
    likeCount: 0,
    publishedAt: "2020-01-01T00:00:00Z",
  };
}

describe("splitByThreads", () => {
  it("returns a single chunk when threadsPerFile <= 0 (no Split)", () => {
    const comments = [root("t1"), root("t2")];
    expect(splitByThreads(comments, 0)).toEqual([comments]);
    expect(splitByThreads(comments, -3)).toEqual([comments]);
  });

  it("splits at Thread boundaries, keeping each Thread's Replies together", () => {
    const comments = [
      root("t1"),
      reply("r1", "t1"),
      root("t2"),
      reply("r2", "t2"),
      root("t3"),
    ];
    const chunks = splitByThreads(comments, 2);
    // 2 Threads per file: [t1+r1, t2+r2] then [t3].
    expect(chunks).toHaveLength(2);
    expect(chunks[0].map((c) => c.id)).toEqual(["t1", "r1", "t2", "r2"]);
    expect(chunks[1].map((c) => c.id)).toEqual(["t3"]);
  });

  it("never breaks a Thread's Replies across two files", () => {
    const comments = [
      root("t1"),
      reply("a", "t1"),
      reply("b", "t1"),
      root("t2"),
    ];
    const chunks = splitByThreads(comments, 1);
    expect(chunks).toHaveLength(2);
    // The whole first Thread (root + both Replies) stays in one file.
    expect(chunks[0].map((c) => c.id)).toEqual(["t1", "a", "b"]);
    expect(chunks[1].map((c) => c.id)).toEqual(["t2"]);
  });
});

describe("buildFilename", () => {
  it("substitutes the {videoId} placeholder", () => {
    expect(buildFilename("comments-{videoId}", "vid123", 0)).toBe(
      "comments-vid123",
    );
  });

  it("substitutes the {count} placeholder with the Comment count", () => {
    expect(buildFilename("{videoId}-{count}", "vid", 42)).toBe("vid-42");
  });

  it("replaces every occurrence of a placeholder", () => {
    expect(buildFilename("{videoId}_{videoId}", "x", 0)).toBe("x_x");
  });

  it("renders {date} as an 8-digit YYYYMMDD string", () => {
    const out = buildFilename("{date}", "vid", 0);
    expect(out).toMatch(/^\d{8}$/);
  });

  it("leaves unknown tokens untouched", () => {
    expect(buildFilename("comments-{unknown}", "vid", 1)).toBe(
      "comments-{unknown}",
    );
  });
});

describe("toCSV", () => {
  it("emits a header row followed by one row per Comment", () => {
    const csv = toCSV([root("t1")]);
    const lines = csv.split("\n");
    expect(lines[0]).toBe("id,parentId,authorName,text,likeCount,publishedAt");
    expect(lines).toHaveLength(2);
    expect(lines[1]).toContain("t1");
  });

  it("escapes quotes by doubling them and wraps fields in quotes", () => {
    const c = { ...root("t1"), text: 'he said "hi"' };
    const row = toCSV([c]).split("\n")[1];
    expect(row).toContain('"he said ""hi"""');
  });

  it("flattens newlines inside a field to spaces so rows stay intact", () => {
    const c = { ...root("t1"), text: "line1\nline2\r\nline3" };
    const csv = toCSV([c]);
    // header + exactly one data row, no extra lines from the embedded newlines.
    expect(csv.split("\n")).toHaveLength(2);
    expect(csv).toContain('"line1 line2 line3"');
  });
});

describe("toJSON", () => {
  it("round-trips the Comments as pretty-printed JSON", () => {
    const comments = [root("t1"), reply("r1", "t1")];
    const json = toJSON(comments);
    expect(JSON.parse(json)).toEqual(comments);
    expect(json).toContain("\n"); // pretty-printed (indent = 2)
  });
});
