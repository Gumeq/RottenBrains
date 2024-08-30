"use client";
import { getCommentReplies, getUserFromDB } from "@/utils/supabase/queries";
import React, { useEffect, useState } from "react";
import { timeAgo } from "./TimeAgo";
import AddComment from "./AddComment";

const CommentCard = ({ comment, post, user, fetchComments }: any) => {
  const [reply, setReply] = useState(false);
  const [replies, setReplies] = useState<any[]>([]);
  const creator = comment.users;

  if (!creator) {
    return <p>loading...</p>;
  }

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const fetchedReplies = await getCommentReplies(comment.id);
        setReplies(fetchedReplies);
      } catch (error) {
        console.error("Error fetching replies:", error);
      }
    };

    fetchReplies();
  }, [replies]);

  const handleReplyButton = async () => {
    console.log("Reply to : " + comment.id);
    setReply(!reply);

    if (!reply) {
      // Only fetch replies if the reply section is being opened
      try {
        const fetchedReplies = await getCommentReplies(comment.id);
        setReplies(fetchedReplies);
      } catch (error) {
        console.error("Error fetching replies:", error);
      }
    }
  };

  return (
    <div className="flex w-full flex-col gap-1 rounded-[8px] bg-foreground/5 p-2">
      <div className="flex w-full flex-row gap-4">
        <div>
          <img
            src={creator.image_url}
            alt="User avatar"
            width={40}
            height={40}
            className="min-h-[40px] min-w-[40px] rounded-full"
          />
        </div>
        <div className="flex w-full flex-col gap-1">
          <div className="flex flex-row items-center gap-2">
            <p className="text-sm font-bold">{creator.username}</p>
          </div>
          <div className="break-words">
            <p className="whitespace-pre-wrap text-sm">{comment.content}</p>
          </div>
          <div className="flex flex-row gap-2 text-xs text-foreground/50">
            <p>{timeAgo(comment.created_at)}</p>
            <p className="">{comment.total_likes} likes</p>
            <button onClick={handleReplyButton}>Reply</button>
          </div>
          <div>
            {reply && (
              <AddComment
                post={post}
                user={user}
                fetchComments={fetchComments}
                parent_id={comment.id}
              />
            )}
          </div>
          <div className="flex w-full">
            {replies && replies.length > 0 && (
              <div className="flex w-full flex-col gap-2">
                {replies.map((reply: any) => {
                  return (
                    <CommentCard
                      comment={reply}
                      post={post}
                      user={user}
                      fetchComments={fetchComments}
                    ></CommentCard>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
