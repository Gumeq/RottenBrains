import React from "react";

interface YouTubeEmbedProps {
	videoId: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoId }) => {
	// Extract the video ID from the URL

	if (!videoId) {
		return <p>Invalid YouTube URL</p>;
	}

	return (
		<div className="youtube-container">
			<iframe
				width="200"
				height="112.5"
				src={`https://www.youtube.com/embed/${videoId}`}
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
				title="Embedded YouTube Video"
				className="aspect-[16/9]"
			></iframe>
		</div>
	);
};

export default YouTubeEmbed;
