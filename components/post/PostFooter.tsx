import React from "react";
import PostStats from "./PostStats";
import MoreOptions from "@/app/protected/home/MoreOptions";

interface PostFooterProps {
  post: any;
  userId: string;
  currentUser: any;
  media_type: string;
  media_id: number;
  genreIds: bigint[];
}

const PostFooter = ({
  post,
  userId,
  currentUser,
  media_type,
  media_id,
  genreIds,
}: PostFooterProps) => {
  return (
    <div className="flex w-full flex-col justify-between py-2">
      <div className="flex w-full items-center">
        <div className="align-center flex h-full w-full flex-row items-center justify-between">
          <div className="flex flex-row items-center">
            <PostStats post={post} user={currentUser} />
          </div>
          <div className="flex flex-row items-center gap-2">
            <MoreOptions
              user_id={userId}
              media_type={media_type}
              media_id={media_id}
              genre_ids={genreIds}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostFooter;
