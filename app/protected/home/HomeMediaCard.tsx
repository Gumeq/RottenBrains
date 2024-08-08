import { getEpisodeDetails, getMediaDetails } from "@/utils/tmdb";
import Link from "next/link";
import React from "react";

interface MediaCardProps {
	media_type: string;
	media_id: number;
	season_number?: number;
	episode_number?: number;
}

export function transformRuntime(minutes: number): string {
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

export function formatDate(inputDate: string) {
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	function getOrdinalSuffix(day: any) {
		if (day > 3 && day < 21) return "th"; // Covers 11th, 12th, 13th, etc.
		switch (day % 10) {
			case 1:
				return "st";
			case 2:
				return "nd";
			case 3:
				return "rd";
			default:
				return "th";
		}
	}

	// Parse the input date string
	const dateParts = inputDate.split("-");
	const year = dateParts[0];
	const month = months[parseInt(dateParts[1], 10) - 1];
	const day = parseInt(dateParts[2], 10);
	const ordinalSuffix = getOrdinalSuffix(day);

	// Format the date
	return `${day}${ordinalSuffix} ${month} ${year}`;
}

const HomeMediaCard: React.FC<MediaCardProps> = async ({
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
	return (
		<div className="w-full flex flex-col gap-2 mb-4">
			<Link
				className="relative"
				href={
					media_type === "movie"
						? `/protected/watch/${media_type}/${media_id}`
						: `/protected/watch/${media_type}/${media_id}/${season_number}/${episode_number}`
				}
			>
				<div className="absolute bottom-0 right-0 m-2 text-sm p-1 py-0 rounded-[4px] bg-black/50 text-white">
					{transformRuntime(media.runtime)}
				</div>
				<img
					src={
						media.backdrop_path || media.still_path
							? `https://image.tmdb.org/t/p/w500${
									media.backdrop_path || media.still_path
							  }`
							: "/assets/images/placeholder_thumbnail.jpg"
					}
					alt=""
					className="aspect-[16/9] rounded-[16px]"
				/>
			</Link>
			<div className="flex flex-col">
				<h2 className="text-lg flex flex-row gap-1 font-medium">
					{media.title || media.name}
					{media_type === "tv" && (
						<p>
							| S{season_number}E{episode_number}
						</p>
					)}
				</h2>
				<p className="text-foreground/50">
					{formatDate(media.release_date || media.air_date)}
				</p>
				<p className="line-clamp-2 text-foreground/50">
					{media.overview}
				</p>
			</div>
		</div>
	);
};

export default HomeMediaCard;