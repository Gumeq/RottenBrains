import { formatDate, transformRuntime } from "@/lib/functions";
import { getWatchTime } from "@/utils/supabase/queries";
import { getEpisodeDetails, getMediaDetails } from "@/utils/tmdb";
import Link from "next/link";
import React from "react";
import MoreOptions from "./MoreOptions";

interface MediaCardProps {
  media_type: string;
  media_id: number;
  season_number?: number;
  episode_number?: number;
  quality?: string;
  user_id: string;
}

const HomeMediaCard: React.FC<MediaCardProps> = async ({
  media_type,
  media_id,
  season_number,
  episode_number,
  quality,
  user_id,
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

  const watchTime = await getWatchTime(
    user_id,
    media_type,
    media_id,
    season_number,
    episode_number,
  );

  let genreIds = [];
  if (media?.genres && Array.isArray(media.genres)) {
    genreIds = media.genres.map((genre: any) => genre.id);
  }

  const imageUrl =
    media?.images?.backdrops?.[0]?.file_path ||
    (season_number && episode_number ? media.still_path : media.backdrop_path);

  return (
    <div className="mb-4 flex w-full flex-col lg:mb-0 lg:w-full lg:min-w-[350px] lg:max-w-[450px]">
      <Link
        className="relative overflow-hidden lg:rounded-[8px]"
        href={
          media_type === "movie"
            ? `/protected/watch/${media_type}/${media_id}`
            : season_number && episode_number
              ? `/protected/watch/${media_type}/${media_id}/${season_number}/${episode_number}`
              : `/protected/watch/${media_type}/${media_id}/1/1`
        }
      >
        <div className="absolute bottom-0 right-0 m-2 flex flex-row-reverse gap-2">
          {media.runtime && (
            <div className="rounded-[4px] bg-black/60 px-2 py-1 text-xs text-white">
              {transformRuntime(media.runtime)}
            </div>
          )}
          <div className="rounded-[4px] bg-black/60 px-2 py-1 text-xs text-white">
            {media.vote_average.toFixed(1)} / 10
          </div>
          {quality && (
            <div className="rounded-[4px] bg-black/60 px-2 py-1 text-xs text-white">
              {quality}
            </div>
          )}
        </div>

        {/* Display the progress bar only if percentage_watched is valid */}
        {watchTime && (
          <div
            className="absolute bottom-0 left-0 h-1 bg-accent"
            style={{
              width: `${watchTime || 0}%`,
            }}
          ></div>
        )}
        {imageUrl ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${imageUrl}`}
            alt={media.title || media.name}
            loading="lazy"
            className="aspect-[16/9] w-full bg-foreground/10 lg:rounded-[8px]"
          />
        ) : (
          <div className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 bg-foreground/10 lg:rounded-[8px]">
            <img
              src="/assets/images/logo_new_black.svg"
              alt=""
              className="invert-on-dark h-10 w-10 opacity-50"
            />
            <p className="text-sm text-foreground/50">No image available</p>
          </div>
        )}
      </Link>
      <div className="flex flex-col px-4 lg:p-0">
        <div className="mt-2 flex flex-row justify-between">
          <h2 className="flex flex-row gap-1 text-lg font-medium">
            {media.title || media.name}
            {media_type === "tv" && episode_number && (
              <p>
                | S{season_number}E{episode_number}
              </p>
            )}
          </h2>
          <MoreOptions
            user_id={user_id}
            media_type={media_type}
            media_id={media_id}
            genre_ids={genreIds}
          ></MoreOptions>
        </div>
        {/* <p className="line-clamp-2 text-sm text-foreground/50">
          {media.overview}
        </p> */}
        <p className="text-sm text-foreground/50">
          {formatDate(
            media.release_date || media.air_date || media.first_air_date,
          )}
        </p>
      </div>
    </div>
  );
};

export default HomeMediaCard;
