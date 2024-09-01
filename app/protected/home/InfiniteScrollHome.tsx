"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import movieGenres from "../../../constants/movie_genres.json";
import tvGenres from "../../../constants/tv_genres.json";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import Loader from "@/components/Loader";
import { getFromGenres } from "@/utils/tmdb";
import { motion } from "framer-motion";
import {
  getMovieRecommendationsForUser,
  getTvRecommendationsForUser,
} from "@/lib/recommendations";
import HomeMediaCard from "./HomeMediaCard";

const InfiniteScrollHome = ({ user_id }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [media, setMedia] = useState<any[]>([]);
  const [page, setPage] = useState<number>(2);
  const { ref, inView } = useInView();

  const targetRef = useRef<HTMLDivElement>(null);

  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  useEffect(() => {
    const loadMore = async () => {
      if (inView && hasMore && !loading) {
        setLoading(true);
        try {
          const result = await getMovieRecommendationsForUser(user_id, page);
          const res = result.results;
          if (res.length === 0) {
            setHasMore(false); // No more posts to load
          } else {
            setMedia((prevMedia: any) => [...prevMedia, ...res]);
            setPage((prevPage) => prevPage + 1);
          }
        } catch (error) {
          console.error("Error fetching posts:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadMore();
  }, [inView, hasMore, loading, page]);

  return (
    <div
      className="flex w-full flex-col justify-center gap-4 p-2"
      ref={targetRef}
    >
      <div className="mx-auto grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {media && media.length > 0 ? (
          media.map((media: any) => (
            <Suspense fallback={<Loader></Loader>}>
              <HomeMediaCard
                media_type={"movie"}
                media_id={media.id}
                user_id={user_id}
              ></HomeMediaCard>
            </Suspense>
          ))
        ) : (
          <p>Error</p>
        )}
      </div>
      {loading && <Loader></Loader>}
      {!loading && hasMore && <div ref={ref}></div>}
    </div>
  );
};

export default InfiniteScrollHome;
