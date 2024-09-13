"use client";

import { useUser } from "@/context/UserContext";
import { getRelativeTime } from "@/lib/functions";
import { getWatchTime } from "@/utils/supabase/queries";
import { getEpisodeDetails } from "@/utils/tmdb";
import React, { useEffect, useState } from "react";

type episodeCardProps = {
  media_id: number;
  season_number: number;
  episode_number: number;
};

type Episode = {
  episode_number: number;
  name: string;
  overview: string;
  still_path: string;
  air_date: string;
  runtime: number;
};

function transformRuntime(minutes: number): string {
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

const EpisodeCard = ({
  media_id,
  season_number,
  episode_number,
}: episodeCardProps) => {
  const [episode, setEpisode] = useState<Episode>();
  const [loading, setLoading] = useState(true);
  const [watchTime, setWatchTime] = useState<number>(0);
  const { user } = useUser();

  useEffect(() => {
    const fetchTVShowDetails = async () => {
      try {
        const episodeData = await getEpisodeDetails(
          media_id,
          season_number,
          episode_number,
        );
        if (user) {
          const watchTime = await getWatchTime(
            user.id.toString(),
            "tv",
            media_id,
            season_number,
            episode_number,
          );
          setWatchTime(watchTime);
        }
        setEpisode(episodeData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Episode Details:", error);
      }
    };

    fetchTVShowDetails();
  }, [media_id, season_number, episode_number]);

  const formatEpisodeCode = (seasonNumber: number, episodeNumber: number) => {
    return `S${String(seasonNumber).padStart(2, "0")}E${String(
      episodeNumber,
    ).padStart(2, "0")}`;
  };

  if (loading || !episode || !user) {
    return (
      <div className="mb-8 flex w-full flex-col gap-4 hover:border-accent hover:bg-foreground/20 lg:mb-2 lg:flex-row lg:rounded-[8px] lg:p-2">
        {/* Image Skeleton */}
        <div className="relative aspect-[16/9] w-full flex-shrink-0 animate-pulse overflow-hidden bg-foreground/10 lg:w-1/2 lg:rounded-[4px]"></div>

        {/* Text Skeleton */}
        <div className="flex flex-col gap-2 px-2 lg:px-0">
          {/* Title skeleton */}
          <div className="h-6 w-3/4 animate-pulse rounded bg-foreground/10 lg:w-1/2"></div>

          {/* Subtitle skeleton */}
          <div className="h-4 w-1/4 animate-pulse rounded bg-foreground/10 lg:w-1/5"></div>

          {/* Description skeleton */}
          <div className="hidden lg:block">
            <div className="mb-2 h-4 w-full animate-pulse rounded bg-foreground/10"></div>
            <div className="h-4 w-4/5 animate-pulse rounded bg-foreground/10"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 flex w-full flex-col gap-4 hover:border-accent hover:bg-foreground/20 lg:mb-2 lg:flex-row lg:rounded-[8px] lg:p-2">
      <div className="relative w-full flex-shrink-0 overflow-hidden lg:w-1/2 lg:rounded-[4px]">
        {watchTime > 0 && (
          <div
            className="absolute bottom-0 left-0 h-1 bg-accent"
            style={{
              width: `${watchTime}%`,
            }}
          ></div>
        )}
        <div className="absolute bottom-0 right-0 m-2 flex flex-row-reverse gap-2">
          <div className="rounded-[14px] bg-black/50 px-4 py-1 text-sm text-white">
            {transformRuntime(episode.runtime)}
          </div>
        </div>
        <img
          src={`https://image.tmdb.org/t/p/w780${episode.still_path}`}
          alt="episode still"
          loading="lazy"
          className="w-full bg-foreground/10 lg:rounded-[4px]"
        />
      </div>
      <div className="flex flex-col gap-2 px-2 lg:px-0">
        <h3 className="text-lg lg:text-base">
          {episode.name}
          {" | "}
          {formatEpisodeCode(season_number, episode_number)}
        </h3>
        <p className="text-sm text-foreground/50 lg:text-sm">
          {getRelativeTime(episode.air_date)}
        </p>
        <p className="line-clamp-2 text-foreground/50 lg:hidden">
          {episode.overview}
        </p>
      </div>
    </div>
  );
};

export default EpisodeCard;
