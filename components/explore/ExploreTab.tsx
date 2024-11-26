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
    <div className="flex flex-row gap-4 overflow-x-auto">
      {exploreData &&
        exploreData.results.map((media: any) => <ExploreCard media={media} />)}
    </div>
  );
}

export default ExploreTab;
