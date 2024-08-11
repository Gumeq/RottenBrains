import { getEpisodeDetails, getMediaDetails } from "@/utils/tmdb";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import Link from "next/link";
import React from "react";

interface MediaCardProps {
	media_type: string;
	media_id: number;
	season_number?: number;
	episode_number?: number;
	quality?: string;
	percentage_watched?: number;
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

	if (inputDate === null || inputDate === undefined) {
		return;
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
	quality,
	percentage_watched,
}) => {
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
		} else {
			media = await getMediaDetails(media_type, media_id);
		}
	}

	if (!media) {
		return <p>loading...</p>;
	}

	// Ensure that percentage_watched is a valid number and greater than 0
	const isValidPercentageWatched =
		typeof percentage_watched === "number" &&
		!isNaN(percentage_watched) &&
		percentage_watched > 0;

	return (
		<div className="lg:w-full w-screen flex flex-col gap-2 lg:mb-8 mb-4">
			<Link
				className="relative lg:rounded-[16px] overflow-hidden"
				href={
					media_type === "movie"
						? `/protected/watch/${media_type}/${media_id}`
						: `/protected/watch/${media_type}/${media_id}/${season_number}/${episode_number}`
				}
			>
				<div className="absolute bottom-0 right-0 m-2 flex flex-row-reverse gap-2">
					<div className="text-sm px-4 py-1 rounded-[14px] bg-black/50 text-white">
						{transformRuntime(media.runtime)}
					</div>
					{quality && (
						<div className="text-sm px-4 py-1 rounded-[14px] bg-black/50 text-white">
							{quality}
						</div>
					)}
				</div>

				{/* Display the progress bar only if percentage_watched is valid */}
				{isValidPercentageWatched && (
					<div
						className="absolute bottom-0 left-0 h-1 bg-accent"
						style={{
							width: `${percentage_watched}%`,
						}}
					></div>
				)}

				<img
					src={
						media.images &&
						media.images.backdrops &&
						media.images.backdrops.length > 0
							? `https://image.tmdb.org/t/p/w500${media.images.backdrops[0].file_path}`
							: season_number && episode_number
							? `https://image.tmdb.org/t/p/w500${media.still_path}`
							: ""
					}
					alt=""
					loading="lazy"
					className="aspect-[16/9] lg:rounded-[16px] bg-foreground/10"
				/>
			</Link>
			<div className="flex flex-col lg:p-0 px-2">
				<h2 className="text-lg flex flex-row gap-1 font-medium">
					{media.title || media.name}
					{media_type === "tv" && episode_number && (
						<p>
							| S{season_number}E{episode_number}
						</p>
					)}
				</h2>
				<p className="text-foreground/50">
					{formatDate(
						media.release_date ||
							media.air_date ||
							media.first_air_date
					)}
				</p>
				<p className="line-clamp-2 text-foreground/50">
					{media.overview}
				</p>
			</div>
		</div>
	);
};

export default HomeMediaCard;
