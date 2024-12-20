import {
  formatEpisodeCode,
  getRelativeTime,
  transformRuntime,
} from "@/lib/functions";
import { getWatchTime } from "@/utils/supabase/queries";
import { getEpisodeDetails, getMediaDetails } from "@/utils/tmdb";
import MediaCardOverlay from "./MediaCardOverlay";
import ImageWithFallback from "./ImageWithFallback";

type MediaCardSmallProps = {
  media_type: string;
  media_id: number;
  season_number?: number;
  episode_number?: number;
  user_id?: string;
  media?: any;
  rounded?: boolean;
};

const MediaCardSmall = async ({
  media_type,
  media_id,
  season_number,
  episode_number,
  user_id,
  media,
  rounded,
}: MediaCardSmallProps) => {
  let fetchedWatchTime = null;

  const fetchMedia = async () => {
    if (!media) {
      if (season_number && episode_number) {
        return getEpisodeDetails(media_id, season_number, episode_number);
      }
      return getMediaDetails(media_type, media_id);
    }
    return media;
  };

  const fetchWatchTime = async () => {
    if (user_id) {
      return getWatchTime(
        user_id,
        media_type,
        media_id,
        season_number,
        episode_number,
      );
    }
    return null;
  };

  // Fetch media and watch time in parallel
  const [fetchedMedia, watchTime] = await Promise.all([
    fetchMedia(),
    fetchWatchTime(),
  ]);

  media = fetchedMedia;
  fetchedWatchTime = watchTime;

  const {
    runtime,
    vote_average,
    title,
    name,
    images,
    air_date,
    first_air_date,
    release_date,
  } = media;

  const imageUrl =
    images?.backdrops?.[0]?.file_path ||
    (season_number && episode_number ? media.still_path : media.backdrop_path);

  const mediaTitle = title || name || "Unknown Title";
  const episodeCode =
    media_type === "tv" && season_number && episode_number
      ? ` | ${formatEpisodeCode(season_number, episode_number)}`
      : "";

  const relativeTime = getRelativeTime(
    air_date || first_air_date || release_date,
  );

  return (
    <div className="flex w-full flex-col gap-2 hover:border-accent lg:flex-row lg:p-2">
      <div
        className={`relative w-full flex-shrink-0 overflow-hidden lg:w-1/2 ${
          rounded ? "rounded-[8px]" : "lg:rounded-[8px]"
        }`}
      >
        <MediaCardOverlay
          runtime={runtime}
          voteAverage={vote_average}
          watchTime={fetchedWatchTime}
          transformRuntime={transformRuntime}
        />
        <ImageWithFallback
          imageUrl={imageUrl}
          altText={mediaTitle}
          quality={"w1280"}
        />
      </div>
      <div className="flex flex-col gap-1 px-2 lg:px-0">
        <h3 className="flex items-center space-x-2 lg:text-sm">
          {mediaTitle}
          {episodeCode}
        </h3>
        <p className="text-xs text-foreground/50">{relativeTime}</p>
      </div>
    </div>
  );
};

export default MediaCardSmall;
