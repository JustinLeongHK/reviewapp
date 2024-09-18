import { validateRequest } from "@/auth";
import { db } from "@/lib/database";
import { userTable } from "@/lib/database/schema";
import { eq, ne } from "drizzle-orm";
import React from "react";
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/button";
import Link from "next/link";

export default function TrendsSideBar() {
  return (
    <div className="ms-auto hidden h-max w-[300px] rounded-md bg-secondary p-5 lg:block">
      <div className="">
        <div className="text-xl font-bold">Who to follow</div>
        <WhoToFollow />
      </div>
      <div className="text-xl font-bold">Trending Topics</div>
    </div>
  );
}

async function WhoToFollow() {
  const { user } = await validateRequest();
  if (!user) return null;

  const usersToFollow = await db
    .select()
    .from(userTable)
    .where(ne(userTable.id, user.id))
    .limit(3);

  return (
    <div>
      {usersToFollow.map((userToFollow) => (
        <div
          title={userToFollow.username}
          key={userToFollow.id}
          className="border-1 my-2 mb-5 flex cursor-pointer items-center gap-1 rounded-md bg-popover p-2 hover:shadow-md"
        >
          <UserAvatar avatarUrl={null} className="flex-none" />
          <Link href={`/users/${userToFollow.username}`}>
            <div className="line-clamp-1 break-all text-sm font-semibold">
              {userToFollow.username}
            </div>
          </Link>

          <Button size="sm">Follow</Button>
        </div>
      ))}
    </div>
  );
}
