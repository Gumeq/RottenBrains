import React from "react";
import HomePostCardNew from "@/components/post/HomePostCardNew";
import HomeMediaCardUI from "../protected/home/HomeMediaCardUI";
import { fetchMediaData } from "@/utils/serverFunctions/fetchMediaData";
import { getNextEpisodes } from "@/utils/supabase/serverQueries";
import { getMediaDetails } from "@/utils/tmdb";
import { fetchContinueWatching } from "@/utils/serverFunctions/homeFunctions";

const page = async () => {
  const user_id = "1e5e1d45-21c2-4866-959d-e582964b08ae";
  const continue_watching = await fetchContinueWatching(user_id);

  return (
    <div className="flex min-h-32 w-full flex-row flex-wrap gap-4">
      {continue_watching.map((media) => {
        console.log(media.season_number, media.episode_number);
        return (
          <HomeMediaCardUI
            media={media}
            season_number={media.season_number}
            episode_number={media.episode_number}
            watch_time={media.watch_time}
          ></HomeMediaCardUI>
        );
      })}
    </div>
  );
};

export default page;
