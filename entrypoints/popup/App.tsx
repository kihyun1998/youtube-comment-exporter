import { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

function App() {
  const { videoId, apiKey, apiKeyLoaded, setVideoId, setApiKey, loadApiKey } =
    useAppStore();

  useEffect(() => {
    loadApiKey();
  }, [loadApiKey]);

  useEffect(() => {
    browser.tabs
      .query({ active: true, currentWindow: true })
      .then(([tab]) => {
        if (!tab?.id) return;
        return browser.tabs.sendMessage(tab.id, { type: 'GET_VIDEO_ID' });
      })
      .then((response) => {
        if (response?.videoId) {
          setVideoId(response.videoId);
        }
      })
      .catch(() => {});
  }, [setVideoId]);

  const canScan = videoId && apiKey;

  return (
    <div className="min-w-[300px] p-4 bg-background text-foreground flex flex-col gap-3">
      <h1 className="text-lg font-bold">YouTube Comment Exporter</h1>

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
          <Button
            size="sm"
            disabled={!canScan}
            onClick={() => {
              // TODO: next step - fetch comments
              console.log('Fetch comments for:', videoId, 'with key:', apiKey);
            }}
          >
            Scan
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
