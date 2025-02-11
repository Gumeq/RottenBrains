import { getSeasonDetails, getTVDetails } from "@/lib/tmdb";
import Link from "next/link";
import MediaCardSmall from "../media/MediaCardSmall";

type TVShowDetailsProps = {
  tv_show_id: number;
  season_number: number;
  user_id: string;
};

const TVShowDetails = async ({
  tv_show_id,
  season_number,
  user_id,
}: TVShowDetailsProps) => {
  const tvShowData = await getTVDetails(tv_show_id);
  const filteredSeasons = tvShowData.seasons.filter(
    (season: any) => season.season_number !== 0,
  );

  const selectedSeason =
    filteredSeasons.find(
      (season: any) => season.season_number === Number(season_number),
    ) || filteredSeasons[0];

  const seasonData = await getSeasonDetails(
    tv_show_id,
    selectedSeason.season_number,
  );
  const episodes = seasonData.episodes;

  return (
    <div className="w-full">
      <div className="small-screen-watch-top sticky z-30 bg-background lg:z-auto">
        <div className="gradient-edge absolute right-0 top-0 z-20 h-full w-[10%]" />
        <div className="custom-scrollbar 0 flex gap-2 overflow-x-auto px-2 py-2 text-sm lg:px-0">
          {filteredSeasons.map((season: any) => (
            <Link
              key={season.season_number}
              href={`/protected/watch/tv/${tv_show_id}/${season.season_number}/1`}
              className={`z-10 flex flex-row items-center gap-2 whitespace-nowrap rounded-full bg-foreground/10 px-4 py-1 text-foreground drop-shadow-lg hover:scale-105 ${
                season.season_number === selectedSeason.season_number
                  ? "border-2 border-foreground/20"
                  : ""
              }`}
            >
              {season.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-2 w-full">
        <div className="flex w-full flex-col gap-8 px-4 lg:gap-4 lg:px-0">
          {episodes.map((episode: any) => (
            <Link
              key={episode.episode_number}
              href={`/protected/watch/tv/${tv_show_id}/${selectedSeason.season_number}/${episode.episode_number}`}
              className="w-full"
            >
              <MediaCardSmall
                media_type={"tv"}
                media_id={tv_show_id}
                user_id={user_id}
                season_number={selectedSeason.season_number}
                episode_number={episode.episode_number}
                media={episode}
                rounded={true}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TVShowDetails;
