import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSettingsStore } from "@/lib/store/settings";
import {
  fetchAllComments,
  toCSV,
  toJSON,
  download,
  type ExportProgress,
} from "@/lib/api/export";

type ExportFormat = "json" | "csv";

export function ExportBar() {
  const { t } = useTranslation();
  const [format, setFormat] = useState<ExportFormat>("json");
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState<ExportProgress>({
    fetched: 0,
    total: 0,
  });
  const [elapsed, setElapsed] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const exportAs = async (fmt: ExportFormat) => {
    const { videoId, apiKey } = useSettingsStore.getState();
    if (!videoId || !apiKey) return;

    const controller = new AbortController();
    abortRef.current = controller;
    setExporting(true);
    setProgress({ fetched: 0, total: 0 });
    setElapsed(0);
    const startTime = performance.now();
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((performance.now() - startTime) / 1000));
    }, 1000);
    try {
      const comments = await fetchAllComments(
        videoId,
        apiKey,
        setProgress,
        controller.signal,
      );
      const filename = `comments-${videoId}`;
      if (fmt === "csv") {
        download(toCSV(comments), `${filename}.csv`, "text/csv");
      } else {
        download(toJSON(comments), `${filename}.json`, "application/json");
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        alert((e as Error).message);
      }
    } finally {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      abortRef.current = null;
      setExporting(false);
    }
  };

  const cancel = () => {
    abortRef.current?.abort();
  };

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs text-muted-foreground">{t("exportDescription")}</p>
      {exporting ? (
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2 items-center">
            <span className="text-xs flex-1">
              {t("exporting")} {progress.fetched.toLocaleString()}
              {progress.total > 0 && ` / ${progress.total.toLocaleString()}`}
              {progress.total > 0 &&
                ` (${Math.min(Math.round((progress.fetched / progress.total) * 100), 100)}%)`}
              {" "}- {elapsed}s
            </span>
            <Button size="sm" variant="destructive" onClick={cancel}>
              {t("cancel")}
            </Button>
          </div>
          <Progress
            value={
              progress.total > 0
                ? Math.min(
                    (progress.fetched / progress.total) * 100,
                    100,
                  )
                : 0
            }
            className="h-1.5"
          />
        </div>
      ) : (
        <div className="flex">
          <Button
            size="sm"
            className="rounded-r-none flex-1"
            onClick={() => exportAs(format)}
          >
            {t("export")} {format.toUpperCase()}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="rounded-l-none border-l px-2">
                ▾
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFormat("json")}>
                JSON {format === "json" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFormat("csv")}>
                CSV {format === "csv" && "✓"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
