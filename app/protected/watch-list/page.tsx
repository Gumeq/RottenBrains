import {
  getWatchLaterForUser,
  getWatchListFull,
  getWatchListSpecific,
} from "@/utils/supabase/queries";
import { getCurrentUser } from "@/utils/supabase/serverQueries";
import React from "react";
import MediaCard from "./MediaCardWatchList";

const page = async () => {
  const user = await getCurrentUser();
  const limit = 10;
  const offset = 0;
  // const watchList = await getWatchListFull(user.user.id, limit, offset);
  const watching = await getWatchListSpecific(
    user.user.id,
    limit,
    offset,
    "watching",
  );
  const planned = await getWatchListSpecific(
    user.user.id,
    limit,
    offset,
    "planned",
  );
  const watched = await getWatchListSpecific(
    user.user.id,
    limit,
    offset,
    "watched",
  );

  return (
    <div className="grid grid-cols-1 p-2 lg:grid-cols-3 lg:gap-8 lg:p-4">
      <div className="">
        <h2 className="my-4 text-xl font-semibold">Watching</h2>
        <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
          {watching &&
            watching.map((media: any) => {
              return (
                <MediaCard
                  media_type={media.media_type}
                  media_id={media.media_id}
                ></MediaCard>
              );
            })}
        </div>
      </div>
      <div className="">
        <h2 className="my-4 text-xl font-semibold">Planned</h2>
        <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
          {planned &&
            planned.map((media: any) => {
              return (
                <MediaCard
                  media_type={media.media_type}
                  media_id={media.media_id}
                ></MediaCard>
              );
            })}
        </div>
      </div>
      <div className="">
        <h2 className="my-4 text-xl font-semibold">Watched</h2>
        <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
          {watched &&
            watched.map((media: any) => {
              return (
                <MediaCard
                  media_type={media.media_type}
                  media_id={media.media_id}
                ></MediaCard>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default page;
