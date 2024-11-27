"use client";

import { useEffect, useRef, useCallback } from "react";

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
  const startTimeRef = useRef(Date.now());
  const accumulatedTimeRef = useRef(0);

  const sendWatchData = useCallback(() => {
    const currentTime = Date.now();
    const sessionTime = Math.floor((currentTime - startTimeRef.current) / 1000);
    accumulatedTimeRef.current += sessionTime;

    if (accumulatedTimeRef.current >= 60) {
      const totalMediaSeconds = media_duration * 60;
      const percentageWatched = Math.min(
        (accumulatedTimeRef.current / totalMediaSeconds) * 100,
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
          time_spent: accumulatedTimeRef.current,
          percentage_watched: percentageWatched.toFixed(2),
        }),
      );

      accumulatedTimeRef.current = 0;
    }

    startTimeRef.current = currentTime;
  }, [
    user_id,
    media_type,
    media_id,
    season_number,
    episode_number,
    media_duration,
  ]);

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === "hidden") {
      sendWatchData();
    } else {
      startTimeRef.current = Date.now();
    }
  }, [sendWatchData]);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", sendWatchData);

    const intervalId = setInterval(sendWatchData, 5 * 60 * 1000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", sendWatchData);
      clearInterval(intervalId);
      sendWatchData();
    };
  }, [handleVisibilityChange, sendWatchData]);

  useEffect(() => {
    startTimeRef.current = Date.now();
    accumulatedTimeRef.current = 0;
  }, [media_type, media_id, season_number, episode_number, media_duration]);

  return null;
};

export default WatchDuration;
