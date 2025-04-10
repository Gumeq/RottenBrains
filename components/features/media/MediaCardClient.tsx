"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getEpisodeDetails, getMediaDetails } from "@/lib/tmdb";
import MediaCardOverlay from "@/components/features/media/MediaCardOverlay";
import HoverImage from "./TrailerDisplayOnHover";
import MoreOptions from "./MoreOptions";
import HomeMediaCardSkeleton from "@/components/features/media/MediaCardSkeleton";
import { getWatchTime } from "@/lib/supabase/clientQueries";
import {
  formatDate,
  formatEpisodeCode,
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

const MediaCardClient: React.FC<MediaCardProps> = React.memo(
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
          } else if (
            season_number &&
            episode_number &&
            season_number !== -1 &&
            episode_number !== -1
          ) {
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
          const fetchedWatchTime = user_id
            ? await getWatchTime(
                user_id,
                media_type,
                media_id,
                season_number,
                episode_number,
              )
            : 0;
          setWatchTime(fetchedWatchTime || 0);
        } catch (err) {
          console.error("Failed to fetch watch time", err);
        }
      };

      fetchWatchTime();
    }, [media, user_id, media_type, media_id, season_number, episode_number]);

    if (loading) return <HomeMediaCardSkeleton></HomeMediaCardSkeleton>;

    if (error) {
      return <HomeMediaCardSkeleton></HomeMediaCardSkeleton>;
    }

    // Extract genre IDs
    const genreIds: bigint[] =
      media?.genres?.map((genre: any) => genre.id) || [];

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
      <article className="mb-2 flex w-full min-w-[75vw] max-w-[100vw] flex-col lg:w-full lg:min-w-[320px] lg:max-w-[400px]">
        <Link
          className={`relative w-full overflow-hidden lg:rounded-[8px] ${
            rounded === true ? "rounded-[8px]" : ""
          }`}
          href={href}
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
        <div className="flex flex-col gap-2 lg:p-0">
          <div className="mt-2 flex flex-row justify-between">
            <h2 className="font-medium">{mediaTitle}</h2>
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
          <p className="text-xs text-foreground/40">
            {formatDate(
              media.release_date || media.air_date || media.first_air_date,
            )}
          </p>
        </div>
      </article>
    );
  },
);

export default MediaCardClient;
