import { Button } from "@/components/ui/button";
import { useCommentsStore } from "@/lib/store/comments";
import { CommentItem } from "./CommentItem";

export function CommentList() {
  const { comments, nextPageToken, totalResults, loading, error, loadMore } =
    useCommentsStore();

  return (
    <>
      {error && <p className="text-sm text-destructive">{error}</p>}

      {comments.length > 0 && (
        <div className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0">
          <p className="text-xs text-muted-foreground">
            {comments.length} comments loaded (total: {totalResults})
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
              {loading ? "Loading..." : "Load More"}
            </Button>
          )}
        </div>
      )}
    </>
  );
}
