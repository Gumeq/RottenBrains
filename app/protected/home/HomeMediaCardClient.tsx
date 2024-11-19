"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import MoreOptions from "./MoreOptions";
import {
  formatDate,
  formatEpisodeCode,
  transformRuntime,
} from "@/lib/functions";
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

const HomeMediaCardClient: React.FC<MediaCardProps> = React.memo(
  ({
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
      let isMounted = true;

      const fetchMediaDetails = async () => {
        try {
          let fetchedMedia;
          if (media_type === "movie") {
            fetchedMedia = await getMediaDetails(media_type, media_id);
          } else if (season_number && episode_number) {
            fetchedMedia = await getEpisodeDetails(
              media_id,
              season_number,
              episode_number,
            );
          } else {
            fetchedMedia = await getMediaDetails(media_type, media_id);
          }

          if (isMounted) {
            setMedia(fetchedMedia);
          }
        } catch (err) {
          setError("Failed to load media data.");
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

      fetchMediaDetails();

      return () => {
        isMounted = false;
      };
    }, [media_type, media_id, season_number, episode_number]);

    useEffect(() => {
      if (!media) return;

      const fetchWatchTime = async () => {
        try {
          const fetchedWatchTime = await getWatchTime(
            user_id,
            media_type,
            media_id,
            season_number,
            episode_number,
          );
          setWatchTime(fetchedWatchTime || 0);
        } catch (err) {
          console.error("Failed to fetch watch time", err);
        }
      };

      fetchWatchTime();
    }, [media, user_id, media_type, media_id, season_number, episode_number]);

    if (loading)
      return (
        <div className="flex flex-col">
          <div className="mb-4 aspect-[16/9] w-full rounded-[8px] bg-foreground/20"></div>
          <div className="h-14 w-screen lg:w-full lg:min-w-[400px] lg:max-w-[550px]"></div>
        </div>
      );

    if (error) {
      return <p>Error loading media data.</p>;
    }

    if (watchTime && watchTime > 85) {
      return null;
    }

    const genreIds = media?.genres?.map((genre: any) => genre.id) || [];

    const imageUrl =
      media?.images?.backdrops?.[0]?.file_path ||
      (season_number && episode_number
        ? media.still_path
        : media.backdrop_path);

    const releaseDate =
      media.release_date || media.air_date || media.first_air_date;

    let dayDifference;
    let dayDifferenceTv;
    if (releaseDate) {
      const today = new Date();
      const releaseDateObj = new Date(releaseDate);
      const timeDiff = today.getTime() - releaseDateObj.getTime();
      dayDifference = timeDiff / (1000 * 3600 * 24);

      if (media_type === "tv" && media.last_air_date) {
        const lastAirDateObj = new Date(media.last_air_date);
        const timeDiffTv = today.getTime() - lastAirDateObj.getTime();
        dayDifferenceTv = timeDiffTv / (1000 * 3600 * 24);
      }
    }

    // Function to generate the href link
    const getHref = () => {
      if (media_type === "movie") {
        return `/protected/watch/${media_type}/${media_id}`;
      } else if (season_number && episode_number) {
        return `/protected/watch/${media_type}/${media_id}/${season_number}/${episode_number}`;
      } else {
        return `/protected/watch/${media_type}/${media_id}/1/1`;
      }
    };

    // Function to get media title
    const getMediaTitle = () => {
      const baseTitle = media.title || media.name;
      if (media_type === "tv" && episode_number && season_number) {
        return `${baseTitle} | ${formatEpisodeCode(season_number, episode_number)}`;
      }
      return baseTitle;
    };

    return (
      <div className="mb-4 flex w-full flex-col lg:w-full lg:min-w-[350px] lg:max-w-[450px]">
        <Link
          className="relative overflow-hidden rounded-[8px]"
          href={getHref()}
        >
          <HoverImage
            imageUrl={imageUrl}
            altText={media.title || media.name || "Media Image"}
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
                <div className="rounded-[4px] bg-secondary px-2 py-1 text-xs text-white">
                  NEW
                </div>
              )}
              {dayDifference && dayDifference < 0 && (
                <div className="rounded-[4px] bg-secondary px-2 py-1 text-xs text-white">
                  SOON
                </div>
              )}
              {media_type === "tv" &&
                dayDifference &&
                dayDifference >= 30 &&
                dayDifferenceTv &&
                dayDifferenceTv < 30 && (
                  <div className="rounded-[4px] bg-secondary px-2 py-1 text-xs text-white">
                    NEW EPISODES
                  </div>
                )}
            </div>

            {/* Display the progress bar only if watchTime is greater than 0 */}
            {watchTime !== 0 && (
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
            <h2 className="text-lg font-medium">{getMediaTitle()}</h2>
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
          <p className="text-xs text-foreground/40">
            {formatDate(
              media.release_date || media.air_date || media.first_air_date,
            )}
          </p>
        </div>
      </div>
    );
  },
);

export default HomeMediaCardClient;
