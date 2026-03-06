import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/lib/store/settings";
import { useCommentsStore } from "@/lib/store/comments";

export function SettingsForm() {
  const { t } = useTranslation();
  const { videoId, apiKey, setVideoId } = useSettingsStore();
  const { loading, comments, scan } = useCommentsStore();

  const canScan = videoId && apiKey && !loading;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="video-id" className="text-sm text-muted-foreground">
        {t("videoId")}
      </label>
      <div className="flex gap-2">
        <Input
          id="video-id"
          placeholder={t("videoIdPlaceholder")}
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
        />
        <Button disabled={!canScan} onClick={scan}>
          {loading && comments.length === 0 ? t("loading") : t("scan")}
        </Button>
      </div>
    </div>
  );
}
