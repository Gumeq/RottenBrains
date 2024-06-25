import ExploreTab from "@/components/ExploreTab";
import SearchBar from "@/components/SearchBar";
import Image from "next/image";
import React from "react";

const page = () => {
	return (
		<div className=" mx-auto max-w-7xl px-4 w-full h-full ">
			<h1 className="text-xl pt-8 font-bold">Now in cinemas</h1>
			<ExploreTab action="Now_in_cinemas"></ExploreTab>
			<h1 className="text-xl pt-8 font-bold">Trending TV-Shows</h1>
			<ExploreTab action="Trending_TV"></ExploreTab>
			<h1 className="text-xl pt-8 font-bold">Popular Today</h1>
			<ExploreTab action="Popular_Today"></ExploreTab>
			<h1 className="text-xl pt-8 font-bold">Airing Today</h1>
			<ExploreTab action="Airing_Today"></ExploreTab>
		</div>
	);
};

export default page;
