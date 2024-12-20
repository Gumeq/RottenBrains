"use client";

import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { getWatchHistoryForUser } from "@/utils/supabase/queries";
import { useUser } from "@/context/UserContext";
import { format, isToday, isYesterday } from "date-fns";
import HomeMediaCard from "../home/HomeMediaCard";

const WatchHistoryWithInfiniteScroll = () => {
  const [watchHistory, setWatchHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 20;
  const { user } = useUser();

  const { ref, inView } = useInView(); // For detecting when the last element is visible

  // Function to fetch watch history
  const fetchWatchHistory = async () => {
    if (!user || loading || !hasMore) return;

    setLoading(true);
    try {
      const offset = page * limit;
      const newWatchHistory = await getWatchHistoryForUser(
        user.id.toString(),
        limit,
        offset,
      );

      if (newWatchHistory.length < limit) {
        setHasMore(false);
      }

      setWatchHistory((prev) => [...prev, ...newWatchHistory]);
    } catch (error) {
      console.error("Error fetching watch history:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Call `fetchWatchHistory` whenever `page` changes
  useEffect(() => {
    fetchWatchHistory();
  }, [page]);

  // Trigger loading more data when the last element is visible
  useEffect(() => {
    if (inView && !loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, loading, hasMore]);

  if (!user) {
    return (
      <div className="flex w-full justify-center py-4">
        <span>Loading...</span>
      </div>
    );
  }

  // Group watch history by date
  const groupedByDate: Record<string, any[]> = watchHistory.reduce(
    (acc: Record<string, any[]>, item) => {
      const watchedDate = new Date(item.created_at);
      const dateKey = format(watchedDate, "yyyy-MM-dd");
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(item);
      return acc;
    },
    {},
  );

  // Sort the dates in descending order
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  // Helper function to generate labels for dates
  const getDateLabel = (dateString: string): string => {
    const d = new Date(dateString);
    const formattedDate = format(d, "dd MMM yyyy");
    if (isToday(d)) return `Today - ${formattedDate}`;
    if (isYesterday(d)) return `Yesterday - ${formattedDate}`;
    return formattedDate;
  };

  return (
    <div className="my-4 mb-12 w-full px-4 lg:px-0">
      <h1 className="px-4 text-lg font-semibold">History</h1>
      <div className="my-4 w-full border-b-2 border-foreground/5"></div>

      {sortedDates.map((dateKey) => {
        const items = groupedByDate[dateKey];
        return (
          <div key={dateKey} className="flex flex-col">
            <div className="flex flex-row items-center gap-4 py-2">
              <div className="h-1 w-1 rounded-full bg-accent"></div>
              <h2 className="text-lg font-semibold">{getDateLabel(dateKey)}</h2>
            </div>
            <div className="flex flex-row flex-wrap gap-4 border-l-2 border-foreground/20 pb-4 pl-4">
              {items.map((media) => {
                media.season_number =
                  media.season_number === -1 ? null : media.season_number;
                media.episode_number =
                  media.episode_number === -1 ? null : media.episode_number;

                return (
                  <HomeMediaCard
                    key={media.id}
                    user_id={user.id.toString()}
                    media_type={media.media_type}
                    media_id={media.id}
                    season_number={media.season_number}
                    episode_number={media.episode_number}
                    rounded={true}
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Sentinel Element for Infinite Scroll */}
      {hasMore && <div ref={ref} className="h-10"></div>}

      {!hasMore && (
        <div className="flex w-full flex-col items-center justify-center gap-4 rounded-[8px] bg-foreground/10 p-4">
          <img
            src="/assets/images/logo_new_black.svg"
            alt="No more history"
            className="invert-on-dark h-8 w-8 opacity-50"
          />
          <p className="text-foreground/50">No more watch history</p>
        </div>
      )}
    </div>
  );
};

export default WatchHistoryWithInfiniteScroll;
