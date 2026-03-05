import { useEffect } from "react";
import { useSettingsStore } from "@/lib/store/settings";
import { SettingsForm } from "./components/SettingsForm";
import { CommentList } from "./components/CommentList";

function App() {
  const { loadApiKey, setVideoId } = useSettingsStore();

  useEffect(() => {
    loadApiKey();
  }, [loadApiKey]);

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
      <h1 className="text-lg font-bold">YouTube Comment Exporter</h1>
      <SettingsForm />
      <CommentList />
    </div>
  );
}

export default App;
