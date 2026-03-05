import { create } from "zustand";

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
  setVideoId: (videoId) => set({ videoId }),
  setApiKey: (apiKey) => {
    browser.storage.local.set({ "yt-api-key": apiKey });
    set({ apiKey });
  },
  loadApiKey: async () => {
    const result = await browser.storage.local.get("yt-api-key");
    set({ apiKey: (result["yt-api-key"] as string) ?? "", apiKeyLoaded: true });
  },
}));
