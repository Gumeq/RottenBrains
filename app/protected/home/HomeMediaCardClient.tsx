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
import MediaCardOverlay from "@/components/MediaCardOverlay";

interface MediaCardProps {
  media_type: string;
  media_id: number;
  season_number?: number;
  episode_number?: number;
  quality?: string;
  user_id: string;
  rounded?: boolean;
}

const HomeMediaCardClient: React.FC<MediaCardProps> = React.memo(
  ({
    media_type,
    media_id,
    season_number,
    episode_number,
    quality,
    user_id,
    rounded,
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
        <div className="flex flex-col gap-4">
          <div className="aspect-[16/9] w-full bg-foreground/10"></div>
          {/* <div className="h-16 w-screen lg:w-full lg:min-w-[400px] lg:max-w-[550px]"></div> */}
          <div className="h-6 w-2/3 bg-foreground/10"></div>
          <div className="h-6 w-1/3 bg-foreground/10"></div>
        </div>
      );

    if (error) {
      return <p>Error loading media data.</p>;
    }

    // Extract genre IDs
    const genreIds: bigint[] =
      media?.genres?.map((genre: any) => genre.id) || [];

    // Determine image URL
    const imageUrl =
      media?.images?.backdrops?.[0]?.file_path ||
      (season_number && episode_number
        ? media.still_path
        : media.backdrop_path);

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
      <div className="mb-2 flex flex-col lg:w-full lg:min-w-[350px] lg:max-w-[450px]">
        <Link
          className={`relative w-full overflow-hidden lg:rounded-[8px] ${rounded === true ? "rounded-[8px]" : ""}`}
          href={href}
        >
          <HoverImage
            imageUrl={imageUrl}
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
        <div className="flex flex-col gap-2 lg:p-0">
          <div className="mt-2 flex flex-row justify-between">
            <h2 className="font-medium">{mediaTitle}</h2>
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
