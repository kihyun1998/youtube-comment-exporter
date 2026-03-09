import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useSettingsStore } from "@/lib/store/settings";
import { Heart, SettingsIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CommentList } from "./components/CommentList";
import { ExportBar } from "./components/ExportBar";
import { SettingsForm } from "./components/SettingsForm";
import { SettingsPage } from "./components/SettingsPage";
import { ThemeToggle } from "./components/ThemeToggle";

type View = "main" | "settings";

function App() {
  const { t } = useTranslation();
  const {
    loadApiKey,
    loadTheme,
    loadSplitSize,
    loadFilenameTemplate,
    setVideoId,
    theme,
    apiKey,
    apiKeyLoaded,
  } = useSettingsStore();
  const [view, setView] = useState<View>("main");

  useEffect(() => {
    loadApiKey();
    loadTheme();
    loadSplitSize();
    loadFilenameTemplate();
  }, [loadApiKey, loadTheme, loadSplitSize, loadFilenameTemplate]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
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
    <TooltipProvider>
      <div className="min-w-[340px] max-h-[500px] p-4 bg-background text-foreground flex flex-col gap-3 overflow-hidden">
        {view === "settings" ? (
          <SettingsPage onBack={() => setView("main")} />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold">{t("title")}</h1>
              <div className="flex items-center gap-1">
                <ThemeToggle />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setView("settings")}
                >
                  <SettingsIcon className="size-4" />
                </Button>
              </div>
            </div>
            {apiKeyLoaded && !apiKey && (
              <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-md bg-accent text-accent-foreground">
                <span className="flex-1">{t("apiKeyMissing")}</span>
                <Button
                  variant="outline"
                  size="xs"
                  className="shrink-0"
                  onClick={() => setView("settings")}
                >
                  {t("settings")}
                </Button>
              </div>
            )}
            <SettingsForm />
            <ExportBar />
            <CommentList />
            <a
              href="https://ko-fi.com/just_kihyun"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              <Heart className="size-3" />
              <span>Support on Ko-fi</span>
            </a>
          </>
        )}
      </div>
    </TooltipProvider>
  );
}

export default App;
