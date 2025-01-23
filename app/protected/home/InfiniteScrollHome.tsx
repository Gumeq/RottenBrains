"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import {
  getMovieRecommendationsForUser,
  getTvRecommendationsForUser,
} from "@/lib/recommendations";
import HomeMediaCardClient from "./HomeMediaCardClient";
import { getBatchWatchedItemsForUser } from "@/utils/supabase/queries"; // A new bulk query function

const InfiniteScrollHome = ({ user_id }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const { ref, inView } = useInView({ threshold: 0.1, rootMargin: "200px" });
  const targetRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (inView && hasMore && !loading) {
      setLoading(true);
      try {
        // Fetch recommendations in parallel
        const [resultMovies, resultTv] = await Promise.all([
          getMovieRecommendationsForUser(user_id, page),
          getTvRecommendationsForUser(user_id, page),
        ]);
        const resMovies = resultMovies.results.map((movie: any) => ({
          ...movie,
          media_type: "movie",
        }));
        const resTv = resultTv.results.map((tvShow: any) => ({
          ...tvShow,
          media_type: "tv",
        }));

        const combinedResults = [...resMovies, ...resTv];

        // Get watched items for the current batch
        const watchedItems = await getBatchWatchedItemsForUser(
          user_id,
          combinedResults,
        );
        const watchedSet = new Set(
          watchedItems.map(
            (item: any) => `${item.media_type}-${item.media_id}`,
          ),
        );

        // Filter out watched items
        const unwatchedItems = combinedResults.filter(
          (item) => !watchedSet.has(`${item.media_type}-${item.id}`),
        );

        if (unwatchedItems.length === 0) {
          setHasMore(false);
        } else {
          setMediaItems((prev) => [...prev, ...unwatchedItems]);
          setPage((prevPage) => prevPage + 1);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [inView, hasMore, loading, page, user_id]);

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  return (
    <div
      className="flex w-full flex-col justify-center gap-4 p-4 lg:p-0"
      ref={targetRef}
    >
      <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
        {mediaItems && mediaItems.length > 0 ? (
          mediaItems.map((mediaItem) => (
            <HomeMediaCardClient
              key={`${mediaItem.media_type}-${mediaItem.id}`}
              media_type={mediaItem.media_type}
              media_id={mediaItem.id}
              user_id={user_id}
              rounded={true}
            />
          ))
        ) : (
          <p>No recommendations available at the moment.</p>
        )}
      </div>
      {loading && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-8">
          {Array.from({ length: 20 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-4">
              <div className="aspect-[16/9] w-full bg-foreground/10"></div>
              <div className="h-6 w-2/3 bg-foreground/10"></div>
              <div className="h-6 w-1/3 bg-foreground/10"></div>
            </div>
          ))}
        </div>
      )}
      {!loading && hasMore && <div ref={ref}></div>}
    </div>
  );
};

export default InfiniteScrollHome;
