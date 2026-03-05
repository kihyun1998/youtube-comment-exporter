import type { CommentThread } from "@/lib/types";

interface CommentItemProps {
  comment: CommentThread;
}

export function CommentItem({ comment }: CommentItemProps) {
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
          {comment.replyCount > 0 && ` / ${comment.replyCount} replies`}
        </span>
      </div>
      <p className="text-xs whitespace-pre-wrap break-words line-clamp-4">
        {comment.text}
      </p>
    </div>
  );
}
