import { getMovieRecommendationsForUser } from "@/lib/recommendations";
import {
  getCurrentUser,
  getTopMovieGenresForUser,
  getTopTvGenresForUser,
} from "@/utils/supabase/serverQueries";
import React from "react";
import InfiniteScrollHome from "../protected/home/InfiniteScrollHome";
import { fetchInfiniteScrollHome } from "@/utils/serverFunctions/fetchInfiniteScrollHome";

const page = async () => {
  const user_id = "1e5e1d45-21c2-4866-959d-e582964b08ae";
  const user = await getCurrentUser();
  const [movie_genres, tv_genres] = await Promise.all([
    getTopMovieGenresForUser(undefined, user),
    getTopTvGenresForUser(undefined, user),
  ]);

  // const infin = await fetchInfiniteScrollHome(
  //   movie_genres,
  //   tv_genres,
  //   1,
  //   user_id,
  // );

  // console.log(infin);

  return (
    <div className="flex min-h-32 w-full flex-row flex-wrap gap-4">
      <InfiniteScrollHome
        user_id={user_id}
        movie_genres={movie_genres}
        tv_genres={tv_genres}
      ></InfiniteScrollHome>
    </div>
  );
};

export default page;
