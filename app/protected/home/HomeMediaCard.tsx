import { getEpisodeDetails, getMediaDetails } from "@/utils/tmdb";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import Link from "next/link";
import React from "react";

interface MediaCardProps {
  media_type: string;
  media_id: number;
  season_number?: number;
  episode_number?: number;
  quality?: string;
  percentage_watched?: number;
}

export function transformRuntime(minutes: number): string {
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

export function formatDate(inputDate: string) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  function getOrdinalSuffix(day: any) {
    if (day > 3 && day < 21) return "th"; // Covers 11th, 12th, 13th, etc.
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  if (inputDate === null || inputDate === undefined) {
    return;
  }
  // Parse the input date string
  const dateParts = inputDate.split("-");
  const year = dateParts[0];
  const month = months[parseInt(dateParts[1], 10) - 1];
  const day = parseInt(dateParts[2], 10);
  const ordinalSuffix = getOrdinalSuffix(day);

  // Format the date
  return `${day}${ordinalSuffix} ${month} ${year}`;
}

const HomeMediaCard: React.FC<MediaCardProps> = async ({
  media_type,
  media_id,
  season_number,
  episode_number,
  quality,
  percentage_watched,
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

  // Ensure that percentage_watched is a valid number and greater than 0
  const isValidPercentageWatched =
    typeof percentage_watched === "number" &&
    !isNaN(percentage_watched) &&
    percentage_watched > 0;

  return (
    <div className="mb-4 flex w-full flex-col lg:mb-8">
      <Link
        className="relative overflow-hidden lg:rounded-[16px]"
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
            <div className="rounded-[14px] bg-black/50 px-4 py-1 text-sm text-white">
              {transformRuntime(media.runtime)}
            </div>
          )}
          <div className="rounded-[14px] bg-black/50 px-4 py-1 text-sm text-white">
            {media.vote_average.toFixed(1)} / 10
          </div>
          {quality && (
            <div className="rounded-[14px] bg-black/50 px-4 py-1 text-sm text-white">
              {quality}
            </div>
          )}
        </div>

        {/* Display the progress bar only if percentage_watched is valid */}
        {isValidPercentageWatched && (
          <div
            className="absolute bottom-0 left-0 h-1 bg-accent"
            style={{
              width: `${percentage_watched}%`,
            }}
          ></div>
        )}
        <div className="absolute right-2 top-2 flex h-[40px] w-[40px] flex-shrink-0 items-center justify-center rounded-full bg-black/50">
          <img
            src={
              media_type === "movie"
                ? "/assets/icons/movie-outline.svg"
                : "/assets/icons/tv-outline.svg"
            }
            alt=""
            className="invert"
          />
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
      <div className="flex flex-col px-2 lg:p-0">
        <div className="my-2 flex flex-row justify-between">
          <h2 className="flex flex-row gap-1 text-lg font-medium">
            {media.title || media.name}
            {media_type === "tv" && episode_number && (
              <p>
                | S{season_number}E{episode_number}
              </p>
            )}
          </h2>
        </div>
        <p className="line-clamp-2 text-sm text-foreground/50">
          {media.overview}
        </p>
        <p className="mt-2 text-sm text-foreground/50">
          {formatDate(
            media.release_date || media.air_date || media.first_air_date,
          )}
        </p>
      </div>
    </div>
  );
};

export default HomeMediaCard;
