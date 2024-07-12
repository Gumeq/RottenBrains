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
};

const TVShowDetails = ({ tv_show_id }: TVShowDetailsProps) => {
	const [seasons, setSeasons] = useState<Season[]>([]);
	const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
	const [episodes, setEpisodes] = useState<Episode[]>([]);

	useEffect(() => {
		const fetchTVShowDetails = async () => {
			try {
				const tvShowData = await getTVDetails(tv_show_id);
				setSeasons(tvShowData.seasons);
			} catch (error) {
				console.error("Error fetching TV show details:", error);
			}
		};

		fetchTVShowDetails();
	}, [tv_show_id]);

	const handleSeasonChange = async (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		const seasonNumber = Number(event.target.value);
		try {
			const seasonData = await getSeasonDetails(tv_show_id, seasonNumber);
			setEpisodes(seasonData.episodes);
			setSelectedSeason(seasonNumber);
		} catch (error) {
			console.error("Error fetching season details:", error);
		}
	};
	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Seasons</h1>
			<div className="mb-4">
				<select
					onChange={handleSeasonChange}
					className="p-2 border rounded w-full md:w-1/2 lg:w-1/3 bg-background text-foreground"
					defaultValue=""
				>
					<option value="" disabled>
						Select a Season
					</option>
					{seasons.map((season) => (
						<option
							key={season.season_number}
							value={season.season_number}
						>
							{season.name} ({season.episode_count} episodes)
						</option>
					))}
				</select>
			</div>
			{selectedSeason !== null && (
				<div className="mt-8">
					<h2 className="text-2xl font-bold mb-4">
						Episodes of Season {selectedSeason}
					</h2>
					<div className="max-h-[400px] overflow-y-auto custom-scrollbar">
						{episodes.map((episode) => (
							<Link
								key={episode.episode_number}
								href={`/protected/watch/tv/${tv_show_id}/${selectedSeason}/${episode.episode_number}`}
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
