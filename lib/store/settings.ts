import { create } from "zustand";

function extractVideoId(input: string): string {
  const trimmed = input.trim();
  try {
    const url = new URL(trimmed);
    if (url.hostname.includes("youtube.com")) {
      return url.searchParams.get("v") ?? trimmed;
    }
    if (url.hostname === "youtu.be") {
      return url.pathname.slice(1);
    }
  } catch {
    // not a URL, treat as raw video ID
  }
  return trimmed;
}

interface SettingsState {
  videoId: string;
  apiKey: string;
  apiKeyLoaded: boolean;
  setVideoId: (videoId: string) => void;
  setApiKey: (apiKey: string) => void;
  loadApiKey: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  videoId: "",
  apiKey: "",
  apiKeyLoaded: false,
  setVideoId: (input) => set({ videoId: extractVideoId(input) }),
  setApiKey: (apiKey) => {
    browser.storage.local.set({ "yt-api-key": apiKey });
    set({ apiKey });
  },
  loadApiKey: async () => {
    const result = await browser.storage.local.get("yt-api-key");
    set({ apiKey: (result["yt-api-key"] as string) ?? "", apiKeyLoaded: true });
  },
}));
