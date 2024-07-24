import { ExploreTabProps, IMedia } from "@/types";
import React, { useEffect, useState } from "react";
import ExploreCard from "@/components/explore/ExploreCard";
import { getExploreData } from "@/utils/clientFunctions";
import { fetchExploreData } from "@/utils/clientFunctions/fetchExploreData";

export async function ExploreTab({ action }: ExploreTabProps) {
	let exploreData;
	try {
		exploreData = await fetchExploreData(action);
	} catch (error) {
		console.error("Error fetching explore data:", error);
		exploreData = null;
	}
	return (
		<div className="flex flex-row overflow-x-auto lg:gap-4 gap-2 pb-2 custom-scrollbar">
			{exploreData &&
				exploreData.results.map((media: any) => (
					<div key={media.id} className="w-full">
						<ExploreCard media={media}></ExploreCard>
					</div>
				))}
		</div>
	);
}

export default ExploreTab;
