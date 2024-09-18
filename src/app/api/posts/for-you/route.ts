import { validateRequest } from "@/auth";
import { db } from "@/lib/database";
import { postTable, userTable } from "@/lib/database/schema";
import { PostsPage } from "@/lib/types";
import { asc, desc, eq, gt, lt } from "drizzle-orm";
import { NextRequest } from "next/server";

// Cursor - The post id that comes after the last post
// With every request we will need to send the cursor to the backend to let the backend know which page we need

export async function GET(req: NextRequest) {
  try {
    const cursorParam = req.nextUrl.searchParams.get("cursor");

    const cursor = cursorParam ? parseInt(cursorParam, 10) : undefined;

    const pageSize = 10;

    const { user } = await validateRequest();

    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    // Inner Join - Returns records that have matching values in both tables
    // PostTable with UserTable join with userid

    const posts = await db
      .select({
        postId: postTable.id,
        username: userTable.username,
        createdAt: postTable.createdAt,
        content: postTable.content,
      })
      .from(postTable)
      .orderBy(desc(postTable.id))
      .innerJoin(userTable, eq(postTable.userId, userTable.id))
      .where(cursor ? lt(postTable.id, cursor + 1) : undefined)
      .limit(pageSize + 1); // Fetch one extra post to determine if there's a next page

    const nextCursor = posts.length > pageSize ? posts[pageSize].postId : null;

    const data: PostsPage = {
      posts: posts.slice(0, pageSize),
      nextCursor: nextCursor,
    };

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 3000); // 3000 milliseconds = 3 seconds (artificial delay)
    });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
