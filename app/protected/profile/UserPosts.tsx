"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import HomePostCardNew from "@/components/post/HomePostCardNew";
import Loader from "@/components/Loader";
import { getUserPosts } from "@/utils/supabase/queries";

interface UserPostsProps {
  userId: string;
  currentUserId: string;
  initialPage?: number; // Optional prop for the initial page
  pageSize?: number; // Optional prop for the number of posts per page
  onPostsLoaded?: (posts: any[]) => void; // Callback when posts are loaded
}

const UserPosts: React.FC<UserPostsProps> = ({
  userId,
  currentUserId,
  initialPage = 0, // Default to page 0
  pageSize = 10, // Default to 10 posts per page
  onPostsLoaded,
}) => {
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(false);
  const [hasMorePosts, setHasMorePosts] = useState<boolean>(true);
  const [postPage, setPostPage] = useState<number>(initialPage);
  const { ref: refPosts, inView: inViewPosts } = useInView();

  useEffect(() => {
    const loadMorePosts = async () => {
      if (inViewPosts && hasMorePosts && !loadingPosts) {
        setLoadingPosts(true);
        try {
          const res = await getUserPosts(userId, currentUserId, postPage);
          if (res.length === 0) {
            setHasMorePosts(false);
          } else {
            setUserPosts((prevData) => [...prevData, ...res]);
            setPostPage((prevPage) => prevPage + 1);
            if (onPostsLoaded) {
              onPostsLoaded(res);
            }
          }
        } catch (error) {
          console.error("Error fetching posts:", error);
        } finally {
          setLoadingPosts(false);
        }
      }
    };

    loadMorePosts();
  }, [
    inViewPosts,
    hasMorePosts,
    loadingPosts,
    userId,
    currentUserId,
    postPage,
    pageSize,
    onPostsLoaded,
  ]);

  return (
    <div
      className="grid w-full gap-4 p-4 lg:p-0"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
    >
      {userPosts.map((post) => (
        <div key={post.id} className="w-full">
          <HomePostCardNew post={post} />
        </div>
      ))}
      {loadingPosts && <Loader />}
      {!loadingPosts && hasMorePosts && (
        <div ref={refPosts} className="h-[100px] w-[100px]"></div>
      )}
      {!hasMorePosts && (
        <div className="flex w-full flex-col items-center justify-center gap-4 rounded-[8px] bg-foreground/10 p-4">
          <img
            src="/assets/images/logo_new_black.svg"
            alt="No more posts"
            className="invert-on-dark h-8 w-8 opacity-50"
          />
          <p className="text-foreground/50">No more posts</p>
        </div>
      )}
    </div>
  );
};

export default UserPosts;
