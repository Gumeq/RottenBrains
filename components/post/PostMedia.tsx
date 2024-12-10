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
      <Link
        href={`/protected/media/${media_type}/${media_id}`}
        className="w-full"
      >
        {imageUrl ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${imageUrl}`}
            alt={media_type}
            loading="lazy"
            className="aspect-[16/9] w-full overflow-hidden bg-foreground/10"
          />
        ) : (
          <div className="flex aspect-[16/9] flex-col items-center justify-center gap-2 bg-foreground/10">
            <img
              src="/assets/images/logo_new_black.svg"
              alt=""
              className="invert-on-dark h-10 w-10 opacity-50"
            />
            <p className="text-sm text-foreground/50">No image available</p>
          </div>
        )}
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
