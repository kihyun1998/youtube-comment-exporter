import { describe, it, expect } from "vitest";
import { extractVideoId } from "./video-id";

const ID = "dQw4w9WgXcQ"; // a valid 11-char Video ID

describe("extractVideoId", () => {
  it("accepts a raw 11-character Video ID", () => {
    expect(extractVideoId(ID)).toEqual({ id: ID, error: false });
  });

  it("trims surrounding whitespace", () => {
    expect(extractVideoId(`  ${ID}  `)).toEqual({ id: ID, error: false });
  });

  it("treats empty / whitespace-only input as not-an-error empty", () => {
    expect(extractVideoId("")).toEqual({ id: "", error: false });
    expect(extractVideoId("   ")).toEqual({ id: "", error: false });
  });

  it("pulls the Video ID from a watch URL's v= param", () => {
    expect(
      extractVideoId(`https://www.youtube.com/watch?v=${ID}&t=42s`),
    ).toEqual({ id: ID, error: false });
  });

  it("pulls the Video ID from a youtu.be short link", () => {
    expect(extractVideoId(`https://youtu.be/${ID}`)).toEqual({
      id: ID,
      error: false,
    });
  });

  it("handles youtube.com subdomains (m., music.)", () => {
    expect(extractVideoId(`https://m.youtube.com/watch?v=${ID}`)).toEqual({
      id: ID,
      error: false,
    });
  });

  it("flags a YouTube URL that lacks a valid Video ID", () => {
    const url = "https://www.youtube.com/watch?v=tooShort";
    expect(extractVideoId(url)).toEqual({ id: url, error: true });
  });

  it("flags a youtu.be URL whose path is not a valid Video ID", () => {
    const url = "https://youtu.be/nope";
    expect(extractVideoId(url)).toEqual({ id: url, error: true });
  });

  it("flags a non-URL, non-ID string as an error", () => {
    expect(extractVideoId("just some text")).toEqual({
      id: "just some text",
      error: true,
    });
  });

  it("rejects an ID of the wrong length", () => {
    expect(extractVideoId("abc")).toEqual({ id: "abc", error: true });
    expect(extractVideoId("a".repeat(12))).toEqual({
      id: "a".repeat(12),
      error: true,
    });
  });
});
