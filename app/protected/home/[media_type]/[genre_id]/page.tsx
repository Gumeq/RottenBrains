import { getGenreNameById } from "@/lib/functions";
import React from "react";
import InfiniteScrollByGenre from "./InfiniteScrollGenre";
import GenreSelector from "../../GenreSelectorHome";
import { getCurrentUser } from "@/utils/supabase/serverQueries";
import MobileTopBarHome from "../../MobileTopBarHome";

type Params = Promise<{ genre_id: number; media_type: "movie" | "tv" }>;

const page = async ({ params }: { params: Params }) => {
  const { genre_id } = await params;
  const { media_type } = await params;

  return (
    <div className="flex w-full flex-col gap-2">
      <GenreSelector></GenreSelector>
      <MobileTopBarHome />
      <div className="mt-4 w-full">
        <InfiniteScrollByGenre
          genre_id={genre_id}
          media_type={media_type}
        ></InfiniteScrollByGenre>
      </div>
    </div>
  );
};

export default page;
