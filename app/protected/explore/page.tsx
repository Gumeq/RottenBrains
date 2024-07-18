import ExploreTab from "@/components/explore/ExploreTab";
import MediaCarousel from "@/components/MediaCarousel";
import { getPopular } from "@/utils/tmdb";
import React from "react";
import GenreSelector from "./GenreSelector";

const page = async () => {
	const movies = await getPopular();
	return (
		<div className="w-full relative">
			<div className="w-screen h-[50vh]">
				<MediaCarousel movies={movies.results}></MediaCarousel>
			</div>
			<div className=" mx-auto max-w-7xl px-4">
				<h1 className="text-xl pt-8 font-bold">Now in cinemas</h1>
				<div className="w-1/6 h-[5px] bg-accent rounded-full my-1"></div>
				<ExploreTab action="Now_in_cinemas"></ExploreTab>
				<h1 className="text-xl pt-8 font-bold">Popular Today</h1>
				<div className="w-1/6 h-[5px] bg-accent rounded-full my-1"></div>
				<ExploreTab action="Popular_Today"></ExploreTab>
				<h1 className="text-xl pt-8 font-bold">Trending TV-Shows</h1>
				<div className="w-1/6 h-[5px] bg-accent rounded-full my-1"></div>
				<ExploreTab action="Trending_TV"></ExploreTab>
				<h1 className="text-xl pt-8 font-bold">Trending Movies</h1>
				<div className="w-1/6 h-[5px] bg-accent rounded-full my-1"></div>
				<ExploreTab action="Trending_Movies"></ExploreTab>
				<h1 className="text-xl pt-8 font-bold">Airing Today</h1>
				<div className="w-1/6 h-[5px] bg-accent rounded-full my-1"></div>
				<ExploreTab action="Airing_Today"></ExploreTab>
			</div>
			<br />

			<div className="max-w-7xl w-screen flex flex-col items-center mx-auto">
				<h1 className="text-xl pt-8 font-bold">Explore More!</h1>
				<div className="w-1/6 h-[5px] bg-accent rounded-full my-1"></div>
				<GenreSelector></GenreSelector>
			</div>
		</div>
	);
};

export default page;
