import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/lib/store/settings";
import { SettingsForm } from "./components/SettingsForm";
import { SettingsPage } from "./components/SettingsPage";
import { ExportBar } from "./components/ExportBar";
import { CommentList } from "./components/CommentList";
import { ThemeToggle } from "./components/ThemeToggle";

type View = "main" | "settings";

function App() {
  const { t } = useTranslation();
  const { loadApiKey, loadTheme, setVideoId, theme } = useSettingsStore();
  const [view, setView] = useState<View>("main");

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
      {view === "settings" ? (
        <SettingsPage onBack={() => setView("main")} />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold">{t("title")}</h1>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <Button variant="ghost" size="icon-sm" onClick={() => setView("settings")}>
                <SettingsIcon className="size-4" />
              </Button>
            </div>
          </div>
          <SettingsForm />
          <ExportBar />
          <CommentList />
        </>
      )}
    </div>
  );
}

export default App;
