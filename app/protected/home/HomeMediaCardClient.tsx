"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import MoreOptions from "./MoreOptions";
import { formatDate, transformRuntime } from "@/lib/functions";
import { getWatchTime } from "@/utils/supabase/queries";
import { getEpisodeDetails, getMediaDetails } from "@/utils/tmdb";

interface MediaCardProps {
  media_type: string;
  media_id: number;
  season_number?: number;
  episode_number?: number;
  quality?: string;
  user_id: string;
}

const HomeMediaCardClient: React.FC<MediaCardProps> = ({
  media_type,
  media_id,
  season_number,
  episode_number,
  quality,
  user_id,
}) => {
  const [media, setMedia] = useState<any>(null);
  const [watchTime, setWatchTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMediaData = async () => {
      try {
        let fetchedMedia;
        if (media_type === "movie") {
          fetchedMedia = await getMediaDetails(media_type, media_id);
        } else {
          if (season_number && episode_number) {
            fetchedMedia = await getEpisodeDetails(
              media_id,
              season_number,
              episode_number,
            );
          } else {
            fetchedMedia = await getMediaDetails(media_type, media_id);
          }
        }

        setMedia(fetchedMedia);

        const fetchedWatchTime = await getWatchTime(
          user_id,
          media_type,
          media_id,
          season_number,
          episode_number,
        );
        setWatchTime(fetchedWatchTime || 0);
      } catch (err) {
        setError("Failed to load media data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMediaData();
  }, [media_type, media_id, season_number, episode_number, user_id]);

  if (loading)
    return (
      <>
        <div className="flex flex-col">
          <div className="mb-4 flex aspect-[16/9] w-screen flex-col rounded-[16px] bg-foreground/20 lg:mb-0 lg:w-auto lg:min-w-[400px] lg:max-w-[550px]"></div>
          <div className="h-14 w-screen lg:w-full lg:min-w-[400px] lg:max-w-[550px]"></div>
        </div>
      </>
    );
  if (error) return <div>{error}</div>;

  let genreIds = [];
  if (media?.genres && Array.isArray(media.genres)) {
    genreIds = media.genres.map((genre: any) => genre.id);
  }

  return (
    <div className="mb-4 flex w-screen flex-col lg:mb-0 lg:w-full lg:min-w-[400px] lg:max-w-[550px]">
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
          {media.runtime ? (
            <div className="rounded-[14px] bg-black/50 px-2 py-1 text-xs text-white">
              {transformRuntime(media.runtime)}
            </div>
          ) : (
            <div></div>
          )}
          <div className="rounded-[14px] bg-black/50 px-2 py-1 text-xs text-white">
            {media.vote_average.toFixed(1)} / 10
          </div>
        </div>

        {/* Display the progress bar only if percentage_watched is valid */}
        {watchTime !== 0 && (
          <div
            className="absolute bottom-0 left-0 h-1 bg-accent"
            style={{
              width: `${watchTime || 0}%`,
            }}
          ></div>
        )}
        <div className="absolute right-2 top-2 flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full bg-black/50">
          <img
            src={
              media_type === "movie"
                ? "/assets/icons/movie-outline.svg"
                : "/assets/icons/tv-outline.svg"
            }
            alt=""
            className="h-[20px] w-[20px] invert"
          />
        </div>
        <img
          src={
            media.images &&
            media.images.backdrops &&
            media.images.backdrops.length > 0
              ? `https://image.tmdb.org/t/p/w500${media.images.backdrops[0].file_path}`
              : season_number && episode_number
                ? `https://image.tmdb.org/t/p/w500${media.still_path}`
                : `https://image.tmdb.org/t/p/w500${media.backdrop_path}`
          }
          alt=""
          loading="lazy"
          className="aspect-[16/9] w-full bg-foreground/10 lg:rounded-[16px]"
        />
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

export default HomeMediaCardClient;
