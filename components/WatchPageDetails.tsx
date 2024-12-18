import React from "react";
import Link from "next/link";
import { formatEpisodeCode, getRelativeTime } from "@/lib/functions";
import ShareButton from "./ShareButton";

interface Genre {
  id: number;
  name: string;
}

interface Media {
  id: number;
  name?: string;
  title?: string;
  overview: string;
  genres: Genre[];
  release_date: string;
  first_air_date?: string;
  poster_path: string;
}

interface WatchPageDetailsProps {
  media: Media;
  media_type: string;
  media_id: number;
  episode?: {
    name: string;
    air_date: string;
    overview: string;
  };
  season_number?: number;
  episode_number?: number;
}

const WatchPageDetails: React.FC<WatchPageDetailsProps> = ({
  media,
  media_type,
  media_id,
  episode,
  season_number,
  episode_number,
}) => {
  const media_release_date =
    media_type === "movie"
      ? media.release_date
        ? media.release_date.slice(0, 4)
        : "0"
      : episode?.air_date
        ? episode.air_date
        : "0";

  const media_overview =
    media_type === "movie" ? media.overview : episode?.overview;
  return (
    <div className="mx-auto flex w-full flex-col gap-4 rounded-[8px] p-4 lg:p-0">
      <div className="flex flex-col gap-1">
        <h2 className="font-semibold lg:text-lg">
          {episode && season_number && episode_number
            ? `${episode.name} | ${
                formatEpisodeCode
                  ? formatEpisodeCode(season_number, episode_number)
                  : ""
              } | ${media.name || media.title}`
            : `${media.title || media.name}`}
        </h2>
        <p className="text-xs text-foreground/50">
          {getRelativeTime(media_release_date)}
        </p>
      </div>

      <div className="flex flex-shrink-0 flex-row gap-2 overflow-x-auto text-sm">
        <Link
          href={`/protected/create-post/${media_type}/${media_id}`}
          className="z-10 flex flex-row items-center gap-2 justify-self-end rounded-[4px] bg-foreground/10 px-4 py-1"
        >
          <img
            src="/assets/icons/star-outline.svg"
            alt="Rate"
            width={12}
            height={12}
            className="invert-on-dark"
            loading="lazy"
          />
          <p>Rate</p>
        </Link>
        <ShareButton />
      </div>
      <p className="line-clamp-2 text-sm text-foreground/50">
        {media_overview}
      </p>
      <Link
        href={`/protected/media/${media_type}/${media_id}`}
        className="flex h-32 w-full flex-row items-center gap-4 overflow-hidden rounded-[8px] bg-foreground/5"
      >
        <img
          src={`https://image.tmdb.org/t/p/w200${media.poster_path}`}
          alt={`${media.title || media.name} Poster`}
          className="h-full"
        />
        <div className="flex flex-col gap-2">
          <p className="font-semibold">{media.title || media.name}</p>
          <div className="flew-warp flex flex-row gap-2 text-sm">
            {media.genres.slice(0, 2).map((genre) => (
              <div
                key={genre.id}
                className="rounded-[4px] bg-foreground/10 px-2 py-1 text-foreground/80"
              >
                {genre.name}
              </div>
            ))}
          </div>
          <p className="text-sm text-foreground/50">
            {media_type === "movie"
              ? media.release_date
                ? media.release_date.slice(0, 4)
                : 0
              : media.first_air_date
                ? media.first_air_date.slice(0, 4)
                : 0}
          </p>
          {/* <div className="flex flex-row items-center gap-1">
            <p className="text-sm font-semibold uppercase text-foreground/50">
              Details
            </p>
            <img
              src="/assets/icons/chevron-forward.svg"
              alt="Details"
              className="invert-on-dark opacity-50"
            />
          </div> */}
        </div>
      </Link>
    </div>
  );
};

export default WatchPageDetails;
