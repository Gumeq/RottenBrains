"use client";

import React, { useEffect, useState } from "react";
import movie_genres from "../../../constants/movie_genres.json";
import tv_genres from "../../../constants/tv_genres.json";
import { getTopMovieGenresForUser } from "@/utils/supabase/queries";

interface GenreSelectorProps {
  user_id: string;
}

const GenreSelector: React.FC<GenreSelectorProps> = ({ user_id }) => {
  const [selectedCategory, setSelectedCategory] = useState<
    "Recommended" | "Movies" | "TV"
  >("Recommended");

  const [topMovieGenres, setTopMovieGenres] = useState<any>();
  const [loading, setLoading] = useState(true);

  const movieGenres = movie_genres.genres;
  const tvGenres = tv_genres.genres;

  useEffect(() => {
    const fetchTopGenres = async () => {
      try {
        const topGenres = await getTopMovieGenresForUser(user_id);
        setTopMovieGenres(topGenres);
      } catch (error) {
        console.error("Error fetching top movie genres:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopGenres();
  }, [user_id]);

  // Function to get genres based on the selected category
  const getGenres = () => {
    switch (selectedCategory) {
      case "Movies":
        return topMovieGenres;
      case "TV":
        return tvGenres;
      default:
        return [...movieGenres, ...tvGenres]; // For 'All', show all genres
    }
  };

  return (
    <div className="flex flex-row items-center gap-2 overflow-x-auto bg-background py-2">
      {/* Category buttons */}
      <button
        className={`rounded-[8px] px-4 py-2 ${selectedCategory === "Recommended" ? "bg-foreground text-background" : "bg-foreground/10"}`}
        onClick={() => setSelectedCategory("Recommended")}
      >
        Recommended
      </button>
      <button
        className={`rounded-[8px] px-4 py-2 ${selectedCategory === "Movies" ? "bg-foreground text-background" : "bg-foreground/10"}`}
        onClick={() => setSelectedCategory("Movies")}
      >
        Movies
      </button>
      <button
        className={`rounded-[8px] px-4 py-2 ${selectedCategory === "TV" ? "bg-foreground text-background" : "bg-foreground/10"}`}
        onClick={() => setSelectedCategory("TV")}
      >
        TV
      </button>

      {/* Dynamically rendered genres */}
      <div className="flex flex-row gap-2">
        {getGenres().map((genre: any) => (
          <span
            key={genre.id}
            className="flex flex-shrink-0 rounded-[8px] bg-foreground/10 px-4 py-2"
          >
            {genre.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default GenreSelector;
