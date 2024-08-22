import ExploreTab from "@/components/explore/ExploreTab";
import MediaCarousel from "@/components/MediaCarousel";
import { getPopular } from "@/utils/tmdb";
import React from "react";
import GenreSelector from "./GenreSelector";
import SearchBar from "@/components/searchBar/SearchBar";
import { getAverageColor } from "fast-average-color-node";
import ScrollButtons from "@/components/explore/ScrollButtons";
import MediaCarouselNew from "@/components/MediaCarouselNew";

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
  return (
    <div className="flex w-full flex-col items-center">
      <MediaCarouselNew movies={moviesWithColors}></MediaCarouselNew>
      <div
        className="z-10 mt-4 flex w-full flex-col gap-8 px-2 lg:px-4"
        id="explore"
      >
        <div className="my-4 flex w-full flex-col items-center justify-between md:mt-8 md:flex-row">
          <div>
            <h1 className="text-2xl font-bold">Explore</h1>
          </div>
          <div className="h-full w-screen p-2 md:w-[20vw] md:p-0">
            <SearchBar link={true} user={true}></SearchBar>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between">
            <div className="my-2 flex flex-row items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent"></div>
              <h1 className="text-xl font-bold">Now in cinemas</h1>
            </div>
          </div>

          <ExploreTab
            action="Now_in_cinemas"
            containerId="cinemasNow"
          ></ExploreTab>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between">
            <div className="my-2 flex flex-row items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent"></div>
              <h1 className="text-xl font-bold">Popular Today</h1>
            </div>
          </div>

          <ExploreTab
            action="Popular_Today"
            containerId="popularToday"
          ></ExploreTab>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between">
            <div className="my-2 flex flex-row items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent"></div>
              <h1 className="text-xl font-bold">Trending TV</h1>
            </div>
          </div>

          <ExploreTab action="Trending_TV" containerId="trendngTV"></ExploreTab>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between">
            <div className="my-2 flex flex-row items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent"></div>
              <h1 className="text-xl font-bold">Trending Movies</h1>
            </div>
          </div>

          <ExploreTab
            action="Trending_Movies"
            containerId="trendngmovies"
          ></ExploreTab>
        </div>
      </div>
      <div className="mx-auto flex w-screen flex-col items-center lg:max-w-[90vw]">
        <h1 className="mt-16 text-4xl font-bold">Explore More!</h1>
        <GenreSelector></GenreSelector>
      </div>
    </div>
  );
};

export default page;
