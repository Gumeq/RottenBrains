import {
  formatEpisodeCode,
  getRelativeTime,
  transformRuntime,
} from "@/lib/functions";
import { getWatchTime } from "@/utils/supabase/serverQueries";
import { getEpisodeDetails } from "@/utils/tmdb";

type EpisodeCardProps = {
  media_id: number;
  season_number: number;
  episode_number: number;
  user_id?: string; // Passed as a prop if available on the server
};

type Episode = {
  episode_number: number;
  name: string;
  overview: string;
  still_path: string;
  air_date: string;
  runtime: number;
  vote_average: number;
};

// Server Component
const EpisodeCard = async ({
  media_id,
  season_number,
  episode_number,
  user_id,
}: EpisodeCardProps) => {
  // Fetch episode details
  const episode: Episode = await getEpisodeDetails(
    media_id,
    season_number,
    episode_number,
  );

  // Fetch watch time if user is authenticated
  let watchTime = 0;
  if (user_id) {
    watchTime = await getWatchTime(
      user_id,
      "tv",
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
        <div className="absolute bottom-0 right-0 m-2 flex flex-row-reverse gap-2">
          <div className="rounded-[4px] bg-black/60 px-2 py-1 text-xs text-white">
            {transformRuntime(episode.runtime)}
          </div>
          <div className="rounded-[4px] bg-black/60 px-2 py-1 text-xs text-white">
            {episode.vote_average.toFixed(1)} / 10
          </div>
        </div>
        <img
          src={`https://image.tmdb.org/t/p/w780${episode.still_path}`}
          alt={`Still from episode ${episode.name}`}
          width={780}
          height={440}
          className="w-full bg-foreground/10 lg:rounded-[4px]"
        />
      </div>
      <div className="flex flex-col gap-1 px-4 lg:px-0">
        <h3 className="">
          {episode.name} | {formatEpisodeCode(season_number, episode_number)}
        </h3>
        <p className="text-sm text-foreground/50 lg:text-sm">
          {getRelativeTime(episode.air_date)}
        </p>
      </div>
    </div>
  );
};

export default EpisodeCard;
