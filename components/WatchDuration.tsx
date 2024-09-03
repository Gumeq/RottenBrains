"use client";

import { useState, useEffect, useRef } from "react";
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
  const [totalTime, setTotalTime] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTracking = () => {
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      setTotalTime((prevTime) => prevTime + 1);
    }, 1000);
  };

  const stopTracking = () => {
    if (startTimeRef.current && intervalRef.current) {
      const endTime = Date.now();
      const sessionTime = Math.floor((endTime - startTimeRef.current) / 1000);
      setTotalTime((prevTime) => prevTime + sessionTime);
      clearInterval(intervalRef.current);
      startTimeRef.current = null;
    }
  };

  const sendWatchData = () => {
    if (totalTime >= 60) {
      // Only send if at least a minute has passed
      const percentageWatched = Math.min(
        (totalTime / (media_duration * 60)) * 100,
        100,
      );

      console.log("Sending watch time data:", {
        user_id,
        media_type,
        media_id,
        time_spent: totalTime,
        percentage_watched: percentageWatched.toFixed(2),
      });

      navigator.sendBeacon(
        "/api/saveWatchTime",
        JSON.stringify({
          user_id,
          media_type,
          media_id,
          season_number,
          episode_number,
          time_spent: totalTime,
          percentage_watched: percentageWatched.toFixed(2),
        }),
      );

      setTotalTime(0); // Reset total time after sending
    } else {
      console.log("Less than a minute has passed. No data sent.");
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTracking();
        sendWatchData();
      } else {
        startTracking();
      }
    };

    const handleFocus = () => {
      if (!startTimeRef.current) {
        startTracking();
      }
    };

    const handleBlur = () => {
      stopTracking();
      sendWatchData();
    };

    const handleBeforeUnload = () => {
      stopTracking();
      sendWatchData();
    };

    // Start tracking when component mounts
    startTracking();

    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean up function
    return () => {
      stopTracking();
      sendWatchData();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [pathname]); // Re-run effect when the path changes

  return null;
};

export default WatchDuration;
