"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainerProps";
import PostsLoadingSkeleton from "@/components/PostLoadingSkeleton";
import Post from "@/components/posts/Post";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";

// <PostPage, Error> is the return type and error handling

export default function ForYouFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<PostsPage, Error>({
    queryKey: ["post-feed", "for-you"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/posts/for-you",
          pageParam &&
            (typeof pageParam === "string" ||
              typeof pageParam === "number" ||
              typeof pageParam === "boolean")
            ? { searchParams: { cursor: pageParam } }
            : {},
        )
        .json<PostsPage>(),

    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") return <PostsLoadingSkeleton />;

  if (status === "success" && !posts.length && !hasNextPage) {
    return <p className="text-center text-muted-foreground">No Posts</p>;
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occured while loading posts{" "}
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      className="space-y-5"
    >
      {posts.map((post) => (
        <Post
          key={post.postId}
          username={post.username}
          createdAt={post.createdAt}
          content={post.content}
        />
      ))}
      {isFetchingNextPage && <PostsLoadingSkeleton />}
    </InfiniteScrollContainer>
  );
}
