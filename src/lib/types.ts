import { InferSelectModel } from "drizzle-orm";
import { postTable, userTable } from "./database/schema";

export type User = InferSelectModel<typeof userTable>;
export type Post = InferSelectModel<typeof postTable>;

export type singlePost = {
  postId?: number;
  userId?: string;
  username: string;
  content: string;
  createdAt: Date;
};

export interface PostsPage {
  posts: singlePost[];
  nextCursor: number | null;
}
