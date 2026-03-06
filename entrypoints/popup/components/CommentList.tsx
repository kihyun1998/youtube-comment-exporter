import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useCommentsStore } from "@/lib/store/comments";
import { CommentItem } from "./CommentItem";

export function CommentList() {
  const { t } = useTranslation();
  const { comments, nextPageToken, totalResults, loading, error, loadMore } =
    useCommentsStore();

  return (
    <>
      {error && <p className="text-sm text-destructive">{error}</p>}

      {comments.length > 0 && (
        <div className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0">
          <p className="text-xs text-muted-foreground">
            {t("commentsLoaded", {
              count: comments.length,
              total: totalResults,
            })}
          </p>

          <div className="flex flex-col gap-2">
            {comments.map((c) => (
              <CommentItem key={c.id} comment={c} />
            ))}
          </div>

          {nextPageToken && (
            <Button
              size="sm"
              variant="outline"
              disabled={loading}
              onClick={loadMore}
              className="self-center"
            >
              {loading ? t("loading") : t("loadMore")}
            </Button>
          )}
        </div>
      )}
    </>
  );
}
