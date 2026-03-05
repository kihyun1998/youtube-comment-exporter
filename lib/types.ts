export interface CommentThread {
  id: string;
  authorName: string;
  authorProfileImage: string;
  text: string;
  likeCount: number;
  publishedAt: string;
  replyCount: number;
}

export interface FetchCommentsResult {
  comments: CommentThread[];
  nextPageToken?: string;
  totalResults: number;
}
