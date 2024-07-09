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
	const [linkStart, setLinkStart] = useState<string>(
		"https://vidsrc.pro/embed/"
	);
	const [media, setMedia] = useState<any>();
	const [showVideo, setShowVideo] = useState(false);

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
			<div className="flex justify-center gap-4 my-4">
				<button
					onClick={() => updateLinkStart("https://vidsrc.pro/embed/")}
					className="bg-foreground/10 hover:bg-foreground/20 text-foreground font-semibold py-2 px-4 rounded"
				>
					vidsrc.pro
				</button>
				<button
					onClick={() => updateLinkStart("https://vidsrc.me/embed/")}
					className="bg-foreground/10 hover:bg-foreground/20 text-foreground font-semibold py-2 px-4 rounded"
				>
					vidsrc.me
				</button>
				<button
					onClick={() => updateLinkStart("https://vidsrc.to/embed/")}
					className="bg-foreground/10 hover:bg-foreground/20 text-foreground font-semibold py-2 px-4 rounded"
				>
					vidsrc.to
				</button>
			</div>
		</div>
	);
};

export default VideoEmbed;
