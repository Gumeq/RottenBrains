// HomeMediaCard.tsx

import React from "react";
import {
  formatDate,
  formatEpisodeCode,
  transformRuntime,
} from "@/lib/functions";
import { getWatchTime } from "@/utils/supabase/queries";
import { getEpisodeDetails, getMediaDetails } from "@/utils/tmdb";
import Link from "next/link";
import MoreOptions from "./MoreOptions";
import HoverImage from "./HoverImage";

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
  // Fetch media details based on type
  let media: any;

  if (media_type === "movie") {
    media = await getMediaDetails(media_type, media_id);
  } else if (season_number && episode_number) {
    media = await getEpisodeDetails(media_id, season_number, episode_number);
  } else {
    media = await getMediaDetails(media_type, media_id);
  }

  // Fetch watch time
  const watchTime = await getWatchTime(
    user_id,
    media_type,
    media_id,
    season_number,
    episode_number,
  );

  // Extract genre IDs
  const genreIds: bigint[] = media?.genres?.map((genre: any) => genre.id) || [];

  // Determine image URL
  const imageUrl =
    media?.images?.backdrops?.[0]?.file_path ||
    (season_number && episode_number ? media.still_path : media.backdrop_path);

  // Calculate day differences
  const releaseDate =
    media.release_date || media.air_date || media.first_air_date;

  const dayDifference = releaseDate
    ? (new Date().getTime() - new Date(releaseDate).getTime()) /
      (1000 * 3600 * 24)
    : undefined;

  const dayDifferenceTv =
    media_type === "tv" && media.last_air_date
      ? (new Date().getTime() - new Date(media.last_air_date).getTime()) /
        (1000 * 3600 * 24)
      : undefined;

  const isNew =
    dayDifference !== undefined && dayDifference > 0 && dayDifference <= 30;
  const isSoon = dayDifference !== undefined && dayDifference < 0;
  const isNewEpisodes =
    media_type === "tv" &&
    dayDifference !== undefined &&
    dayDifference >= 30 &&
    dayDifferenceTv !== undefined &&
    dayDifferenceTv < 30;

  // Prepare display variables
  const mediaTitle = media.title || media.name;
  const formattedEpisodeCode =
    media_type === "tv" && season_number && episode_number
      ? ` | ${formatEpisodeCode(season_number, episode_number)}`
      : "";

  const href =
    media_type === "movie"
      ? `/protected/watch/${media_type}/${media_id}`
      : season_number && episode_number
        ? `/protected/watch/${media_type}/${media_id}/${season_number}/${episode_number}`
        : `/protected/watch/${media_type}/${media_id}/1/1`;

  return (
    <div className="mb-2 flex w-full min-w-[75vw] max-w-[95vw] flex-col lg:w-full lg:min-w-[350px] lg:max-w-[450px]">
      <Link className="relative w-full overflow-hidden" href={href}>
        <HoverImage
          imageUrl={imageUrl}
          altText={mediaTitle}
          media_type={media_type}
          media_id={media_id}
        >
          {/* Overlay elements */}
          <div className="absolute bottom-0 right-0 m-2 flex flex-row-reverse gap-2">
            {media.runtime && (
              <div className="rounded-[4px] bg-black/60 px-2 py-1 text-xs text-white">
                {transformRuntime(media.runtime)}
              </div>
            )}
            {typeof media.vote_average === "number" && (
              <div className="rounded-[4px] bg-black/60 px-2 py-1 text-xs text-white">
                {media.vote_average.toFixed(1)}
              </div>
            )}
            {quality && (
              <div className="rounded-[4px] bg-black/60 px-2 py-1 text-xs text-white">
                {quality}
              </div>
            )}
          </div>
          <div className="absolute left-0 top-0 m-2">
            {isNew && (
              <div className="rounded-[4px] bg-secondary px-2 py-1 text-xs text-white">
                NEW
              </div>
            )}
            {isSoon && (
              <div className="rounded-[4px] bg-secondary px-2 py-1 text-xs text-white">
                SOON
              </div>
            )}
            {isNewEpisodes && (
              <div className="rounded-[4px] bg-secondary px-2 py-1 text-xs text-white">
                NEW EPISODES
              </div>
            )}
          </div>
          {/* Progress bar */}
          {typeof watchTime === "number" && (
            <div className="absolute bottom-0 left-0 h-1 w-full bg-white/20">
              <div
                className="h-full bg-accent"
                style={{ width: `${watchTime}%` }}
              ></div>
            </div>
          )}
        </HoverImage>
      </Link>
      <div className="flex flex-col gap-2 px-2 lg:p-0">
        <div className="mt-2 flex flex-row justify-between">
          <h2 className="font-medium">
            {mediaTitle}
            {formattedEpisodeCode}
          </h2>
          <MoreOptions
            user_id={user_id}
            media_type={media_type}
            media_id={media_id}
            genre_ids={genreIds}
          />
        </div>
        {media.genres && (
          <div className="flex flex-row items-center gap-2 text-xs text-foreground/70">
            {media.genres.slice(0, 3).map((genre: any) => (
              <p
                key={genre.id}
                className="rounded-[4px] bg-foreground/5 px-3 py-1"
              >
                {genre.name}
              </p>
            ))}
          </div>
        )}
        <p className="text-xs text-foreground/40">{formatDate(releaseDate)}</p>
      </div>
    </div>
  );
};

export default HomeMediaCard;
