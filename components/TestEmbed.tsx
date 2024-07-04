// components/VideoEmbed.js
import React from "react";

const VideoEmbed = () => {
	return (
		<iframe
			allowFullScreen
			id="iframe"
			loading="lazy"
			src="https://vidsrc.pro/embed/tv/37680/1/1"
			style={{ display: "inline", width: "100%", height: "500px" }}
		></iframe>
	);
};

export default VideoEmbed;
