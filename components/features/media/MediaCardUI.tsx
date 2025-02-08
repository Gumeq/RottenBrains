import React from "react";
import Link from "next/link";
import MediaCardOverlay from "@/components/features/media/MediaCardOverlay";
import HoverImage from "./TrailerDisplayOnHover";
import MoreOptions from "./MoreOptions";
import { formatDate, formatEpisodeCode, transformRuntime } from "@/lib/utils";

interface MediaCardProps {
  media: any;
  media_type?: string;
  media_id?: number;
  season_number?: number;
  episode_number?: number;
  watch_time?: number;
  user_id?: string;
  rounded?: boolean;
}

const MediaCardUI: React.FC<MediaCardProps> = ({
  media,
  media_type,
  media_id,
  season_number,
  episode_number,
  watch_time,
  user_id,
  rounded,
}) => {
  season_number = season_number || media.season_number || undefined;
  episode_number = episode_number || media.episode_number || undefined;
  media_type = media_type || media.media_type || undefined;
  media_id = media_id || media.media_id || undefined;
  watch_time = watch_time || media.watch_time || 0;

  const genreIds: bigint[] = media?.genres?.map((genre: any) => genre.id) || [];

  const imageUrl =
    media?.images?.backdrops?.[0]?.file_path ||
    (season_number && episode_number ? media.still_path : media.backdrop_path);

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
    <div className="mb-2 flex w-full min-w-[75vw] max-w-[100vw] flex-col md:w-full md:min-w-[320px] md:max-w-[400px]">
      <Link
        className={`relative w-full overflow-hidden md:rounded-[8px] ${rounded === true ? "rounded-[8px]" : ""}`}
        href={href}
      >
        <HoverImage
          imageUrl={imageUrl}
          altText={mediaTitle}
          media_type={media.media_type}
          media_id={media.media_id}
        >
          <MediaCardOverlay
            runtime={media.runtime}
            voteAverage={media.vote_average}
            isNew={isNew}
            isSoon={isSoon}
            isNewEpisodes={isNewEpisodes}
            watchTime={watch_time}
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
              media_type={media.media_type}
              media_id={media.media_id}
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

export default MediaCardUI;
