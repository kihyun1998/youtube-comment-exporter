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

export type Theme = "light" | "dark" | "system";

interface SettingsState {
  videoId: string;
  apiKey: string;
  apiKeyLoaded: boolean;
  theme: Theme;
  themeLoaded: boolean;
  setVideoId: (videoId: string) => void;
  setApiKey: (apiKey: string) => void;
  setTheme: (theme: Theme) => void;
  loadApiKey: () => Promise<void>;
  loadTheme: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  videoId: "",
  apiKey: "",
  apiKeyLoaded: false,
  theme: "system",
  themeLoaded: false,
  setVideoId: (input) => set({ videoId: extractVideoId(input) }),
  setApiKey: (apiKey) => {
    browser.storage.local.set({ "yt-api-key": apiKey });
    set({ apiKey });
  },
  setTheme: (theme) => {
    browser.storage.local.set({ "yt-theme": theme });
    set({ theme });
  },
  loadApiKey: async () => {
    const result = await browser.storage.local.get("yt-api-key");
    set({ apiKey: (result["yt-api-key"] as string) ?? "", apiKeyLoaded: true });
  },
  loadTheme: async () => {
    const result = await browser.storage.local.get("yt-theme");
    set({ theme: (result["yt-theme"] as Theme) ?? "system", themeLoaded: true });
  },
}));
