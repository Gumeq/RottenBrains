"use client";

import { likePost, removeLike } from "@/utils/clientFunctions/updatePostData";
import { createClient } from "@/utils/supabase/client";
import { getPostComments } from "@/utils/supabase/queries";
import { useCallback, useEffect, useState } from "react";
import AddComment from "./AddComment";
import CommentCard from "./CommentCard";

const PostStats = ({ post, user }: any) => {
  const postId = post.post_id;
  const [state, setState] = useState({
    liked: post.has_liked,
    likes: post.total_likes,
    animate: false,
    isOpen: false,
    comments: [],
    commentCount: post.total_comments || 0,
    loading: true,
  });
  const userId = user?.id.toString();

  const handleLike = useCallback(async () => {
    if (userId && user) {
      // Optimistically update the state
      const newLikedState = !state.liked;
      const newLikesCount = newLikedState ? state.likes + 1 : state.likes - 1;

      setState((prevState) => ({
        ...prevState,
        liked: newLikedState,
        likes: newLikesCount,
        animate: true,
      }));

      try {
        if (newLikedState) {
          await likePost(userId, postId);
        } else {
          await removeLike(userId, postId);
        }
      } catch (error) {
        // Revert the state in case of an error
        setState((prevState) => ({
          ...prevState,
          liked: !newLikedState,
          likes: state.likes, // Revert to the previous like count
          animate: false,
        }));
        console.error("Error toggling like:", error);
      }
    }
  }, [userId, postId, state.liked, state.likes]);

  useEffect(() => {
    if (state.animate) {
      const timer = setTimeout(() => {
        setState((prevState) => ({ ...prevState, animate: false }));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [state.animate]);

  const fetchComments = async () => {
    try {
      const comments = await getPostComments(postId);
      setState((prevState) => ({
        ...prevState,
        comments,
        loading: false,
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  };

  const togglePopup = async () => {
    setState((prevState) => ({ ...prevState, isOpen: !prevState.isOpen }));

    if (!state.isOpen) {
      setState((prevState) => ({ ...prevState, loading: true }));
      await fetchComments();
    }
  };

  if (!userId) {
    return null;
  }
  return (
    <div className="flex flex-row items-center gap-4">
      <div className="flex flex-row items-center gap-2">
        <button onClick={handleLike} className={state.animate ? "pop" : ""}>
          {state.liked ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="30px"
              viewBox="0 -960 960 960"
              width="30px"
              fill="0000000"
              className={`heart-icon ${state.animate ? "pop" : ""} fill-accent`}
            >
              <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z" />
            </svg>
          ) : (
            <img
              src={"/assets/icons/heart-outline.svg"}
              alt="Not Liked"
              width={30}
              height={30}
              className={`heart-icon invert-on-dark ${
                state.animate ? "pop" : ""
              }`}
            />
          )}
        </button>
        <p className="text-xl font-bold">{state.likes}</p>
      </div>
      <div className="flex flex-row items-center gap-2">
        <div>
          <button onClick={togglePopup} className="text-foreground">
            <img
              src="/assets/icons/comment-outline.svg"
              alt="Comment"
              width={30}
              height={30}
              className="invert-on-dark -mb-2 max-h-[30px] min-h-[30px] min-w-[30px] max-w-[30px]"
            />
          </button>
          {state.isOpen && (
            <div className="fixed inset-0 z-50 flex justify-center bg-black bg-opacity-50">
              <div className="relative max-h-[90%] w-screen rounded-lg bg-background p-4 pt-16 shadow-lg md:h-auto md:max-h-[80%] md:max-w-4xl">
                <button
                  onClick={togglePopup}
                  className="absolute right-2 top-2 rounded-md bg-accent px-4 py-2 text-white"
                >
                  Close
                </button>
                <div className="flex h-3/4 flex-col overflow-y-auto">
                  {state.loading ? (
                    <div className="flex h-full items-center justify-center">
                      <span>Loading...</span>
                    </div>
                  ) : state.comments?.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                      <span>No comments yet</span>
                    </div>
                  ) : (
                    <div className="flex w-full flex-col gap-2">
                      {state.comments.map((comment: any) => {
                        if (comment.parent_id === null) {
                          return (
                            <div key={comment.id} className="w-full">
                              <CommentCard
                                comment={comment}
                                post={post}
                                user={user}
                                fetchComments={fetchComments}
                              />
                            </div>
                          );
                        }
                      })}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-6 w-11/12">
                  <AddComment
                    post={post}
                    user={user}
                    fetchComments={fetchComments}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <p className="text-xl font-bold">{state.commentCount}</p>
      </div>
    </div>
  );
};

export default PostStats;
