import { transformRuntime } from "@/lib/functions";
import { getEpisodeDetails, getMediaDetails } from "@/utils/tmdb";
import Link from "next/link";
import React from "react";

interface MediaCardProps {
  media_type: string;
  media_id: number;
  season_number?: number;
  episode_number?: number;
}

const MediaCard: React.FC<MediaCardProps> = async ({
  media_type,
  media_id,
  season_number,
  episode_number,
}) => {
  let media: any;
  media = await getMediaDetails(media_type, media_id);
  if (!media) {
    return <p>loading...</p>;
  }
  return (
    <div className="flex w-full flex-row gap-4 border-2 border-transparent transition ease-in-out hover:z-20 hover:scale-110 hover:border-foreground hover:drop-shadow-xl lg:rounded-[16px]">
      <Link
        className="relative"
        href={
          media_type === "movie"
            ? `/protected/watch/${media_type}/${media_id}`
            : `/protected/watch/${media_type}/${media_id}/1/1`
        }
      >
        <img
          src={
            media.images &&
            media.images.backdrops &&
            media.images.backdrops.length > 0
              ? `https://image.tmdb.org/t/p/w780${media.images.backdrops[0].file_path}`
              : season_number && episode_number
                ? `https://image.tmdb.org/t/p/w780${media.still_path}`
                : `https://image.tmdb.org/t/p/w780${media.backdrop_path}`
          }
          alt=""
          loading="lazy"
          className="aspect-[16/9] bg-foreground/10 lg:rounded-[16px]"
        />
      </Link>
    </div>
  );
};

export default MediaCard;
