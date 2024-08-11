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
				`https://image.tmdb.org/t/p/w200${movie.backdrop_path}`
			);
			return { ...movie, averageColor: color.hex };
		})
	);
	return moviesWithColors;
};

const page = async () => {
	const movies = await getPopular();
	const moviesWithColors = await fetchMoviesWithColors(movies.results);
	return (
		<div className="w-full flex flex-col items-center">
			<div className="">
				<MediaCarouselNew movies={moviesWithColors}></MediaCarouselNew>
			</div>
			<div
				className="md:max-w-[90vw] w-full flex flex-col gap-8  mt-4 z-10 md:px-0 px-2"
				id="explore"
			>
				<div className="flex md:flex-row flex-col  justify-between md:mt-8 my-4 items-center w-full">
					<div>
						<h1 className="text-2xl font-bold">Explore</h1>
					</div>
					<div className=" h-full md:w-[20vw] w-screen md:p-0 p-2">
						<SearchBar link={true} user={true}></SearchBar>
					</div>
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex flex-row justify-between items-center">
						<div className="flex flex-row gap-2 items-center my-2">
							<div className="w-2 h-2 bg-accent rounded-full"></div>
							<h1 className="text-xl font-bold">
								Now in cinemas
							</h1>
						</div>
					</div>

					<ExploreTab
						action="Now_in_cinemas"
						containerId="cinemasNow"
					></ExploreTab>
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex flex-row justify-between items-center">
						<div className="flex flex-row gap-2 items-center my-2">
							<div className="w-2 h-2 bg-accent rounded-full"></div>
							<h1 className="text-xl font-bold">Popular Today</h1>
						</div>
					</div>

					<ExploreTab
						action="Popular_Today"
						containerId="popularToday"
					></ExploreTab>
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex flex-row justify-between items-center">
						<div className="flex flex-row gap-2 items-center my-2">
							<div className="w-2 h-2 bg-accent rounded-full"></div>
							<h1 className="text-xl font-bold">Trending TV</h1>
						</div>
					</div>

					<ExploreTab
						action="Trending_TV"
						containerId="trendngTV"
					></ExploreTab>
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex flex-row justify-between items-center">
						<div className="flex flex-row gap-2 items-center my-2">
							<div className="w-2 h-2 bg-accent rounded-full"></div>
							<h1 className="text-xl font-bold">
								Trending Movies
							</h1>
						</div>
					</div>

					<ExploreTab
						action="Trending_Movies"
						containerId="trendngmovies"
					></ExploreTab>
				</div>
			</div>
			<div className="w-screen lg:max-w-[90vw] flex flex-col items-center mx-auto">
				<h1 className="text-4xl mt-16 font-bold">Explore More!</h1>
				<GenreSelector></GenreSelector>
			</div>
		</div>
	);
};

export default page;
