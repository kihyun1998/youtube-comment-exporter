import { create } from "zustand";
import i18n from "@/lib/i18n";

const VIDEO_ID_RE = /^[A-Za-z0-9_-]{11}$/;

function extractVideoId(input: string): { id: string; error: boolean } {
  const trimmed = input.trim();
  if (!trimmed) return { id: "", error: false };

  try {
    const url = new URL(trimmed);
    if (url.hostname.includes("youtube.com")) {
      const v = url.searchParams.get("v");
      if (v && VIDEO_ID_RE.test(v)) return { id: v, error: false };
      return { id: trimmed, error: true };
    }
    if (url.hostname === "youtu.be") {
      const v = url.pathname.slice(1);
      if (VIDEO_ID_RE.test(v)) return { id: v, error: false };
      return { id: trimmed, error: true };
    }
  } catch {
    // not a URL, treat as raw video ID
  }

  if (VIDEO_ID_RE.test(trimmed)) return { id: trimmed, error: false };
  return { id: trimmed, error: true };
}

export type Theme = "light" | "dark" | "system";
export type Language =
  | "en"
  | "ko"
  | "ja"
  | "zh-CN"
  | "zh-TW"
  | "es"
  | "pt"
  | "de"
  | "fr"
  | "hi"
  | "id"
  | "vi"
  | "th"
  | "ru"
  | "tr"
  | "ar";

interface SettingsState {
  videoId: string;
  videoIdError: boolean;
  apiKey: string;
  apiKeyLoaded: boolean;
  theme: Theme;
  themeLoaded: boolean;
  language: Language;
  setVideoId: (videoId: string) => void;
  setApiKey: (apiKey: string) => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  loadApiKey: () => Promise<void>;
  loadTheme: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  videoId: "",
  videoIdError: false,
  apiKey: "",
  apiKeyLoaded: false,
  theme: "system",
  themeLoaded: false,
  language: (i18n.language as Language) ?? "en",
  setVideoId: (input) => {
    const { id, error } = extractVideoId(input);
    set({ videoId: id, videoIdError: error });
  },
  setApiKey: (apiKey) => {
    browser.storage.local.set({ "yt-api-key": apiKey });
    set({ apiKey });
  },
  setTheme: (theme) => {
    browser.storage.local.set({ "yt-theme": theme });
    set({ theme });
  },
  setLanguage: (language) => {
    browser.storage.local.set({ "yt-lang": language });
    i18n.changeLanguage(language);
    set({ language });
  },
  loadApiKey: async () => {
    const result = await browser.storage.local.get("yt-api-key");
    set({ apiKey: (result["yt-api-key"] as string) ?? "", apiKeyLoaded: true });
  },
  loadTheme: async () => {
    const result = await browser.storage.local.get("yt-theme");
    set({
      theme: (result["yt-theme"] as Theme) ?? "system",
      themeLoaded: true,
    });
  },
}));
