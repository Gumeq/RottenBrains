"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import MoreOptions from "./MoreOptions";
import { formatDate, transformRuntime } from "@/lib/functions";
import { getWatchTime } from "@/utils/supabase/queries";
import { getEpisodeDetails, getMediaDetails } from "@/utils/tmdb";
import HoverImage from "./HoverImage";

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
      <div className="flex flex-col">
        <div className="mb-4 flex aspect-[16/9] w-full flex-col rounded-[8px] bg-foreground/20 lg:mb-0 lg:w-auto lg:min-w-[400px] lg:max-w-[550px]"></div>
        <div className="h-14 w-screen lg:w-full lg:min-w-[400px] lg:max-w-[550px]"></div>
      </div>
    );

  if (error) return <div>{error}</div>;

  let genreIds = [];
  if (media?.genres && Array.isArray(media.genres)) {
    genreIds = media.genres.map((genre: any) => genre.id);
  }

  const imageUrl =
    media?.images?.backdrops?.[0]?.file_path ||
    (season_number && episode_number ? media.still_path : media.backdrop_path);

  const releaseDate =
    media.release_date || media.air_date || media.first_air_date;

  let dayDifference;
  let dayDifferenceTv;
  if (releaseDate) {
    const today = new Date();
    // Convert releaseDate string to a Date object
    const releaseDateObj = new Date(releaseDate);
    const timeDiff = today.getTime() - releaseDateObj.getTime();
    dayDifference = timeDiff / (1000 * 3600 * 24); // Convert milliseconds to days
    if (media_type === "tv" && media.last_air_date) {
      const last_air_date_OBJ = new Date(media.last_air_date);
      const timeDiff = today.getTime() - last_air_date_OBJ.getTime();
      dayDifferenceTv = timeDiff / (1000 * 3600 * 24);
    }
  }

  return (
    <div className="mb-4 flex w-full flex-col lg:w-full lg:min-w-[350px] lg:max-w-[450px]">
      <Link
        className="relative overflow-hidden rounded-[8px]"
        href={
          media_type === "movie"
            ? `/protected/watch/${media_type}/${media_id}`
            : season_number && episode_number
              ? `/protected/watch/${media_type}/${media_id}/${season_number}/${episode_number}`
              : `/protected/watch/${media_type}/${media_id}/1/1`
        }
      >
        <HoverImage
          imageUrl={imageUrl}
          altText={media.title || media.name}
          media_type={media_type}
          media_id={media_id}
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
          </div>
          <div className="absolute left-0 top-0 m-2">
            {dayDifference && dayDifference <= 30 && dayDifference > 0 && (
              <div className="rounded-[4px] bg-black/60 px-2 py-1 text-xs text-white">
                NEW
              </div>
            )}
            {dayDifference && dayDifference < 0 && (
              <div className="rounded-[4px] bg-black/60 px-2 py-1 text-xs text-white">
                SOON
              </div>
            )}
            {media_type === "tv" &&
              dayDifference &&
              dayDifference >= 30 &&
              dayDifferenceTv &&
              dayDifferenceTv < 30 && (
                <div className="rounded-[4px] bg-black/60 px-2 py-1 text-xs text-white">
                  NEW EPISODES
                </div>
              )}
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
        </HoverImage>
      </Link>
      <div className="flex flex-col px-2 lg:p-0">
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
