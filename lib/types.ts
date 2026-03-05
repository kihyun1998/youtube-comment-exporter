export interface Comment {
  id: string;
  parentId: string;
  authorName: string;
  authorProfileImage: string;
  text: string;
  likeCount: number;
  publishedAt: string;
}

export interface CommentThread extends Comment {
  replyCount: number;
}

export interface FetchCommentsResult {
  comments: CommentThread[];
  nextPageToken?: string;
  totalResults: number;
}

export interface FetchRepliesResult {
  replies: Comment[];
  nextPageToken?: string;
}
