import { create } from "zustand";
import { fetchComments } from "../api/youtube";
import { useSettingsStore } from "./settings";
import type { CommentThread } from "../types";

interface CommentsState {
  comments: CommentThread[];
  nextPageToken?: string;
  totalResults: number;
  loading: boolean;
  error: string;
  scan: () => Promise<void>;
  loadMore: () => Promise<void>;
  reset: () => void;
}

export const useCommentsStore = create<CommentsState>((set, get) => ({
  comments: [],
  nextPageToken: undefined,
  totalResults: 0,
  loading: false,
  error: "",
  scan: async () => {
    const { videoId, apiKey } = useSettingsStore.getState();
    set({
      loading: true,
      error: "",
      comments: [],
      nextPageToken: undefined,
      totalResults: 0,
    });
    try {
      const result = await fetchComments(videoId, apiKey);
      set({
        comments: result.comments,
        nextPageToken: result.nextPageToken,
        totalResults: result.totalResults,
        loading: false,
      });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },
  loadMore: async () => {
    const { videoId, apiKey } = useSettingsStore.getState();
    const { nextPageToken, comments } = get();
    if (!nextPageToken) return;
    set({ loading: true, error: "" });
    try {
      const result = await fetchComments(videoId, apiKey, nextPageToken);
      set({
        comments: [...comments, ...result.comments],
        nextPageToken: result.nextPageToken,
        totalResults: result.totalResults,
        loading: false,
      });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },
  reset: () =>
    set({ comments: [], nextPageToken: undefined, totalResults: 0, error: "" }),
}));
