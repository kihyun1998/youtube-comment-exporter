import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
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
} from "@/lib/api/export";

type ExportFormat = "json" | "csv";

export function ExportBar() {
  const [format, setFormat] = useState<ExportFormat>("json");
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const exportAs = async (fmt: ExportFormat) => {
    const { videoId, apiKey } = useSettingsStore.getState();
    if (!videoId || !apiKey) return;

    const controller = new AbortController();
    abortRef.current = controller;
    setExporting(true);
    setProgress(0);
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
      abortRef.current = null;
      setExporting(false);
    }
  };

  const cancel = () => {
    abortRef.current?.abort();
  };

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs text-muted-foreground">
        Export fetches all comments + replies automatically.
      </p>
      {exporting ? (
        <div className="flex gap-2 items-center">
          <span className="text-xs flex-1">Exporting... ({progress})</span>
          <Button size="sm" variant="destructive" onClick={cancel}>
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex">
          <Button
            size="sm"
            className="rounded-r-none flex-1"
            onClick={() => exportAs(format)}
          >
            Export {format.toUpperCase()}
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
