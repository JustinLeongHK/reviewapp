"use server";

import { validateRequest } from "@/auth";
import { db } from "@/lib/database";
import { postTable, userTable } from "@/lib/database/schema";
import { CreatePostSchema } from "@/lib/validation";
import { desc, eq } from "drizzle-orm";

export async function submitPost(input: string) {
  const { user } = await validateRequest();

  if (!user) throw Error("Unauthorized");

  const { content } = CreatePostSchema.parse({ content: input });

  // insert data into post table
  await db.insert(postTable).values({ userId: user.id, content });
  // InnerJoin PostTable & UserTable
  const [newPost] = await db
    .select({
      userId: userTable.id,
      username: userTable.username,
      content: postTable.content,
      createdAt: postTable.createdAt,
    })
    .from(postTable)
    .innerJoin(userTable, eq(postTable.userId, userTable.id))
    .orderBy(desc(postTable.createdAt))
    .limit(1);

  return newPost;
}
