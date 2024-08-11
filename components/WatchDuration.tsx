"use client";

import { useEffect } from "react";

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
	useEffect(() => {
		let startTime = new Date();

		const sendWatchData = () => {
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

				// Reset startTime to now
				startTime = new Date();
			} else {
				console.log("Less than a minute has passed. No data sent.");
			}
		};

		const handleVisibilityChange = () => {
			if (document.visibilityState === "hidden") {
				sendWatchData();
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			document.removeEventListener(
				"visibilitychange",
				handleVisibilityChange
			);
		};
	}, [
		media_type,
		media_id,
		user_id,
		media_duration,
		season_number,
		episode_number,
	]);

	return null;
};

export default WatchDuration;
