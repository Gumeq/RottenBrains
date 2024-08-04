"use client";

// components/VideoEmbed.js
import { getEpisodeDetails, getMediaDetails } from "@/utils/tmdb";
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
		"https://vidsrc.net/embed/"
	);
	const [media, setMedia] = useState<any>();
	const [episode, setEpisode] = useState<any>();
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

	useEffect(() => {
		const fetchEpisodeDetails = async () => {
			if (season_number && episode_number) {
				try {
					const episodeData = await getEpisodeDetails(
						media_id,
						season_number,
						episode_number
					);
					setEpisode(episodeData);
				} catch (error) {
					console.error("Error fetching episode data:", error);
					setEpisode(null);
				}
			}
		};

		if (media_type === "tv") {
			fetchEpisodeDetails();
		}
	}, [media_type, media_id, season_number, episode_number]);

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
		<div className="relative flex flex-col gap-2">
			<div>
				{!showVideo ? (
					<div className="relative text-center lg:rounded-[8px] overflow-hidden">
						<img
							src={
								media_type === "movie"
									? `https://image.tmdb.org/t/p/w780${media.backdrop_path}`
									: episode &&
									  `https://image.tmdb.org/t/p/w780${episode.still_path}`
							}
							alt="Media Poster"
							className="w-full h-auto drop-shadow-lg bg-foreground/10"
						/>
						<button
							onClick={handleButtonClick}
							className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/60 text-white text-lg font-semibold rounded-full hover:bg-accent/80 transition-colors duration-300 flex items-center justify-center w-40 h-40"
						>
							<img
								src="/assets/icons/play-solid.svg"
								alt=""
								width={20}
								height={20}
								className="invert min-w-[40px] min-h-[40px]"
							/>
						</button>
					</div>
				) : (
					<div className="aspect-w-16 aspect-h-9 lg:rounded-[8px] overflow-hidden drop-shadow-lg z-50 relative">
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

						{/* <iframe
							src="https://ww1.9anime2.com/embed/MTIzMTM3"
							allowFullScreen
							id="iframe"
							loading="lazy"
							className="inline-block w-full h-full"
							frameBorder="0"
							marginHeight={0}
							marginWidth={0}
							scrolling="no"
						></iframe> */}
					</div>
				)}
			</div>
			<div className="flex flex-row justify-between p-2">
				<span className="text-xl lg:font-bold flex flex-row flex-wrap gap-2 items-center">
					{season_number !== undefined &&
						episode_number !== undefined &&
						episode && (
							<h2 className="">
								{episode.name}
								{" | "}
								{formatEpisodeCode(
									season_number,
									episode_number
								)}
								{" | "}
							</h2>
						)}
					<p className="truncate pr-1">{media.title || media.name}</p>
				</span>
			</div>
			<div className="flex lg:flex-row flex-col items-center  justify-between">
				<div className="flex flex-row gap-2">
					{media_type === "tv" && (
						<div>
							{getPreviousEpisodeLink() ? (
								<Link href={getPreviousEpisodeLink() || "#"}>
									<div
										className={`flex flex-row items-center gap-2 bg-foreground/10 px-6 py-2 rounded-[8px] z-10 hover:scale-105 drop-shadow-lg ${
											prevClicked
												? "border-2 border-accent"
												: ""
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
										<p>Previous</p>
									</div>
								</Link>
							) : (
								<div className="flex flex-row items-center gap-2 bg-foreground/10 px-6 py-2 rounded-[8px] z-10 hover:scale-105 drop-shadow-lg">
									No Previous
								</div>
							)}
						</div>
					)}
					{media_type === "tv" && (
						<div>
							{getNextEpisodeLink() ? (
								<Link href={getNextEpisodeLink() || "#"}>
									<div
										className={`flex flex-row items-center gap-2 bg-foreground/10 px-6 py-2 rounded-[8px] z-10 hover:scale-105 drop-shadow-lg ${
											nextClicked
												? "border-2 border-accent"
												: ""
										}`}
										onClick={handleNextClick}
									>
										<p>Next</p>
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
								<div className="flex flex-row items-center gap-2 bg-foreground/10 px-6 py-2 rounded-[8px] z-10 hover:scale-105 drop-shadow-lg">
									No Next
								</div>
							)}
						</div>
					)}
					<Link
						href={`/protected/create-post/${media_type}/${media_id}`}
						className=" flex flex-row items-center gap-2 bg-foreground/10 px-6 py-2 rounded-[8px] z-10 hover:scale-105 drop-shadow-lg justify-self-end"
					>
						<img
							src="/assets/icons/star-outline.svg"
							alt=""
							width={20}
							height={20}
							className="invert-on-dark"
							loading="lazy"
						/>
						<p className="">Rate</p>
					</Link>
				</div>

				<div className="flex justify-center gap-2 ">
					<button
						onClick={() =>
							updateLinkStart("https://vidsrc.net/embed/")
						}
						className="flex flex-row items-center gap-2 bg-foreground/10 px-6 py-2 rounded-[8px] z-10 hover:scale-105 drop-shadow-lg"
					>
						vidsrc.net
					</button>
					<button
						onClick={() =>
							updateLinkStart("https://vidsrc.pro/embed/")
						}
						className="flex flex-row items-center gap-2 bg-foreground/10 px-6 py-2 rounded-[8px] z-10 hover:scale-105 drop-shadow-lg"
					>
						vidsrc.pro
					</button>
				</div>
			</div>
		</div>
	);
};

export default VideoEmbed;
