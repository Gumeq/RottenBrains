import ExploreTab from "@/components/explore/ExploreTab";
import { getPopular } from "@/utils/tmdb";
import React from "react";
import { getAverageColor } from "fast-average-color-node";
import MediaCarouselNew from "@/components/MediaCarouselNew";
import { getCurrentUser } from "@/utils/supabase/serverQueries";
import Banner_90x728 from "@/components/ads/Banner_90x728";

const fetchMoviesWithColors = async (movies: any) => {
  const moviesWithColors = await Promise.all(
    movies.map(async (movie: any) => {
      const color = await getAverageColor(
        `https://image.tmdb.org/t/p/w200${movie.backdrop_path}`,
      );
      return { ...movie, averageColor: color.hex };
    }),
  );
  return moviesWithColors;
};

const page = async () => {
  const movies = await getPopular();
  const moviesWithColors = await fetchMoviesWithColors(movies.results);
  const user = await getCurrentUser();
  return (
    <div className="flex w-full flex-col items-center">
      <MediaCarouselNew movies={moviesWithColors}></MediaCarouselNew>
      {user && !user.user.premium && (
        <div className="mt-4 hidden w-full items-center justify-center lg:flex">
          <Banner_90x728></Banner_90x728>
        </div>
      )}
      <div
        className="z-10 mt-4 flex w-full flex-col gap-8 lg:px-4"
        id="explore"
      >
        <div className="flex flex-col gap-4">
          <ExploreTab
            action="Now_in_cinemas"
            containerId="cinemasNow"
          ></ExploreTab>
        </div>
        <div className="flex flex-col gap-4">
          <ExploreTab
            action="Popular_Today"
            containerId="popularToday"
          ></ExploreTab>
        </div>
        <div className="flex flex-col gap-4">
          <ExploreTab action="Trending_TV" containerId="trendngTV"></ExploreTab>
        </div>
        <div className="flex flex-col gap-4">
          <ExploreTab
            action="Trending_Movies"
            containerId="trendngmovies"
          ></ExploreTab>
        </div>
      </div>
      {/* <div className="mx-auto flex w-screen flex-col items-center lg:max-w-[90vw]">
        <h1 className="mt-16 text-4xl font-bold">Explore More!</h1>
        <GenreSelector></GenreSelector>
      </div> */}
    </div>
  );
};

export default page;
