"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import {
  getMovieRecommendationsForUser,
  getTvRecommendationsForUser,
} from "@/lib/recommendations";
import HomeMediaCardClient from "./HomeMediaCardClient";

const InfiniteScrollHome = ({ user_id }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const { ref, inView } = useInView();
  const targetRef = useRef<HTMLDivElement>(null);

  // Moved shuffleArray function outside of useEffect
  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Wrapped loadMore function with useCallback and optimized dependencies
  const loadMore = useCallback(async () => {
    if (inView && hasMore && !loading) {
      setLoading(true);
      try {
        const resultMovies = await getMovieRecommendationsForUser(
          user_id,
          page,
        );
        const resMovies = resultMovies.results.map((movie: any) => ({
          ...movie,
          media_type: "movie",
        }));

        const resultTv = await getTvRecommendationsForUser(user_id, page);
        const resTv = resultTv.results.map((tvShow: any) => ({
          ...tvShow,
          media_type: "tv",
        }));

        const combinedResults = [...resMovies, ...resTv];
        const shuffledResults = shuffleArray(combinedResults);

        if (shuffledResults.length === 0) {
          setHasMore(false);
        } else {
          setMediaItems((prevMediaItems) => [
            ...prevMediaItems,
            ...shuffledResults,
          ]);
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
      className="flex w-full flex-col justify-center gap-4 lg:p-2"
      ref={targetRef}
    >
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 lg:grid-cols-[repeat(auto-fit,minmax(350px,1fr))]">
        {mediaItems && mediaItems.length > 0 ? (
          mediaItems.map((mediaItem) => (
            <HomeMediaCardClient
              key={`${mediaItem.media_type}-${mediaItem.id}`}
              media_type={mediaItem.media_type}
              media_id={mediaItem.id}
              user_id={user_id}
            />
          ))
        ) : (
          <p>No recommendations available at the moment.</p>
        )}
      </div>
      {loading && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-4">
          {Array.from({ length: 20 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-4">
              <div className="aspect-[16/9] w-full bg-foreground/10"></div>
              {/* <div className="h-16 w-screen lg:w-full lg:min-w-[400px] lg:max-w-[550px]"></div> */}
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
