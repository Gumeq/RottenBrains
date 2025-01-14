import { ExploreTabProps } from "@/types";
import React from "react";
import ExploreCard from "@/components/explore/ExploreCard";
import { fetchExploreData } from "@/utils/clientFunctions/fetchExploreData";
import HomeMediaCard from "@/app/protected/home/HomeMediaCard";
import { getCurrentUser } from "@/utils/supabase/serverQueries";

export async function ExploreTab({
  action,
  containerId,
}: ExploreTabProps & { containerId: string }) {
  let user = await getCurrentUser();
  user = user.user;
  let exploreData;
  try {
    exploreData = await fetchExploreData(action);
  } catch (error) {
    console.error("Error fetching explore data:", error);
    exploreData = null;
  }

  return (
    <div className="flex w-full flex-col gap-8 border-foreground/20 p-4 lg:gap-16 lg:rounded-[16px] lg:border lg:p-8">
      <div className="flex w-full flex-row items-center justify-between">
        <h2 className="text-xl font-bold uppercase">{action}</h2>
        <div className="rounded-full bg-foreground/5 px-6 py-2">View all</div>
      </div>

      <div className="flex w-full flex-row gap-2 overflow-x-auto lg:grid lg:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] lg:gap-8">
        {exploreData &&
          exploreData.results.slice(0, 10).map((media: any) => {
            if (!media.media_type && media.title) {
              media.media_type = "movie";
            } else if (!media.media_type && media.name) {
              media.media_type = "tv";
            }
            return (
              <HomeMediaCard
                media_id={media.id}
                media_type={media.media_type}
                user_id={user.id}
                rounded
              ></HomeMediaCard>
            );
          })}
      </div>
    </div>
  );
}

export default ExploreTab;
