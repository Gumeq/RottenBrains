import { getEpisodeDetails, getMediaDetails } from "@/utils/tmdb";
import Link from "next/link";
import React from "react";

interface MediaCardProps {
	media_type: string;
	media_id: number;
	season_number?: number;
	episode_number?: number;
}

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

const MediaCard: React.FC<MediaCardProps> = async ({
	media_type,
	media_id,
	season_number,
	episode_number,
}) => {
	console.log(season_number);
	let media: any;
	if (media_type === "movie") {
		media = await getMediaDetails(media_type, media_id);
	} else {
		if (season_number && episode_number) {
			media = await getEpisodeDetails(
				media_id,
				season_number,
				episode_number
			);
		}
	}
	if (!media) {
		return <p>loading...</p>;
	}

	console.log(media);

	return (
		<div className="w-full flex flex-row gap-4">
			<Link
				className="relative min-w-[300px]"
				href={
					media_type === "movie"
						? `/protected/watch/${media_type}/${media_id}`
						: `/protected/watch/${media_type}/${media_id}/${season_number}/${episode_number}`
				}
			>
				<div className="absolute bottom-0 right-0 m-1 text-sm p-1 py-0 rounded-[4px] bg-black/50 text-white">
					{transformRuntime(media.runtime)}
				</div>
				<img
					src={`https://image.tmdb.org/t/p/w300${
						media.backdrop_path || media.still_path
					}`}
					alt=""
					className="aspect-[16/9] rounded-[8px]"
				/>
			</Link>
			<div className="flex flex-col">
				<h2 className="text-lg flex flex-row gap-1">
					{media.title || media.name}
					{media_type === "tv" && (
						<p>
							| S{season_number}E{episode_number}
						</p>
					)}
				</h2>
				<p className="line-clamp-2 text-foreground/50">
					{media.overview}
				</p>
			</div>
		</div>
	);
};

export default MediaCard;
