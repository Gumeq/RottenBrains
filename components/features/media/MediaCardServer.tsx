// HomeMediaCard.tsx

import React from "react";
import { getEpisodeDetails, getMediaDetails } from "@/lib/tmdb";
import Link from "next/link";
import MediaCardOverlay from "@/components/features/media/MediaCardOverlay";
import HoverImage from "./TrailerDisplayOnHover";
import MoreOptions from "./MoreOptions";
import HomeMediaCardSkeleton from "@/components/features/media/MediaCardSkeleton";
import { getWatchTime } from "@/lib/supabase/serverQueries";
import {
  formatDate,
  formatEpisodeCode,
  getHrefFromMedia,
  getImageUrl,
  transformRuntime,
} from "@/lib/utils";

interface MediaCardProps {
  media_type: string;
  media_id: number;
  season_number?: number;
  episode_number?: number;
  quality?: string;
  user_id?: string;
  rounded?: boolean;
}

const MediaCardServer: React.FC<MediaCardProps> = async ({
  media_type,
  media_id,
  season_number,
  episode_number,
  quality,
  user_id,
  rounded,
}) => {
  let media: any;
  try {
    if (media_type === "movie") {
      media = await getMediaDetails(media_type, media_id);
    } else if (season_number && episode_number) {
      media = await getEpisodeDetails(media_id, season_number, episode_number);
    } else {
      media = await getMediaDetails(media_type, media_id);
    }
  } catch (error) {
    return <HomeMediaCardSkeleton></HomeMediaCardSkeleton>;
  }

  const watchTime = user_id
    ? await getWatchTime(
        user_id,
        media_type,
        media_id,
        season_number,
        episode_number,
      )
    : 0;

  // Extract genre IDs
  const genreIds: bigint[] = media?.genres?.map((genre: any) => genre.id) || [];

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

  return (
    <div className="mb-2 flex w-full min-w-[75vw] max-w-[100vw] flex-col md:w-full md:min-w-[320px] md:max-w-[400px]">
      <Link
        className={`relative w-full overflow-hidden md:rounded-[8px] ${rounded === true ? "rounded-[8px]" : ""}`}
        href={getHrefFromMedia(
          media_type,
          media_id,
          season_number,
          episode_number,
        )}
      >
        <HoverImage
          imageUrl={getImageUrl(media, season_number, episode_number)}
          altText={mediaTitle}
          media_type={media_type}
          media_id={media_id}
        >
          <MediaCardOverlay
            runtime={media.runtime}
            voteAverage={media.vote_average}
            quality={quality}
            isNew={isNew}
            isSoon={isSoon}
            isNewEpisodes={isNewEpisodes}
            watchTime={watchTime}
            transformRuntime={transformRuntime}
          />
        </HoverImage>
      </Link>
      <div className="flex flex-col gap-2 md:p-0">
        <div className="mt-2 flex flex-row justify-between">
          <h2 className="font-medium">
            {mediaTitle}
            {formattedEpisodeCode}
          </h2>
          {user_id ? (
            <MoreOptions
              user_id={user_id}
              media_type={media_type}
              media_id={media_id}
              genre_ids={genreIds}
            />
          ) : (
            <></>
          )}
        </div>
        {media.genres && (
          <div className="flex flex-row items-center gap-2 text-xs text-foreground/70">
            {media.genres.slice(0, 3).map((genre: any) => (
              <Link
                href={`/${media_type}/${genre.id}`}
                key={genre.id}
                className="rounded-[4px] bg-foreground/10 px-3 py-1"
              >
                {genre.name}
              </Link>
            ))}
          </div>
        )}
        <p className="text-xs text-foreground/40">{formatDate(releaseDate)}</p>
      </div>
    </div>
  );
};

export default MediaCardServer;
