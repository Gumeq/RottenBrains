"use client";

import React, { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import movie_genres from "../../../constants/movie_genres.json";
import tv_genres from "../../../constants/tv_genres.json";
import {
  getTopMovieGenresForUser,
  getTopTvGenresForUser,
} from "@/utils/supabase/queries";

export interface Genre {
  id: number;
  name: string;
  media_type: "movie" | "tv";
}

interface RecommendedGenre {
  genre_code: string;
  media_type: "movie" | "tv";
  value: number;
}

type UnifiedGenre = Genre | RecommendedGenre;

interface GenreSelectorProps {
  user_id: string;
}

const GenreSelector: React.FC<GenreSelectorProps> = ({ user_id }) => {
  const pathname = usePathname(); // Get the current URL path
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<
    "Recommended" | "movie" | "tv"
  >("Recommended");

  const [topRecommendedGenres, setTopRecommendedGenres] = useState<
    RecommendedGenre[]
  >([]);
  const [loading, setLoading] = useState(false);

  const movieGenres: Genre[] = movie_genres.genres.map((genre: any) => ({
    ...genre,
    media_type: "movie",
  }));
  const tvGenres: Genre[] = tv_genres.genres.map((genre: any) => ({
    ...genre,
    media_type: "tv",
  }));

  // Extract media_type and genre_id from the pathname
  const pathSegments = useMemo(
    () => pathname.split("/").filter(Boolean),
    [pathname],
  );
  const media_type = pathSegments[2] || null;
  const genre_id = pathSegments[3] || null;

  // Update the selected category based on the URL
  useEffect(() => {
    if (media_type === "movie" || media_type === "tv") {
      setSelectedCategory(media_type);
    } else {
      setSelectedCategory("Recommended");
    }
  }, [media_type]);

  useEffect(() => {
    const fetchRecommendedGenres = async () => {
      setLoading(true);
      try {
        const [topMovies, topTVs] = await Promise.all([
          getTopMovieGenresForUser(user_id),
          getTopTvGenresForUser(user_id),
        ]);

        // Combine top genres from movies and TV
        const combinedGenres: RecommendedGenre[] = [
          ...(topMovies?.map((genre: any) => ({
            ...genre,
            media_type: "movie",
          })) || []),
          ...(topTVs?.map((genre: any) => ({
            ...genre,
            media_type: "tv",
          })) || []),
        ];

        setTopRecommendedGenres(combinedGenres);
      } catch (error) {
        console.error("Error fetching recommended genres:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedCategory === "Recommended") {
      fetchRecommendedGenres();
    }
  }, [user_id, selectedCategory]);

  const getGenres = useMemo<UnifiedGenre[]>(() => {
    switch (selectedCategory) {
      case "movie":
        return movieGenres;
      case "tv":
        return tvGenres;
      case "Recommended":
        return topRecommendedGenres;
      default:
        return [];
    }
  }, [selectedCategory, topRecommendedGenres, movieGenres, tvGenres]);

  const handleGenreClick = (genreId: number, mediaType: "movie" | "tv") => {
    // Update the URL to reflect the selected genre and media type
    router.push(`/protected/home/${mediaType}/${genreId}`);
  };

  const handleRecommendedClick = () => {
    router.push("/protected/home");
  };

  const getGenreName = (genreId: number, mediaType: string) => {
    let genres: Genre[] = [];
    if (mediaType === "movie") {
      genres = movieGenres;
    } else if (mediaType === "tv") {
      genres = tvGenres;
    }
    const genre = genres.find((g) => g.id === genreId);
    return genre ? genre.name : "Unknown";
  };

  const isGenre = (genre: UnifiedGenre): genre is Genre => {
    return (genre as Genre).id !== undefined;
  };

  return (
    <div className="hidden-scrollbar mt-14 flex flex-row items-center gap-2 overflow-x-auto px-2 text-sm lg:mt-0 lg:px-4 lg:py-1">
      {/* Category buttons */}
      <button
        className={`rounded-[4px] px-3 py-1 ${
          selectedCategory === "Recommended"
            ? "bg-foreground text-background"
            : "bg-foreground/5"
        }`}
        onClick={handleRecommendedClick}
      >
        Recommended
      </button>
      <button
        className={`rounded-[4px] px-3 py-1 ${
          selectedCategory === "movie"
            ? "bg-foreground text-background"
            : "bg-foreground/5"
        }`}
        onClick={() => setSelectedCategory("movie")}
      >
        Movies
      </button>
      <button
        className={`rounded-[4px] px-3 py-1 ${
          selectedCategory === "tv"
            ? "bg-foreground text-background"
            : "bg-foreground/5"
        }`}
        onClick={() => setSelectedCategory("tv")}
      >
        TV
      </button>

      {/* Dynamically rendered genres */}
      <div className="flex flex-row gap-2">
        {!loading &&
          getGenres.map((genre) => {
            let genreName: string;
            let genreId: number;
            let mediaType: "movie" | "tv";

            if (isGenre(genre)) {
              // It's a Genre
              genreName = genre.name;
              genreId = genre.id;
              mediaType = genre.media_type;
            } else {
              // It's a RecommendedGenre
              genreId = Number(genre.genre_code);
              mediaType = genre.media_type;
              genreName = getGenreName(genreId, mediaType);
            }

            // Highlight the selected genre
            const isSelected =
              media_type === mediaType && Number(genre_id) === genreId;

            return (
              <button
                key={`${mediaType}-${genreId}`}
                className={`flex flex-shrink-0 rounded-[4px] px-3 py-1 ${
                  isSelected
                    ? "bg-foreground text-background"
                    : "bg-foreground/5"
                }`}
                onClick={() => handleGenreClick(genreId, mediaType)}
              >
                {genreName}
              </button>
            );
          })}
        {loading && <p>Loading genres...</p>}
      </div>
    </div>
  );
};

export default GenreSelector;
