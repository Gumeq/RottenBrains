import { getGenreNameById } from "@/lib/functions";
import React from "react";
import InfiniteScrollByGenre from "./InfiniteScrollGenre";
import GenreSelector from "../../GenreSelectorHome";
import { getCurrentUser } from "@/utils/supabase/serverQueries";
import MobileTopBarHome from "../../MobileTopBarHome";

const page = async ({
  params,
}: {
  params: { genre_id: number; media_type: "movie" | "tv" };
}) => {
  const genre_id = Number(params.genre_id);
  const media_type = params.media_type;
  const genre_name = getGenreNameById(genre_id);
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }
  const userId = user.user.id.toString();
  console.log(userId);
  return (
    <div className="flex w-full flex-col gap-2">
      <GenreSelector user_id={userId}></GenreSelector>
      <MobileTopBarHome />
      <div className="mt-4 w-full px-4">
        <InfiniteScrollByGenre
          genre_id={genre_id}
          media_type={media_type}
        ></InfiniteScrollByGenre>
      </div>
    </div>
  );
};

export default page;
