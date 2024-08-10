"use client";

import { useEffect, useState } from "react";

interface WatchDurationProps {
	media_type: string;
	media_id: number;
	season_number?: number;
	episode_number?: number;
	user_id: string;
	media_duration: number; // Duration of the media in minutes
}

const WatchDuration: React.FC<WatchDurationProps> = ({
	media_type,
	media_id,
	season_number,
	episode_number,
	user_id,
	media_duration,
}) => {
	const [watchTime, setWatchTime] = useState<number>(0);

	useEffect(() => {
		const startTime = new Date();

		const handleBeforeUnload = () => {
			const endTime = new Date();
			const timeSpent = Math.floor(
				(endTime.getTime() - startTime.getTime()) / 1000
			);

			// Only proceed if at least a minute has passed
			if (timeSpent >= 60) {
				// Calculate the percentage watched based on media duration
				const totalMediaSeconds = media_duration * 60; // Convert media duration from minutes to seconds
				const percentageWatched = Math.min(
					(timeSpent / totalMediaSeconds) * 100,
					100
				);

				console.log("Sending watch time data:", {
					user_id,
					media_type,
					media_id,
					time_spent: timeSpent,
					percentage_watched: percentageWatched.toFixed(2),
				});

				// Send the data to the server
				navigator.sendBeacon(
					"/api/saveWatchTime",
					JSON.stringify({
						user_id,
						media_type,
						media_id,
						season_number,
						episode_number,
						time_spent: timeSpent,
						percentage_watched: percentageWatched.toFixed(2),
					})
				);
			} else {
				console.log("Less than a minute has passed. No data sent.");
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [media_type, media_id, user_id, media_duration]);

	return null;
};

export default WatchDuration;
