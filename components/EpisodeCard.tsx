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
	runtime: number;
};

function transformRuntime(minutes: number): string {
	const hours: number = Math.floor(minutes / 60);
	const remainingMinutes: number = minutes % 60;

	if (hours > 0) {
		return `${hours} h ${remainingMinutes} m`;
	} else {
		if (remainingMinutes > 0) {
			return `${remainingMinutes} m`;
		} else {
			return "N/A";
		}
	}
}

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
		<div className=" lg:p-2 lg:rounded-[8px] lg:mb-2 hover:border-accent flex lg:flex-row flex-col gap-4 hover:bg-foreground/20 w-full mb-8">
			<div className="relative lg:w-1/2 w-full flex-shrink-0 ">
				<div className="absolute bottom-0 right-0 m-2 flex flex-row-reverse gap-2">
					<div className="text-sm px-4 py-1 rounded-[14px] bg-black/50 text-white">
						{transformRuntime(episode.runtime)}
					</div>
				</div>
				<img
					src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
					alt="episode still"
					loading="lazy"
					className="w-full bg-foreground/10 lg:rounded-[4px]"
				/>
			</div>
			<div className="flex flex-col gap-2  px-2 lg:px-0">
				<h3 className="text-lg">
					{episode.name}
					{" | "}
					{formatEpisodeCode(season_number, episode_number)}
				</h3>
				<p className="text-foreground/50 text-sm">
					{getRelativeTime(episode.air_date)}
				</p>
				<p className="line-clamp-2 text-foreground/50 lg:hidden">
					{episode.overview}
				</p>
			</div>
		</div>
	);
};

export default EpisodeCard;
