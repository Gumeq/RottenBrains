import { getSeasonDetails, getTVDetails } from "@/utils/tmdb";
import Link from "next/link";
import MediaCardSmall from "./MediaCardSmall";

type TVShowDetailsProps = {
  tv_show_id: number;
  season_number: number;
};

const TVShowDetails = async ({
  tv_show_id,
  season_number,
}: TVShowDetailsProps) => {
  const tvShowData = await getTVDetails(tv_show_id);
  const filteredSeasons = tvShowData.seasons.filter(
    (season: any) => season.season_number !== 0,
  );

  console.log(filteredSeasons);
  const selectedSeason =
    filteredSeasons.find(
      (season: any) => season.season_number === Number(season_number),
    ) || filteredSeasons[0];

  const seasonData = await getSeasonDetails(
    tv_show_id,
    selectedSeason.season_number,
  );
  const episodes = seasonData.episodes;

  console.log(season_number);
  return (
    <div className="w-full">
      <div className="custom-scrollbar flex gap-2 overflow-x-auto p-2">
        {filteredSeasons.map((season: any) => (
          <Link
            key={season.season_number}
            href={`/protected/watch/tv/${tv_show_id}/${season.season_number}/1`}
            className={`z-10 flex flex-row items-center gap-2 whitespace-nowrap rounded-[8px] bg-foreground/10 px-2 py-1 text-foreground drop-shadow-lg hover:scale-105 ${
              season.season_number === selectedSeason.season_number
                ? "border-2 border-foreground/20"
                : ""
            }`}
          >
            {season.name}
          </Link>
        ))}
      </div>

      <div className="mt-2 w-full">
        <div className="flex w-full flex-col">
          {episodes.map((episode: any) => (
            <Link
              key={episode.episode_number}
              href={`/protected/watch/tv/${tv_show_id}/${selectedSeason.season_number}/${episode.episode_number}`}
              className="w-full"
            >
              <MediaCardSmall
                media_type={"tv"}
                media_id={tv_show_id}
                season_number={selectedSeason.season_number}
                episode_number={episode.episode_number}
                media={episode}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TVShowDetails;
