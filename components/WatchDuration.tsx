"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  useEffect(() => {
    let startTime = Date.now();
    let accumulatedTime = 0;

    const sendWatchData = () => {
      const currentTime = Date.now();
      const sessionTime = Math.floor((currentTime - startTime) / 1000);
      accumulatedTime += sessionTime;

      // Only proceed if at least a minute has passed in total
      if (accumulatedTime >= 60) {
        const totalMediaSeconds = media_duration * 60;
        const percentageWatched = Math.min(
          (accumulatedTime / totalMediaSeconds) * 100,
          100,
        );

        navigator.sendBeacon(
          "/api/saveWatchTime",
          JSON.stringify({
            user_id,
            media_type,
            media_id,
            season_number,
            episode_number,
            time_spent: accumulatedTime,
            percentage_watched: percentageWatched.toFixed(2),
          }),
        );

        // Reset accumulated time after sending
        accumulatedTime = 0;
      }

      // Reset start time for the next session
      startTime = currentTime;
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sendWatchData();
      } else {
        startTime = Date.now(); // Reset start time when becoming visible
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", sendWatchData);

    // Periodic update every 5 minutes
    const intervalId = setInterval(sendWatchData, 5 * 60 * 1000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", sendWatchData);
      clearInterval(intervalId);
      sendWatchData(); // Final update on unmount
    };
  }, [
    media_type,
    media_id,
    user_id,
    media_duration,
    season_number,
    episode_number,
    pathname,
  ]);

  return null;
};

export default WatchDuration;
