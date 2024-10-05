import {
  formatEpisodeCode,
  getRelativeTime,
  transformRuntime,
} from "@/lib/functions";
import { getWatchTime } from "@/utils/supabase/queries";
import { getEpisodeDetails, getMediaDetails } from "@/utils/tmdb";

type MediaCardSmallProps = {
  media_type: string;
  media_id: number;
  season_number?: number;
  episode_number?: number;
  user_id?: string; // Passed as a prop if available on the server
};

type Episode = {
  episode_number: number;
  name: string;
  overview: string;
  still_path: string;
  air_date: string;
  runtime: number;
};

// Server Component
const MediaCardSmall = async ({
  media_type,
  media_id,
  season_number,
  episode_number,
  user_id,
}: MediaCardSmallProps) => {
  const media = await getMediaDetails(
    media_type,
    media_id,
    season_number,
    episode_number,
  );

  // Fetch watch time if user is authenticated
  let watchTime = 0;
  if (user_id) {
    watchTime = await getWatchTime(
      user_id,
      media_type,
      media_id,
      season_number,
      episode_number,
    );
  }

  return (
    <div className="mb-4 flex w-full flex-col gap-2 hover:border-accent hover:bg-foreground/20 lg:mb-2 lg:flex-row lg:rounded-[8px] lg:p-2">
      <div className="relative w-full flex-shrink-0 overflow-hidden lg:w-1/2 lg:rounded-[4px]">
        {watchTime > 0 && (
          <div
            className="absolute bottom-0 left-0 h-1 bg-accent"
            style={{
              width: `${watchTime}%`,
            }}
          ></div>
        )}
        <div className="absolute bottom-0 right-0 m-1 flex flex-row-reverse gap-1">
          <div className="rounded-[4px] bg-black/50 px-1 text-xs font-medium text-white">
            {transformRuntime(media.runtime)}
          </div>
          <div className="rounded-[4px] bg-black/50 px-1 text-xs font-medium text-white">
            {media.vote_average.toFixed(1)}/10
          </div>
        </div>
        <img
          src={
            media.images &&
            media.images.backdrops &&
            media.images.backdrops.length > 0
              ? `https://image.tmdb.org/t/p/w780${media.images.backdrops[0].file_path}`
              : `https://image.tmdb.org/t/p/w780${media.backdrop_path || media.still_path}`
          }
          alt={`Still from episode ${media.name || media.title}`}
          className="w-full bg-foreground/10 lg:rounded-[4px]"
        />
      </div>
      <div className="flex flex-col gap-1 px-4 lg:px-0">
        <h3 className="">
          {media.name || media.title} |{" "}
          {season_number &&
            episode_number &&
            formatEpisodeCode(season_number, episode_number)}
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
