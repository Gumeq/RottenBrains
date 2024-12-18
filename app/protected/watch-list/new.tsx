import {
  getWatchLaterForUser,
  getWatchListFull,
  getWatchListSpecific,
} from "@/utils/supabase/queries";
import { getCurrentUser } from "@/utils/supabase/serverQueries";
import React from "react";
import MediaCard from "./MediaCardWatchList";
import { getMediaDetails } from "@/utils/tmdb";
import ImageWithFallback from "@/components/ImageWithFallback";
import { getAverageColor } from "fast-average-color-node";

const page = async () => {
  const user = await getCurrentUser();
  console.log(user);
  const limit = 1;
  const offset = 0;
  // const watchList = await getWatchListFull(user.user.id, limit, offset);
  // const watching = await getWatchListSpecific(
  //   user.user.id,
  //   limit,
  //   offset,
  //   "watching",
  // );
  // const planned = await getWatchListSpecific(
  //   user.user.id,
  //   limit,
  //   offset,
  //   "planned",
  // );
  const watched = await getWatchListSpecific(
    user.user.id,
    limit,
    offset,
    "watched",
  );

  const fwatched = watched[0];
  const watchedMedia = await getMediaDetails(
    fwatched.media_type,
    fwatched.media_id,
  );

  const imageUrl =
    watchedMedia?.images?.backdrops?.[0]?.file_path ||
    watchedMedia?.backdrop_path;
  const color = await getAverageColor(
    `https://image.tmdb.org/t/p/w200${watchedMedia.backdrop_path}`,
  );

  return (
    <div className="my-4 mb-12 w-full px-4">
      <h1 className="px-4 text-lg font-semibold">Watch List</h1>
      <div className="my-4 w-full border-b-2 border-foreground/5"></div>
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="relative w-[300px]">
          <div
            className="absolute top-0 z-10 aspect-[16/9] w-full scale-90 rounded-[8px] opacity-50"
            style={{ backgroundColor: color.hex }}
          ></div>
          <div
            className="absolute top-3 z-20 aspect-[16/9] w-full scale-95 rounded-[8px] opacity-80"
            style={{ backgroundColor: color.hex }}
          ></div>
          <div className="absolute top-6 z-30 flex aspect-[16/9] w-full overflow-hidden rounded-[8px] drop-shadow-md">
            <div className="absolute flex h-full w-full items-center justify-center bg-black/50">
              <p className="text-2xl font-semibold">Watched</p>
            </div>
            <ImageWithFallback
              altText={watchedMedia.id}
              imageUrl={imageUrl}
            ></ImageWithFallback>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
