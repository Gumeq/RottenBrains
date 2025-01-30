import React from "react";
import PostHeader from "./PostHeader";
import PostMedia from "./PostMedia";
import PostContent from "./PostContent";
import PostFooter from "./PostFooter";

interface HomePostCardProps {
  post_media_data: any;
  user_id?: string;
}

const HomePostCardUI = ({ post_media_data, user_id }: HomePostCardProps) => {
  const { post_data, media_data } = post_media_data;
  const genreIds = media_data?.genres?.map((genre: any) => genre.id) || [];
  return (
    <div className="relative flex h-min flex-col rounded-[8px] border border-foreground/10 bg-white/10 lg:min-w-[320px] lg:max-w-[400px]">
      <PostHeader
        creator={post_data.creator}
        post={post_data.post}
        user_id={user_id}
      />
      <PostMedia media={media_data} post={post_data.post} />
      <PostContent
        media={media_data}
        post={post_data.post}
        creator={post_data.creator}
      />
      <PostFooter
        post={post_data.post}
        media={media_data}
        current_user={post_data.current_user}
        user_id={user_id}
        genreIds={genreIds}
      />
    </div>
  );
};

export default HomePostCardUI;
