"use client";

import ScrollButtons from "@/components/explore/ScrollButtons";
import Loader from "@/components/Loader";
import HomePostCard from "@/components/post/HomePostCard";
import HomePostCardNew from "@/components/post/HomePostCardNew";
import { useUser } from "@/context/UserContext";
import { IPost } from "@/types";
import {
  getUserLikedPosts,
  getUserPosts,
  getUserSavedPosts,
} from "@/utils/supabase/queries";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const Tabs: React.FC<any> = () => {
  const [activeTab, setActiveTab] = useState("posts");

  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(false);
  const [hasMorePosts, setHasMorePosts] = useState<boolean>(true);
  const [postPage, setPostPage] = useState<number>(0); // Use state for likePage
  const { ref: refPosts, inView: inViewPosts } = useInView();

  const [userLikes, setUserLikes] = useState<any[]>([]);
  const [likesPage, setLikesPage] = useState<number>(0); // Use state for likePage
  const [hasMoreLikes, setHasMoreLikes] = useState<boolean>(true);
  const [loadingLikes, setLoadingLikes] = useState<boolean>(false);
  const { ref: refLikes, inView: inViewLikes } = useInView();

  const [userSaves, setUserSaves] = useState<any[]>([]);
  const [savesPage, setSavesPage] = useState<number>(0); // Use state for likePage
  const [hasMoreSaves, setHasMoreSaves] = useState<boolean>(true);
  const [loadingSaves, setLoadingSaves] = useState<boolean>(false);
  const { ref: refSaves, inView: inViewSaves } = useInView();

  const { user } = useUser();

  useEffect(() => {
    const loadMore = async () => {
      if (inViewPosts && hasMorePosts && !loadingPosts && user) {
        setLoadingPosts(true);
        try {
          const res = await getUserPosts(
            user.id.toString(),
            user.id.toString(),
            postPage,
          );
          if (res.length === 0) {
            setHasMorePosts(false); // No more posts to load
          } else {
            setUserPosts((prevData) => [...prevData, ...res]);
            setPostPage((prevPage) => prevPage + 1); // Increment page state
          }
        } catch (error) {
          console.error("Error fetching posts:", error);
        } finally {
          setLoadingPosts(false);
        }
      }
    };

    loadMore();
  }, [inViewPosts, hasMorePosts, loadingPosts, user, postPage]); // Include likePage in dependency array

  useEffect(() => {
    const loadMore = async () => {
      if (inViewLikes && hasMoreLikes && !loadingLikes && user) {
        setLoadingLikes(true);
        try {
          const res = await getUserLikedPosts(
            user.id.toString(),
            user.id.toString(),
            likesPage,
          );
          if (res.length === 0) {
            setHasMoreLikes(false); // No more posts to load
          } else {
            setUserLikes((prevData) => [...prevData, ...res]);
            setLikesPage((prevPage) => prevPage + 1); // Increment page state
          }
        } catch (error) {
          console.error("Error fetching posts:", error);
        } finally {
          setLoadingLikes(false);
        }
      }
    };
    loadMore();
  }, [inViewLikes, hasMoreLikes, loadingLikes, user, likesPage]);

  useEffect(() => {
    const loadMore = async () => {
      if (inViewSaves && hasMoreSaves && !loadingSaves && user) {
        setLoadingSaves(true);
        try {
          const res = await getUserSavedPosts(
            user.id.toString(),
            user.id.toString(),
            savesPage,
          );
          if (res.length === 0) {
            setHasMoreSaves(false); // No more posts to load
          } else {
            setUserSaves((prevData) => [...prevData, ...res]);
            setSavesPage((prevPage) => prevPage + 1); // Increment page state
          }
        } catch (error) {
          console.error("Error fetching posts:", error);
        } finally {
          setLoadingSaves(false);
        }
      }
    };
    loadMore();
  }, [inViewSaves, hasMoreSaves, loadingSaves, user, savesPage]);

  const renderContent = (tab: string) => {
    switch (tab) {
      case "posts":
        return (
          <>
            <div
              className="grid w-full gap-4"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
              }}
            >
              {userPosts.length > 0 && (
                <>
                  {userPosts.map((post: any) => (
                    <div key={post.id}>
                      <HomePostCardNew post={post} />
                    </div>
                  ))}
                </>
              )}
              <div>
                {loadingPosts && <Loader></Loader>}
                {!loadingPosts && hasMorePosts && (
                  <div ref={refPosts} className="h-[100px] w-[100px]"></div>
                )}
                {!hasMorePosts && <div>No more posts to load.</div>}
                <div className="h-[100px] w-[100px]"></div>
              </div>
            </div>
          </>
        );
      case "likes":
        return (
          <>
            <div
              className="hidden-scrollbar flex flex-row gap-4 overflow-x-auto"
              id={"user_likes"}
            >
              {userLikes.length > 0 && (
                <>
                  {userLikes.map((post: any) => (
                    <div key={post.id}>
                      <HomePostCardNew post={post} />
                    </div>
                  ))}
                </>
              )}
              <div>
                {loadingLikes && <Loader></Loader>}
                {!loadingLikes && hasMoreLikes && (
                  <div ref={refLikes} className="h-[100px] w-[100px]"></div>
                )}
                {!hasMoreLikes && <div>No more posts to load.</div>}
                <div className="h-[100px] w-[100px]"></div>
              </div>
            </div>
          </>
        );
      case "saves":
        return (
          <>
            <div
              className="hidden-scrollbar flex flex-row gap-4 overflow-x-auto"
              id={"user_saves"}
            >
              {userSaves.length > 0 && (
                <>
                  {userSaves.map((post: any) => (
                    <div key={post.id}>
                      <HomePostCardNew post={post} />
                    </div>
                  ))}
                </>
              )}
              <div>
                {loadingSaves && <Loader></Loader>}
                {!loadingSaves && hasMoreSaves && (
                  <div ref={refSaves} className="h-[100px] w-[100px]"></div>
                )}
                {!hasMoreSaves && <div>No more posts to load.</div>}
                <div className="h-[100px] w-[100px]"></div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      {/* <div className="flex justify-around border-b">
        <button
          className={`w-full px-4 py-2 ${
            activeTab === "posts" ? "border-b-2 border-accent" : ""
          }`}
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </button>
        <button
          className={`w-full px-4 py-2 ${
            activeTab === "likes" ? "border-b-2 border-accent" : ""
          }`}
          onClick={() => setActiveTab("likes")}
        >
          Likes
        </button>
        <button
          className={`w-full px-4 py-2 ${
            activeTab === "saves" ? "border-b-2 border-accent" : ""
          }`}
          onClick={() => setActiveTab("saves")}
        >
          Saves
        </button>
      </div> */}
      <div className="mb-4 flex flex-row items-center justify-between px-2 lg:p-0">
        <div className="flex flex-row items-center gap-2">
          <img
            src="/assets/icons/review-outline.svg"
            alt=""
            width={24}
            height={24}
            className="invert-on-dark"
          />
          <h2 className="text-xl font-bold">New posts</h2>
        </div>
        <ScrollButtons containerId="user_posts"></ScrollButtons>
      </div>
      <div className="mt-4 w-full">{renderContent("posts")}</div>
    </div>
  );
};

export default Tabs;
