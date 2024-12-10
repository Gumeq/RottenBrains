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
        {watchTime > 0 && (
          <div
            className="absolute bottom-0 left-0 h-1 bg-accent"
            style={{
              width: `${watchTime}%`,
            }}
          ></div>
        )}
        <div className="absolute bottom-1 right-1 m-1 flex flex-row-reverse gap-1">
          {media.runtime && (
            <div className="rounded-[4px] bg-black/50 px-2 py-1 text-xs font-medium text-white">
              {transformRuntime(media.runtime)}
            </div>
          )}
          {media.vote_average && (
            <div className="rounded-[4px] bg-black/50 px-2 py-1 text-xs font-medium text-white">
              {media.vote_average.toFixed(1)}
            </div>
          )}
        </div>
        {imageUrl ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${imageUrl}`}
            alt={`${media.title || media.name} Image`}
            loading="lazy"
            className="aspect-[16/9] w-full overflow-hidden bg-foreground/10"
          />
        ) : (
          <div className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 bg-foreground/10">
            <img
              src="/assets/images/logo_new_black.svg"
              alt="No image available"
              className="invert-on-dark h-6 w-6 opacity-50"
            />
            <p className="text-xs text-foreground/50">No image available</p>
          </div>
        )}
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
