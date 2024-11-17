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
import HomeMediaCardClient from "./HomeMediaCardClient";

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
          const resultMovies = await getMovieRecommendationsForUser(
            user_id,
            page,
          );
          const resMovies = resultMovies.results.map((movie: any) => ({
            ...movie,
            media_type: "movie", // Add a media_type property to indicate it's a movie
          }));

          const resultTv = await getTvRecommendationsForUser(user_id, page);
          const resTv = resultTv.results.map((tvShow: any) => ({
            ...tvShow,
            media_type: "tv", // Add a media_type property to indicate it's a tv show
          }));

          // Combine the two arrays into one
          const combinedResults = [...resMovies, ...resTv];

          // Fisher-Yates shuffle to shuffle the combined array
          const shuffleArray = (array: any) => {
            for (let i = array.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
          };

          const shuffledResults = shuffleArray(combinedResults);
          if (shuffledResults.length === 0) {
            setHasMore(false); // No more posts to load
          } else {
            setMedia((prevMedia: any) => [...prevMedia, ...shuffledResults]);
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
      className="flex w-full flex-col justify-center gap-4 lg:p-2"
      ref={targetRef}
    >
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        }}
      >
        {media && media.length > 0 ? (
          media.map((media: any) => (
            <HomeMediaCardClient
              media_type={media.media_type}
              media_id={media.id}
              user_id={user_id}
            ></HomeMediaCardClient>
          ))
        ) : (
          <p>Error</p>
        )}
      </div>
      {loading && (
        <>
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            }}
          >
            {Array.from({ length: 20 }).map((_, index) => (
              <div key={index} className="flex flex-col">
                <div className="mb-4 flex aspect-[16/9] w-full flex-col rounded-[8px] bg-foreground/20 lg:w-auto lg:min-w-[350px] lg:max-w-[450px]"></div>
                <div className="h-14 w-screen lg:w-full lg:min-w-[400px] lg:max-w-[550px]"></div>
              </div>
            ))}
          </div>
        </>
      )}
      {!loading && hasMore && <div ref={ref}></div>}
    </div>
  );
};

export default InfiniteScrollHome;
