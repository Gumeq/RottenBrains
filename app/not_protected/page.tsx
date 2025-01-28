import React from "react";
import HomePostCardNew from "@/components/post/HomePostCardNew";
import HomeMediaCardUI from "../protected/home/HomeMediaCardUI";
import { fetchMediaData } from "@/utils/serverFunctions/fetchMediaData";
import { getNextEpisodes } from "@/utils/supabase/serverQueries";
import { getMediaDetails } from "@/utils/tmdb";

const page = async () => {
  const user_id = "1e5e1d45-21c2-4866-959d-e582964b08ae";
  const next_episodes = await getNextEpisodes(user_id);

  // console.log(media_array);

  return (
    <div className="flex min-h-32 w-full flex-row flex-wrap gap-4">
      not protected
    </div>
  );
};

export default page;
