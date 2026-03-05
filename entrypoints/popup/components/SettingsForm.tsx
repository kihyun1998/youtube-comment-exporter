import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/lib/store/settings";
import { useCommentsStore } from "@/lib/store/comments";

export function SettingsForm() {
  const { videoId, apiKey, setVideoId, setApiKey } = useSettingsStore();
  const { loading, comments, scan } = useCommentsStore();

  const canScan = videoId && apiKey && !loading;

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="api-key" className="text-sm text-muted-foreground">
          API Key
        </label>
        <Input
          id="api-key"
          type="password"
          placeholder="YouTube Data API v3 key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="video-id" className="text-sm text-muted-foreground">
          Video ID
        </label>
        <div className="flex gap-2">
          <Input
            id="video-id"
            placeholder="e.g. dQw4w9WgXcQ"
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
          />
          <Button size="sm" disabled={!canScan} onClick={scan}>
            {loading && comments.length === 0 ? "Loading..." : "Scan"}
          </Button>
        </div>
      </div>
    </>
  );
}
