import React from "react";
import PostStats from "./PostStats";
import MoreOptions from "@/app/protected/home/MoreOptions";

interface PostFooterProps {
  post: any;
  media: any;
  current_user: any;
  user_id?: string;
  genreIds: bigint[];
}

const PostFooter = ({
  post,
  media,
  current_user,
  user_id,
  genreIds,
}: PostFooterProps) => {
  return (
    <div className="flex w-full flex-col justify-between py-2">
      <div className="flex w-full items-center">
        <div className="align-center flex h-full w-full flex-row items-center justify-between">
          <div className="flex flex-row items-center">
            <PostStats
              post={post}
              user_id={user_id}
              current_user={current_user}
            />
          </div>
          {user_id ? (
            <>
              <div className="flex flex-row items-center gap-2">
                <MoreOptions
                  user_id={user_id}
                  media_type={media.media_type}
                  media_id={media.media_id}
                  genre_ids={genreIds}
                />
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostFooter;
