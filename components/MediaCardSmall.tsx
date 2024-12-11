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
};

const MediaCardSmall = async ({
  media_type,
  media_id,
  season_number,
  episode_number,
  user_id,
  media,
}: MediaCardSmallProps) => {
  if (!media) {
    if (season_number && episode_number) {
      media = await getEpisodeDetails(media_id, season_number, episode_number);
    } else {
      media = await getMediaDetails(media_type, media_id);
    }
  }
  // Fetch watch time if user is authenticated
  let watchTime;

  if (user_id) {
    watchTime = await getWatchTime(
      user_id,
      media_type,
      media_id,
      season_number,
      episode_number,
    );
  }

  const imageUrl =
    media?.images?.backdrops?.[0]?.file_path ||
    (season_number && episode_number ? media.still_path : media.backdrop_path);

  const mediaTitle = media.title || media.name;
  const formattedEpisodeCode =
    media_type === "tv" && season_number && episode_number
      ? ` | ${formatEpisodeCode(season_number, episode_number)}`
      : "";

  return (
    <div className="mb-4 flex w-full flex-col gap-2 hover:border-accent hover:bg-foreground/20 lg:mb-2 lg:flex-row lg:p-2">
      <div className="relative w-full flex-shrink-0 overflow-hidden lg:w-1/2">
        <MediaCardOverlay
          runtime={media.runtime}
          voteAverage={media.vote_average}
          watchTime={watchTime}
          transformRuntime={transformRuntime}
        />
        <ImageWithFallback
          imageUrl={imageUrl}
          altText={media.title || media.name}
        />
      </div>
      <div className="flex flex-col gap-1 px-2 lg:px-0">
        <h3 className="flex items-center space-x-2">
          {mediaTitle}
          {formattedEpisodeCode}
        </h3>

        <p className="text-sm text-foreground/50 lg:text-sm">
          {getRelativeTime(
            media.air_date || media.first_air_date || media.release_date,
          )}
        </p>
      </div>
    </div>
  );
};

export default MediaCardSmall;
