import { validateRequest } from "@/auth";
import UserAvatar from "@/components/UserAvatar";
import React from "react";

export default async function Page() {
  const { user } = await validateRequest();

  return (
    <div className="relative flex flex-grow rounded-sm bg-secondary">
      <UserAvatar avatarUrl={null} className="absolute left-5 top-20 w-1/5" />
      <div className="absolute left-44 top-40 font-bold">{user?.username}</div>
    </div>
  );
}
