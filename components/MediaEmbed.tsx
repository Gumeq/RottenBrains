"use client";

// components/VideoEmbed.js
import { getMediaDetails } from "@/utils/tmdb";
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
	let link = "";
	if (media_type === "movie") {
		link = `https://vidsrc.pro/embed/${media_type}/${media_id}`;
	} else {
		link = `https://vidsrc.pro/embed/${media_type}/${media_id}/${season_number}/${episode_number}`;
	}

	const [media, setMedia] = useState<any>();
	const [showVideo, setShowVideo] = useState(false);

	useEffect(() => {
		let mediaData;

		const fetchMediaDetails = async () => {
			try {
				mediaData = await getMediaDetails(media_type, media_id);
				console.log(mediaData);
			} catch (error) {
				console.error("Error fetching media data:", error);
				mediaData = null;
			}
			setMedia(mediaData);
		};

		fetchMediaDetails();
	}, []);
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

	console.log(media);

	return (
		<div>
			{!showVideo ? (
				<div className="relative text-center rounded-xl overflow-hidden">
					{media_type === "tv" && (
						<h3 className="text-lg absolute p-4">
							{formatEpisodeCode(
								season_number || 0,
								episode_number || 0
							)}{" "}
						</h3>
					)}

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
				<iframe
					allowFullScreen
					id="iframe"
					loading="lazy"
					src={link}
					style={{ display: "block", width: "100%", height: "100%" }}
				></iframe>
			)}
		</div>
	);
};

export default VideoEmbed;
