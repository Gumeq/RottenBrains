"use client";

import { getEpisodeDetails } from "@/utils/tmdb";
import React, { useEffect, useState } from "react";
import { getRelativeTime } from "./RelativeTime";

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
};

const EpisodeCard = ({
	media_id,
	season_number,
	episode_number,
}: episodeCardProps) => {
	const [episode, setEpisode] = useState<Episode>();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchTVShowDetails = async () => {
			try {
				const episodeData = await getEpisodeDetails(
					media_id,
					season_number,
					episode_number
				);
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
			episodeNumber
		).padStart(2, "0")}`;
	};

	if (loading) {
		return <p>loading...</p>;
	}

	if (!episode) {
		return <p>No episode</p>;
	}

	return (
		<div className="border p-4 rounded-[10px] mb-2 hover:border-accent flex flex-row gap-4 items-center">
			<div>
				<img
					src={`https://image.tmdb.org/t/p/original${episode.still_path}`}
					alt="episode still"
					width={160}
					height={90}
					loading="lazy"
					className="max-w-[160px] max-h-[90px] bg-foreground/10 rounded-[6px]"
				/>
			</div>
			<div className="flex flex-col">
				<h3 className="text-lg">
					{formatEpisodeCode(season_number, episode_number)} -{" "}
					{episode.name}
				</h3>
				<p className="text-foreground/50 text-sm">
					{getRelativeTime(episode.air_date)}
				</p>
			</div>
		</div>
	);
};

export default EpisodeCard;
