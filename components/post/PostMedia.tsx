import React from "react";
import Link from "next/link";
import ImageWithFallback from "../ImageWithFallback";

interface Media {
  id: number;
  title?: string;
  name?: string;
  backdrop_path?: string;
}

interface Post {
  vote_user: number;
  post_id: string;
}

interface PostMediaProps {
  media: Media | null;
  media_type: string;
  media_id: number;
  imageUrl: string;
  post: Post;
}

const PostMedia = ({
  media,
  media_type,
  media_id,
  imageUrl,
  post,
}: PostMediaProps) => {
  return (
    <div className="relative w-full">
      <Link
        href={`/protected/media/${media_type}/${media_id}`}
        className="w-full"
      >
        <ImageWithFallback imageUrl={imageUrl} altText={post.post_id} />
      </Link>
      <div className="absolute bottom-2 right-2">
        <p className="rounded-[4px] bg-secondary px-2 py-1 text-xs text-white">
          {post.vote_user}
        </p>
      </div>
    </div>
  );
};

export default PostMedia;
