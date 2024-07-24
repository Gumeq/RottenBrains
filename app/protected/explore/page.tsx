import ExploreTab from "@/components/explore/ExploreTab";
import MediaCarousel from "@/components/MediaCarousel";
import { getPopular } from "@/utils/tmdb";
import React from "react";
import GenreSelector from "./GenreSelector";
import SearchBar from "@/components/searchBar/SearchBar";
import { getAverageColor } from "fast-average-color-node";

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
				<MediaCarousel movies={moviesWithColors}></MediaCarousel>
			</div>
			<div
				className="lg:max-w-[90vw] w-full flex flex-col gap-2 lg:-mt-[20vh] mt-4 z-10 lg:px-0 px-2"
				id="explore"
			>
				<div className="flex md:flex-row flex-col  justify-between md:mt-8 my-4 items-center w-full">
					<div>
						<h1 className="text-2xl font-bold">Explore</h1>
					</div>
					<div className=" h-full lg:w-[400px] w-screen lg:p-0 p-2">
						<SearchBar link={true} user={true}></SearchBar>
					</div>
				</div>
				<div>
					<div className="flex flex-row gap-2 items-center my-2">
						<div className="w-2 h-2 bg-accent rounded-full"></div>
						<h1 className="text-xl font-bold">Now in cinemas</h1>
					</div>
					<ExploreTab action="Now_in_cinemas"></ExploreTab>
				</div>
				<div>
					<div className="flex flex-row gap-2 items-center my-2">
						<div className="w-2 h-2 bg-accent rounded-full"></div>
						<h1 className="text-xl font-bold">Popular Today</h1>
					</div>
					<ExploreTab action="Popular_Today"></ExploreTab>
				</div>
				<div>
					<div className="flex flex-row gap-2 items-center my-2">
						<div className="w-2 h-2 bg-accent rounded-full"></div>
						<h1 className="text-xl font-bold">Trending TV</h1>
					</div>
					<ExploreTab action="Trending_TV"></ExploreTab>
				</div>
				<div>
					<div className="flex flex-row gap-2 items-center">
						<div className="w-2 h-2 bg-accent rounded-full"></div>
						<h1 className="text-xl font-bold my-2">
							Trending Movies
						</h1>
					</div>
					<ExploreTab action="Trending_Movies"></ExploreTab>
				</div>
				<div>
					<div className="flex flex-row gap-2 items-center">
						<div className="w-2 h-2 bg-accent rounded-full"></div>
						<h1 className="text-xl font-bold my-2">Airing Today</h1>
					</div>
					<ExploreTab action="Airing_Today"></ExploreTab>
				</div>
			</div>
			<div className="max-w-7xl w-screen flex flex-col items-center mx-auto">
				<h1 className="text-xl pt-8 font-bold">Explore More!</h1>
				<GenreSelector></GenreSelector>
			</div>
		</div>
	);
};

export default page;
