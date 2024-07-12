"use client";

// components/VideoEmbed.js
import { getMediaDetails } from "@/utils/tmdb";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type VideoEmbedProps = {
	media_type: string;
	media_id: number;
	season_number?: number;
	episode_number?: number;
};

const VideoEmbed = ({
	media_type,
	media_id,
	season_number,
	episode_number,
}: VideoEmbedProps) => {
	const [linkStart, setLinkStart] = useState<string>(
		"https://vidsrc.pro/embed/"
	);
	const [media, setMedia] = useState<any>();
	const [showVideo, setShowVideo] = useState(false);
	const [nextClicked, setNextClicked] = useState(false);
	const [prevClicked, setPrevClicked] = useState(false);

	const updateLinkStart = (newLinkStart: string) => {
		setLinkStart(newLinkStart);
		setShowVideo(false); // Reset the video display when changing the link
	};

	let link = "";
	if (media_type === "movie") {
		link = `${linkStart}${media_type}/${media_id}`;
	} else {
		link = `${linkStart}${media_type}/${media_id}/${season_number}/${episode_number}`;
	}

	useEffect(() => {
		const fetchMediaDetails = async () => {
			try {
				const mediaData = await getMediaDetails(media_type, media_id);
				if (mediaData && mediaData.seasons) {
					mediaData.seasons = mediaData.seasons.filter(
						(season: { season_number: number }) =>
							season.season_number !== 0
					);
				}
				setMedia(mediaData);
			} catch (error) {
				console.error("Error fetching media data:", error);
				setMedia(null);
			}
		};

		fetchMediaDetails();
	}, [media_type, media_id]);

	const handleButtonClick = () => {
		setShowVideo(true);
	};

	if (!media) {
		return <h1>No Media Found</h1>;
	}

	const formatEpisodeCode = (seasonNumber: number, episodeNumber: number) => {
		return `S${String(seasonNumber).padStart(2, "0")}E${String(
			episodeNumber
		).padStart(2, "0")}`;
	};

	const getNextEpisodeLink = () => {
		if (
			media_type === "tv" &&
			season_number !== undefined &&
			episode_number !== undefined
		) {
			const seasonIndex = season_number - 1;
			const currentSeason = media.seasons[seasonIndex];

			if (currentSeason && episode_number < currentSeason.episode_count) {
				// Next episode in the same season
				return `/protected/watch/${media_type}/${media_id}/${season_number}/${
					Number(episode_number) + 1
				}`;
			} else if (seasonIndex + 1 < media.seasons.length) {
				// First episode of the next season
				const nextSeason = media.seasons[seasonIndex + 1];
				return `/protected/watch/${media_type}/${media_id}/${nextSeason.season_number}/1`;
			}
		}
		return null;
	};

	const getPreviousEpisodeLink = () => {
		if (
			media_type === "tv" &&
			season_number !== undefined &&
			episode_number !== undefined
		) {
			const seasonIndex = season_number - 1;
			if (episode_number > 1) {
				// Previous episode in the same season
				return `/protected/watch/${media_type}/${media_id}/${season_number}/${
					Number(episode_number) - 1
				}`;
			} else if (seasonIndex > 0) {
				// Last episode of the previous season
				const prevSeason = media.seasons[seasonIndex - 1];
				return `/protected/watch/${media_type}/${media_id}/${prevSeason.season_number}/${prevSeason.episode_count}`;
			}
		}
		return null;
	};

	const handleNextClick = () => {
		setNextClicked(true);
		setPrevClicked(false);
	};

	const handlePrevClick = () => {
		setPrevClicked(true);
		setNextClicked(false);
	};

	return (
		<div className="relative">
			<div className="my-2">
				<h2 className="text-xl font-bold flex flex-row gap-2">
					{media.title || media.name}
					{season_number !== undefined &&
						episode_number !== undefined && (
							<h2>
								{" - "}
								{formatEpisodeCode(
									season_number,
									episode_number
								)}
							</h2>
						)}
				</h2>
			</div>
			<div>
				{!showVideo ? (
					<div className="relative text-center rounded-xl overflow-hidden">
						<img
							src={`https://image.tmdb.org/t/p/original${media.backdrop_path}`}
							alt="Media Poster"
							className="w-full h-auto"
						/>
						<button
							onClick={handleButtonClick}
							className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-accent text-white text-lg font-semibold py-2 px-4 rounded hover:bg-accent/80 transition-colors duration-300"
						>
							Play Video
						</button>
					</div>
				) : (
					<div className="aspect-w-16 aspect-h-9">
						<iframe
							allowFullScreen
							id="iframe"
							loading="lazy"
							src={link}
							className="inline-block w-full h-full"
							frameBorder="0"
							marginHeight={0}
							marginWidth={0}
							scrolling="no"
						></iframe>
					</div>
				)}
			</div>

			<div className="flex md:flex-row flex-col justify-between mt-2 items-center">
				<div>
					{media_type === "tv" && getPreviousEpisodeLink() ? (
						<Link href={getPreviousEpisodeLink() || "#"}>
							<div
								className={`px-4 py-2 bg-foreground/10 rounded flex flex-row gap-2 items-center ${
									prevClicked ? "border-2 border-accent" : ""
								}`}
								onClick={handlePrevClick}
							>
								<img
									src="/assets/icons/caret-left-solid.svg"
									alt=""
									width={10}
									height={10}
									className="invert-on-dark"
								/>
								<p>Previous Episode</p>
							</div>
						</Link>
					) : (
						<div className="px-4 py-2 bg-foreground/10 rounded flex flex-row gap-2 items-center">
							No Previous Episode
						</div>
					)}
				</div>
				<div className="flex justify-center gap-4 my-4">
					<button
						onClick={() =>
							updateLinkStart("https://vidsrc.pro/embed/")
						}
						className="bg-foreground/10 hover:bg-foreground/20 text-foreground font-semibold py-2 px-4 rounded"
					>
						vidsrc.pro
					</button>
					<button
						onClick={() =>
							updateLinkStart("https://vidsrc.me/embed/")
						}
						className="bg-foreground/10 hover:bg-foreground/20 text-foreground font-semibold py-2 px-4 rounded"
					>
						vidsrc.me
					</button>
					<button
						onClick={() =>
							updateLinkStart("https://vidsrc.to/embed/")
						}
						className="bg-foreground/10 hover:bg-foreground/20 text-foreground font-semibold py-2 px-4 rounded"
					>
						vidsrc.to
					</button>
				</div>
				<div>
					{media_type === "tv" && getNextEpisodeLink() ? (
						<Link href={getNextEpisodeLink() || "#"}>
							<div
								className={`px-4 py-2 bg-foreground/10 rounded flex flex-row gap-2 items-center ${
									nextClicked ? "border-2 border-accent" : ""
								}`}
								onClick={handleNextClick}
							>
								<p>Next Episode</p>
								<img
									src="/assets/icons/caret-right-solid.svg"
									alt=""
									width={10}
									height={10}
									className="invert-on-dark"
								/>
							</div>
						</Link>
					) : (
						<div className="px-4 py-2 bg-foreground/10 rounded flex flex-row gap-2 items-center">
							No Next Episode
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default VideoEmbed;
