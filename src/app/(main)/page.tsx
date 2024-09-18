import PostEditor from "@/components/posts/editor/PostEditor";
import Post from "@/components/posts/Post";
import ForYouFeed from "./ForYouFeed";

export default function Home() {
  return (
    <div className="w-full space-y-5 lg:w-[60%]">
      <PostEditor />
      <ForYouFeed />
    </div>
  );
}
