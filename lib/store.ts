import { create } from 'zustand';

interface AppState {
  videoId: string;
  apiKey: string;
  setVideoId: (videoId: string) => void;
  setApiKey: (apiKey: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  videoId: '',
  apiKey: localStorage.getItem('yt-api-key') ?? '',
  setVideoId: (videoId) => set({ videoId }),
  setApiKey: (apiKey) => {
    localStorage.setItem('yt-api-key', apiKey);
    set({ apiKey });
  },
}));
