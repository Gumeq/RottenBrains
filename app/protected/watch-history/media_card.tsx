import { getEpisodeDetails, getMediaDetails } from "@/utils/tmdb";
import Link from "next/link";
import React from "react";

interface MediaCardProps {
  media_type: string;
  media_id: number;
  season_number?: number;
  episode_number?: number;
}

function transformRuntime(minutes: number): string {
  const hours: number = Math.floor(minutes / 60);
  const remainingMinutes: number = minutes % 60;

  if (hours > 0) {
    return `${hours} h ${remainingMinutes} m`;
  } else {
    if (remainingMinutes > 0) {
      return `${remainingMinutes} m`;
    } else {
      return "N/A";
    }
  }
}

const MediaCard: React.FC<MediaCardProps> = async ({
  media_type,
  media_id,
  season_number,
  episode_number,
}) => {
  let media: any;
  if (media_type === "movie") {
    media = await getMediaDetails(media_type, media_id);
  } else {
    if (season_number && episode_number) {
      media = await getEpisodeDetails(media_id, season_number, episode_number);
    } else {
      media = await getMediaDetails(media_type, media_id);
    }
  }
  if (!media) {
    return <p>loading...</p>;
  }
  return (
    <div className="flex w-full flex-row gap-4">
      <Link
        className="relative min-w-[300px] max-w-[300px]"
        href={
          media_type === "movie"
            ? `/protected/watch/${media_type}/${media_id}`
            : `/protected/watch/${media_type}/${media_id}/${season_number}/${episode_number}`
        }
      >
        <div className="absolute bottom-0 right-0 m-1 rounded-full bg-black/50 px-2 py-0.5 text-sm text-white">
          {transformRuntime(media.runtime || media.episode_run_time[0])}
        </div>
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
      <div className="flex flex-col">
        <h2 className="flex flex-row gap-1 text-lg">
          {media.title || media.name}
          {season_number && episode_number && (
            <p>
              | S{season_number}E{episode_number}
            </p>
          )}
        </h2>
        <p className="line-clamp-2 text-foreground/50">{media.overview}</p>
      </div>
    </div>
  );
};

export default MediaCard;
