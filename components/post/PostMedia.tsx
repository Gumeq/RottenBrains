import React from "react";
import Link from "next/link";

interface Media {
  id: number;
  title?: string;
  name?: string;
  backdrop_path?: string;
}

interface Post {
  vote_user: number;
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
      <Link href={`/protected/media/${media_type}/${media_id}`}>
        <img
          src={`https://image.tmdb.org/t/p/w500${imageUrl}`}
          alt=""
          className="aspect-[16/9] w-full"
        />
      </Link>
      <div className="absolute bottom-2 right-2">
        <p className="rounded-[4px] bg-secondary px-2 py-1 text-xs text-white">
          {post.vote_user}/10
        </p>
      </div>
    </div>
  );
};

export default PostMedia;
