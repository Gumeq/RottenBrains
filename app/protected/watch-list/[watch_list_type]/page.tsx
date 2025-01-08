import { getWatchListSpecific } from "@/utils/supabase/queries";
import { getCurrentUser } from "@/utils/supabase/serverQueries";
import React from "react";
import HomeMediaCard from "../../home/HomeMediaCard";
import WatchListInfiniteScroll from "./WatchListInfinireScroll";

const page = async ({ params }: { params: { watch_list_type: string } }) => {
  const watch_list_type = params.watch_list_type;

  let user = await getCurrentUser();
  user = user.user;
  const limit = 10;
  const offset = 0;

  const media = await getWatchListSpecific(
    user.id,
    limit,
    offset,
    watch_list_type,
  );

  console.log(media);

  return (
    <div className="mb-16 w-full flex-col px-4 py-4">
      <h1 className="px-4 text-lg font-semibold">{watch_list_type}</h1>
      <div className="my-4 w-full border-b-2 border-foreground/5"></div>
      <div className="w-full">
        <WatchListInfiniteScroll
          watchListType={watch_list_type}
          userId={user.id}
        ></WatchListInfiniteScroll>
      </div>
    </div>
  );
};

export default page;
