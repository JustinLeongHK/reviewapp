import { formatRelativeDate } from "@/lib/utils";
import UserAvatar from "../UserAvatar";
import DOMPurify from "dompurify";

interface Postprops {
  username: string;
  content: string;
  createdAt: Date;
}

export default function Post({ username, content, createdAt }: Postprops) {
  const sanitizedContent = DOMPurify.sanitize(content);
  return (
    <div className="w-full rounded-md bg-secondary p-5">
      <div className="flex gap-5">
        <UserAvatar avatarUrl={null} className="" />
        <div className="text-sm">
          {" "}
          <div>{username}</div>
          <div>{formatRelativeDate(createdAt)}</div>
        </div>
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        className="mt-3 rounded-sm bg-card p-5"
      />
    </div>
  );
}
