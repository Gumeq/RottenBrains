import { ExploreTabProps } from "@/types";
import React from "react";
import ExploreCard from "@/components/explore/ExploreCard";
import { fetchExploreData } from "@/utils/clientFunctions/fetchExploreData";

export async function ExploreTab({
	action,
	containerId,
}: ExploreTabProps & { containerId: string }) {
	let exploreData;
	try {
		exploreData = await fetchExploreData(action);
	} catch (error) {
		console.error("Error fetching explore data:", error);
		exploreData = null;
	}

	return (
		<div className="relative">
			<div
				id={containerId}
				className="flex flex-row overflow-x-auto lg:gap-4 gap-2 pb-2 hidden-scrollbar"
			>
				{exploreData &&
					exploreData.results.map((media: any) => (
						<div key={media.id} className="w-full">
							<ExploreCard media={media} />
						</div>
					))}
			</div>
		</div>
	);
}

export default ExploreTab;
