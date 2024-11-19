import React from "react";
import Link from "next/link";
import UserReviewText from "./UserReviewText";

interface Media {
  id: number;
  title?: string;
  name?: string;
}

interface Creator {
  username: string;
}

interface Post {
  review_user: string;
}

interface PostContentProps {
  media: Media | null;
  media_type: string;
  media_id: number;
  post: Post;
  creator: Creator;
}

const PostContent = ({
  media,
  media_type,
  media_id,
  post,
  creator,
}: PostContentProps) => {
  return (
    <div className="flex flex-col px-2 lg:px-4">
      <div className="flex flex-col gap-2 py-4">
        <div className="flex w-full flex-row gap-2">
          <img
            src={`/assets/icons/${media_type}-outline.svg`}
            alt=""
            className="invert-on-dark"
          />
          <Link
            href={`/protected/media/${media_type}/${media_id}`}
            className="line-clamp-1 font-bold"
          >
            {media && (media.title || media.name)}
          </Link>
        </div>
        <UserReviewText
          post_review={post.review_user || "No review"}
          creator_name={creator?.username || "No user"}
        />
      </div>
    </div>
  );
};

export default PostContent;
