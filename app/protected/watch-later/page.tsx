import {
  getWatchHistoryForUser,
  getWatchLaterForUser,
} from "@/utils/supabase/queries";
import { getCurrentUser } from "@/utils/supabase/serverQueries";
import React from "react";
import MediaCard from "../watch-history/media_card";

const page = async () => {
  const user = await getCurrentUser();
  console.log(user);
  const limit = 10;
  const offset = 0;
  const watchHistory = await getWatchLaterForUser(user.user.id, limit, offset);
  return (
    <div className="mx-auto mt-16 w-screen max-w-4xl">
      <h1 className="my-12 text-4xl font-bold">Watch Later</h1>
      <div className="flex w-full flex-col gap-4">
        {watchHistory.map((media: any) => {
          console.log(media);
          return (
            <MediaCard
              media_type={media.media_type}
              media_id={media.media_id}
              season_number={media.season_number}
              episode_number={media.episode_number}
            ></MediaCard>
          );
        })}
      </div>
    </div>
  );
};

export default page;
