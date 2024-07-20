import ExploreTab from "@/components/explore/ExploreTab";
import MediaCarousel from "@/components/MediaCarousel";
import { getPopular } from "@/utils/tmdb";
import React from "react";
import GenreSelector from "./GenreSelector";
import SearchBar from "@/components/searchBar/SearchBar";

const page = async () => {
	const movies = await getPopular();
	return (
		<div className="w-full relative">
			<div className="flex md:flex-row flex-col  justify-between md:mt-8 items-center md:hidden">
				<div className=" h-full md:w-[400px] w-screen p-2">
					<SearchBar link={true} user={true}></SearchBar>
				</div>
			</div>
			<div className="w-screen h-[50vh]">
				<MediaCarousel movies={movies.results}></MediaCarousel>
			</div>
			<div className=" mx-auto max-w-7xl pl-2 flex flex-col gap-2">
				<div className="md:flex md:flex-row flex-col  justify-between md:mt-8 mt-2 items-center pr-2 hidden">
					<div>
						<h1 className="text-2xl font-bold">Explore</h1>
						<div className="w-full h-[5px] bg-accent rounded-full my-1"></div>
					</div>
					<div className=" h-full md:w-[400px] w-screen p-2">
						<SearchBar link={true} user={true}></SearchBar>
					</div>
				</div>
				<div>
					<h1 className="text-xl font-bold py-2">Now in cinemas</h1>
					<ExploreTab action="Now_in_cinemas"></ExploreTab>
				</div>
				<div>
					<h1 className="text-xl font-bold py-2">Popular Today</h1>
					<ExploreTab action="Popular_Today"></ExploreTab>
				</div>
				<div>
					<h1 className="text-xl font-bold py-2">
						Trending TV-Shows
					</h1>
					<ExploreTab action="Trending_TV"></ExploreTab>
				</div>
				<div>
					<h1 className="text-xl font-bold py-2">Trending Movies</h1>
					<ExploreTab action="Trending_Movies"></ExploreTab>
				</div>
				<div>
					<h1 className="text-xl font-bold py-2">Airing Today</h1>
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
