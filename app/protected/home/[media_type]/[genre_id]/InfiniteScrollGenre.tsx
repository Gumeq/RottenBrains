"use client";

import { getFromGenres } from "@/utils/tmdb";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import HomeMediaCardClient from "../../HomeMediaCardClient";
import { useUser } from "@/context/UserContext";

interface InfiniteScrollByGenreProps {
  genre_id: number;
  media_type: "movie" | "tv";
}

const InfiniteScrollByGenre: React.FC<InfiniteScrollByGenreProps> = ({
  genre_id,
  media_type,
}) => {
  const { user } = useUser();

  // If no user, render a fallback message
  if (!user) {
    return <p>You need to be logged in to view this content.</p>;
  }

  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const { ref, inView } = useInView();
  const targetRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (inView && hasMore && !loading) {
      setLoading(true);
      try {
        const result = await getFromGenres(
          media_type,
          page,
          genre_id.toString(),
        );
        const resultsWithMediaType = result.results.map((item: any) => ({
          ...item,
          media_type,
        }));

        if (resultsWithMediaType.length === 0) {
          setHasMore(false);
        } else {
          setMediaItems((prevMediaItems) => [
            ...prevMediaItems,
            ...resultsWithMediaType,
          ]);
          setPage((prevPage) => prevPage + 1);
        }
      } catch (error) {
        console.error("Error fetching media:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [inView, hasMore, loading, media_type, page, genre_id]);

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
              user_id={user.id.toString()}
              key={`${mediaItem.media_type}-${mediaItem.id}`}
              media_type={mediaItem.media_type}
              media_id={mediaItem.id}
            />
          ))
        ) : (
          <p>No media available for this genre at the moment.</p>
        )}
      </div>
      {loading && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-4">
          {Array.from({ length: 20 }).map((_, index) => (
            <div key={index} className="flex flex-col">
              <div className="mb-4 aspect-[16/9] w-full bg-foreground/20"></div>
              <div className="h-14 w-screen lg:w-full lg:min-w-[400px] lg:max-w-[550px]"></div>
            </div>
          ))}
        </div>
      )}
      {!loading && hasMore && <div ref={ref}></div>}
    </div>
  );
};

export default InfiniteScrollByGenre;
