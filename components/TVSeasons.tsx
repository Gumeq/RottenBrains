"use client";

import { getSeasonDetails, getTVDetails } from "@/utils/tmdb";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import EpisodeCard from "./EpisodeCard";

type Season = {
  season_number: number;
  name: string;
  episode_count: number;
  poster_path: string;
};

type Episode = {
  episode_number: number;
  name: string;
  overview: string;
  still_path: string;
};

type TVShowDetailsProps = {
  tv_show_id: number;
  season_number: number;
};

const TVShowDetails = ({ tv_show_id, season_number }: TVShowDetailsProps) => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    const fetchTVShowDetails = async () => {
      try {
        const tvShowData = await getTVDetails(tv_show_id);
        // Filter out special seasons
        const filteredSeasons = tvShowData.seasons.filter(
          (season: Season) => season.season_number !== 0,
        );
        setSeasons(filteredSeasons);
        // If there are seasons, select the first one by default
        if (filteredSeasons.length > 0) {
          const firstSeasonNumber =
            filteredSeasons[season_number - 1].season_number;
          setSelectedSeason(firstSeasonNumber);
          const seasonData = await getSeasonDetails(
            tv_show_id,
            firstSeasonNumber,
          );
          setEpisodes(seasonData.episodes);
        }
      } catch (error) {
        console.error("Error fetching TV show details:", error);
      }
    };

    fetchTVShowDetails();
  }, [tv_show_id]);

  const handleSeasonChange = async (seasonNumber: number) => {
    try {
      const seasonData = await getSeasonDetails(tv_show_id, seasonNumber);
      setEpisodes(seasonData.episodes);
      setSelectedSeason(seasonNumber);
    } catch (error) {
      console.error("Error fetching season details:", error);
    }
  };

  return (
    <div className="w-full">
      {/* <h1 className="text-2xl font-bold mb-2">Seasons</h1> */}
      <div className="custom-scrollbar flex gap-2 overflow-x-auto p-2">
        {seasons.map((season) => (
          <button
            key={season.season_number}
            onClick={() => handleSeasonChange(season.season_number)}
            className={`z-10 flex flex-row items-center gap-2 whitespace-nowrap rounded-[8px] bg-foreground/10 px-2 py-1 text-foreground drop-shadow-lg hover:scale-105 ${
              selectedSeason === season.season_number
                ? "border-2 border-foreground/20"
                : ""
            }`}
          >
            {season.name}
          </button>
        ))}
      </div>
      {selectedSeason !== null && (
        <div className="mt-2 w-full">
          {/* <h2 className="text-2xl font-bold mb-4">
						Episodes of Season {selectedSeason}
					</h2> */}
          <div className="flex w-full flex-col">
            {episodes.map((episode) => (
              <Link
                key={episode.episode_number}
                href={`/protected/watch/tv/${tv_show_id}/${selectedSeason}/${episode.episode_number}`}
                className="w-full"
              >
                <EpisodeCard
                  media_id={tv_show_id}
                  season_number={selectedSeason}
                  episode_number={episode.episode_number}
                ></EpisodeCard>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TVShowDetails;
