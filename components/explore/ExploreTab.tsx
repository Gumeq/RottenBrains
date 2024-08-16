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
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8"
      >
        {exploreData &&
          exploreData.results.map((media: any) => (
            <div key={media.id} className="">
              <ExploreCard media={media} />
            </div>
          ))}
      </div>
    </div>
  );
}

export default ExploreTab;
