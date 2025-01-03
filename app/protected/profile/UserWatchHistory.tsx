"use client";

import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Loader from "@/components/Loader";
import { getWatchHistoryForUser } from "@/utils/supabase/queries";
import HomeMediaCardClient from "../home/HomeMediaCardClient";

interface UserWatchHistoryProps {
  userId: string;
  currentUserId: string;
  initialPage?: number; // Optional initial page number
  pageSize?: number; // Optional number of items per page
  onHistoryLoaded?: (historyItems: any[]) => void; // Callback when history items are loaded
}

const UserWatchHistory: React.FC<UserWatchHistoryProps> = ({
  userId,
  currentUserId,
  initialPage = 0, // Default to page 0
  pageSize = 20, // Default to 20 items per page
  onHistoryLoaded,
}) => {
  const [watchHistory, setWatchHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
  const [hasMoreHistory, setHasMoreHistory] = useState<boolean>(true);
  const [historyPage, setHistoryPage] = useState<number>(initialPage);
  const { ref: refHistory, inView: inViewHistory } = useInView();

  useEffect(() => {
    const loadMoreHistory = async () => {
      if (inViewHistory && hasMoreHistory && !loadingHistory) {
        setLoadingHistory(true);
        try {
          const offset = historyPage * pageSize;
          const res = await getWatchHistoryForUser(userId, pageSize, offset);
          if (res.length === 0) {
            setHasMoreHistory(false);
          } else {
            setWatchHistory((prevData) => [...prevData, ...res]);
            setHistoryPage((prevPage) => prevPage + 1);
            if (onHistoryLoaded) {
              onHistoryLoaded(res);
            }
          }
        } catch (error) {
          console.error("Error fetching watch history:", error);
        } finally {
          setLoadingHistory(false);
        }
      }
    };

    loadMoreHistory();
  }, [
    inViewHistory,
    hasMoreHistory,
    loadingHistory,
    userId,
    historyPage,
    pageSize,
    onHistoryLoaded,
  ]);

  return (
    <div
      className="grid w-full gap-8 p-4 lg:gap-4 lg:p-0"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))" }}
    >
      {watchHistory.map((item) => (
        <div key={`${item.media_type}-${item.media_id}`} className="w-full">
          <HomeMediaCardClient
            media_type={item.media_type}
            media_id={item.media_id}
            season_number={item.season_number}
            episode_number={item.episode_number}
            user_id={currentUserId}
            rounded={true}
          />
        </div>
      ))}
      {loadingHistory && <Loader />}
      {!loadingHistory && hasMoreHistory && (
        <div ref={refHistory} className="h-[100px] w-[100px]"></div>
      )}
      {!hasMoreHistory && (
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

export default UserWatchHistory;
