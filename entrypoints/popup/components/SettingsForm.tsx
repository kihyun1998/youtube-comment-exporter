import { useTranslation } from "react-i18next";
import { InfoIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSettingsStore } from "@/lib/store/settings";
import { useCommentsStore } from "@/lib/store/comments";

export function SettingsForm() {
  const { t } = useTranslation();
  const { videoId, videoIdError, apiKey, setVideoId } = useSettingsStore();
  const { loading, comments, scan } = useCommentsStore();

  const canScan = videoId && !videoIdError && apiKey && !loading;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="video-id"
        className="flex items-center gap-1 text-xs text-muted-foreground"
      >
        {t("videoId")}
        <Tooltip>
          <TooltipTrigger asChild>
            <InfoIcon className="size-3 cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("videoIdHint1")}</p>
            <p>{t("videoIdHint2")}</p>
          </TooltipContent>
        </Tooltip>
      </label>
      <div className="flex gap-2">
        <Input
          id="video-id"
          className="placeholder:text-xs"
          placeholder={t("videoIdPlaceholder")}
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
        />
        <Button disabled={!canScan} onClick={scan}>
          {loading && comments.length === 0 ? t("loading") : t("scan")}
        </Button>
      </div>
      {videoIdError && (
        <p className="text-xs text-destructive">{t("invalidVideoId")}</p>
      )}
    </div>
  );
}
