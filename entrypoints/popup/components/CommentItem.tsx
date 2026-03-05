import { useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchReplies } from "@/lib/api/youtube";
import { useSettingsStore } from "@/lib/store/settings";
import type { Comment, CommentThread } from "@/lib/types";

interface CommentItemProps {
  comment: CommentThread;
}

export function CommentItem({ comment }: CommentItemProps) {
  const [replies, setReplies] = useState<Comment[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string>();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasReplies = comment.replyCount > 0;

  const loadReplies = async (pageToken?: string) => {
    const { apiKey } = useSettingsStore.getState();
    setLoading(true);
    try {
      const result = await fetchReplies(comment.id, apiKey, pageToken);
      setReplies((prev) => (pageToken ? [...prev, ...result.replies] : result.replies));
      setNextPageToken(result.nextPageToken);
    } finally {
      setLoading(false);
    }
  };

  const toggle = async () => {
    if (!open && replies.length === 0) {
      await loadReplies();
    }
    setOpen((v) => !v);
  };

  return (
    <div className="border rounded-md p-2 text-sm flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <img
          src={comment.authorProfileImage}
          alt=""
          className="w-5 h-5 rounded-full"
        />
        <span className="font-medium text-xs truncate">
          {comment.authorName}
        </span>
        <span className="text-xs text-muted-foreground ml-auto whitespace-nowrap">
          {comment.likeCount > 0 && `${comment.likeCount} likes`}
        </span>
      </div>
      <p className="text-xs whitespace-pre-wrap break-words line-clamp-4">
        {comment.text}
      </p>

      {hasReplies && (
        <Button
          size="sm"
          variant="ghost"
          className="self-start h-6 px-2 text-xs text-muted-foreground"
          onClick={toggle}
          disabled={loading}
        >
          {loading
            ? "Loading..."
            : open
              ? `Hide ${comment.replyCount} replies`
              : `${comment.replyCount} replies`}
        </Button>
      )}

      {open && replies.length > 0 && (
        <div className="ml-4 border-l-2 pl-2 flex flex-col gap-1.5 mt-1">
          {replies.map((r) => (
            <div key={r.id} className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <img
                  src={r.authorProfileImage}
                  alt=""
                  className="w-4 h-4 rounded-full"
                />
                <span className="font-medium text-xs truncate">
                  {r.authorName}
                </span>
                <span className="text-xs text-muted-foreground ml-auto whitespace-nowrap">
                  {r.likeCount > 0 && `${r.likeCount} likes`}
                </span>
              </div>
              <p className="text-xs whitespace-pre-wrap break-words line-clamp-3">
                {r.text}
              </p>
            </div>
          ))}

          {nextPageToken && (
            <Button
              size="sm"
              variant="ghost"
              className="self-start h-6 px-2 text-xs text-muted-foreground"
              disabled={loading}
              onClick={() => loadReplies(nextPageToken)}
            >
              {loading ? "Loading..." : "More replies"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
