import ExploreTab from "@/components/ExploreTab";
import React from "react";

const page = () => {
	return (
		<div className=" mx-auto max-w-7xl px-4">
			<div>
				<h1 className="font-bold text-2xl pt-8">
					New Movies and TV-Shows
				</h1>
			</div>
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
