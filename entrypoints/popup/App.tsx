import { useEffect } from "react";
import { useSettingsStore } from "@/lib/store/settings";
import { SettingsForm } from "./components/SettingsForm";
import { ExportBar } from "./components/ExportBar";
import { CommentList } from "./components/CommentList";
import { ThemeToggle } from "./components/ThemeToggle";

function App() {
  const { loadApiKey, loadTheme, setVideoId, theme } = useSettingsStore();

  useEffect(() => {
    loadApiKey();
    loadTheme();
  }, [loadApiKey, loadTheme]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
    }
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle("dark", e.matches);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  useEffect(() => {
    browser.tabs
      .query({ active: true, currentWindow: true })
      .then(([tab]) => {
        if (!tab?.id) return;
        return browser.tabs.sendMessage(tab.id, { type: "GET_VIDEO_ID" });
      })
      .then((response) => {
        if (response?.videoId) {
          setVideoId(response.videoId);
        }
      })
      .catch(() => {});
  }, [setVideoId]);

  return (
    <div className="min-w-[340px] max-h-[500px] p-4 bg-background text-foreground flex flex-col gap-3 overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">YouTube Comment Exporter</h1>
        <ThemeToggle />
      </div>
      <SettingsForm />
      <ExportBar />
      <CommentList />
    </div>
  );
}

export default App;
