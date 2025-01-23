"use client";

import React, { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

// Context for user
import { useUser } from "@/context/UserContext";

// JSON genre lists
import movie_genres from "../../../constants/movie_genres.json";
import tv_genres from "../../../constants/tv_genres.json";

// Supabase queries for recommended genres
import {
  getTopMovieGenresForUser,
  getTopTvGenresForUser,
  updateUserFeedGenres,
} from "@/utils/supabase/queries";

// Modal component
import Modal from "../user/[userId]/Modal";

// Types
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

interface FeedGenre {
  genre_code: string;
  media_type: "movie" | "tv";
}

const GenreSelector: React.FC = () => {
  // ---------------------------
  // 1. HOOKS & STATE
  // ---------------------------
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  // State for the user's feed genres
  const [feedGenres, setFeedGenres] = useState<FeedGenre[]>(
    user?.feed_genres || [],
  );
  // State for recommended genres
  const [topRecommendedGenres, setTopRecommendedGenres] = useState<
    RecommendedGenre[]
  >([]);
  // Other UI states
  const [selectedCategory, setSelectedCategory] = useState<
    "Recommended" | "movie" | "tv"
  >("Recommended");
  const [loading, setLoading] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Safely get the user ID
  const user_id = user?.id;

  // If user changes (e.g., after loading), sync feedGenres
  useEffect(() => {
    if (user?.feed_genres) {
      setFeedGenres(user.feed_genres);
    }
  }, [user]);

  // ---------------------------
  // 2. GENRE DATA
  // ---------------------------
  const movieGenres: Genre[] = movie_genres.genres.map((genre: any) => ({
    ...genre,
    media_type: "movie",
  }));
  const tvGenres: Genre[] = tv_genres.genres.map((genre: any) => ({
    ...genre,
    media_type: "tv",
  }));

  // ---------------------------
  // 3. URL LOGIC
  // ---------------------------
  const pathSegments = useMemo(
    () => pathname.split("/").filter(Boolean),
    [pathname],
  );
  const media_type = pathSegments[2] || null;
  const genre_id = pathSegments[3] || null;

  // Update selected category based on the URL
  useEffect(() => {
    if (media_type === "movie" || media_type === "tv") {
      setSelectedCategory(media_type);
    } else {
      setSelectedCategory("Recommended");
    }
  }, [media_type]);

  // ---------------------------
  // 4. FETCH RECOMMENDED GENRES
  // ---------------------------
  useEffect(() => {
    const fetchRecommendedGenres = async () => {
      if (!user_id) return; // Make sure we have the user ID
      setLoading(true);
      try {
        // Fetch top genres for this user from Supabase
        const [topMovies, topTVs] = await Promise.all([
          getTopMovieGenresForUser(undefined, user),
          getTopTvGenresForUser(undefined, user),
        ]);

        // Combine movie and TV recommended genres
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

  // ---------------------------
  // 5. DISPLAYED GENRES
  // ---------------------------
  // Decide which set of genres to display in the category row
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

  // Helper to retrieve genre name from ID
  const getGenreName = (genreId: number, mediaType: string) => {
    let genres = mediaType === "movie" ? movieGenres : tvGenres;
    const genre = genres.find((g) => g.id === genreId);
    return genre ? genre.name : "Unknown";
  };

  // Type guard to check if item is a standard Genre (vs. recommended)
  const isGenre = (genre: UnifiedGenre): genre is Genre => {
    return (genre as Genre).id !== undefined;
  };

  // ---------------------------
  // 6. CLICK HANDLERS
  // ---------------------------
  const handleGenreClick = (genreId: number, mediaType: "movie" | "tv") => {
    router.push(`/protected/home/${mediaType}/${genreId}`);
  };

  const handleRecommendedClick = () => {
    router.push("/protected/home");
  };

  // Add genre to feed (optimistic update)
  const addGenreToFeed = async (genreId: number, mediaType: "movie" | "tv") => {
    if (!user_id) return;

    const oldFeedGenres = [...feedGenres];
    const newGenre = { genre_code: genreId.toString(), media_type: mediaType };

    const updatedFeedGenres = [...feedGenres, newGenre];
    // Optimistic update
    setFeedGenres(updatedFeedGenres);

    // Persist to Supabase
    const { error } = await updateUserFeedGenres(
      user_id.toString(),
      updatedFeedGenres,
    );
    if (error) {
      console.error("Failed to add genre:", error);
      // Revert on error
      setFeedGenres(oldFeedGenres);
    }
  };

  // Remove genre from feed (optimistic update)
  const removeGenreFromFeed = async (
    genreId: number,
    mediaType: "movie" | "tv",
  ) => {
    if (!user_id) return;

    const oldFeedGenres = [...feedGenres];
    const updatedFeedGenres = feedGenres.filter(
      (item) =>
        !(
          item.genre_code === genreId.toString() &&
          item.media_type === mediaType
        ),
    );

    // Optimistic update
    setFeedGenres(updatedFeedGenres);

    // Persist to Supabase
    const { error } = await updateUserFeedGenres(
      user_id.toString(),
      updatedFeedGenres,
    );
    if (error) {
      console.error("Failed to remove genre:", error);
      // Revert on error
      setFeedGenres(oldFeedGenres);
    }
  };

  // ---------------------------
  // 7. RENDER
  // ---------------------------

  // If user is not yet loaded, show a loading state
  if (!user) {
    return <p>Loading User...</p>;
  }

  return (
    <div className="hidden-scrollbar mt-14 flex flex-row items-center gap-2 overflow-x-auto px-2 text-sm lg:mt-0 lg:px-4 lg:py-1">
      {/* Category buttons */}
      <button
        className="rounded-[4px] bg-foreground/5 px-3 py-1"
        onClick={() => setIsSettingsModalOpen(true)}
      >
        <img
          src="/assets/icons/tune-outline.svg"
          alt="settings"
          className="invert-on-dark min-h-6 min-w-6"
        />
      </button>

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

      {/* Dynamically rendered genres (horizontal list) */}
      <div className="flex flex-row gap-2">
        {!loading &&
          getGenres.map((genre) => {
            let genreName: string;
            let genreId: number;
            let mediaType: "movie" | "tv";

            if (isGenre(genre)) {
              // It's a standard Genre
              genreName = genre.name;
              genreId = genre.id;
              mediaType = genre.media_type;
            } else {
              // It's a RecommendedGenre
              genreId = Number(genre.genre_code);
              mediaType = genre.media_type;
              genreName = getGenreName(genreId, mediaType);
            }

            // Highlight if this genre matches the URL
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

      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title="Personalized Feed"
      >
        <div className="w-full">
          <h2 className="mb-2 text-lg font-medium">Your Genres</h2>
          <p className="mb-4 text-sm text-foreground/60">
            These genres will be used to build your custom feed. You can also
            filter out the content on your feed by removing the genres you
            don&apos;t want to see on your home page.
          </p>

          {/* Movie Genres in Feed */}
          <h3 className="mb-2 font-medium">Movie</h3>
          <div className="mb-4 flex w-full flex-row flex-wrap gap-4">
            {movieGenres
              .filter((genre) =>
                feedGenres.some(
                  (feedGenre) =>
                    feedGenre.genre_code === genre.id.toString() &&
                    feedGenre.media_type === "movie",
                ),
              )
              .map((genre) => (
                <button
                  onClick={() => removeGenreFromFeed(genre.id, "movie")}
                  key={genre.id}
                  className="flex flex-shrink-0 flex-row items-center gap-2 rounded-[4px] bg-foreground px-3 py-1 text-background"
                >
                  <p>{genre.name}</p>
                  <p className="text-xl font-semibold">&times;</p>
                </button>
              ))}
          </div>

          {/* TV Genres in Feed */}
          <h3 className="mb-2 font-medium">TV</h3>
          <div className="mb-8 flex w-full flex-row flex-wrap gap-4">
            {tvGenres
              .filter((genre) =>
                feedGenres.some(
                  (feedGenre) =>
                    feedGenre.genre_code === genre.id.toString() &&
                    feedGenre.media_type === "tv",
                ),
              )
              .map((genre) => (
                <button
                  onClick={() => removeGenreFromFeed(genre.id, "tv")}
                  key={genre.id}
                  className="flex flex-shrink-0 flex-row items-center gap-2 rounded-[4px] bg-foreground px-3 py-1 text-background"
                >
                  <p>{genre.name}</p>
                  <p className="text-xl font-semibold">&times;</p>
                </button>
              ))}
          </div>

          <h2 className="mb-2 text-lg font-medium">Other Genres</h2>
          <p className="mb-4 text-sm text-foreground/60">
            Genres that are here will not be included in your recommendations
            and will not show up on your home page.
          </p>

          {/* Excluded Movie Genres */}
          <h3 className="mb-2 font-medium">Movies</h3>
          <div className="mb-4 flex w-full flex-row flex-wrap gap-4">
            {movieGenres
              .filter(
                (genre) =>
                  !feedGenres.some(
                    (feedGenre) =>
                      feedGenre.genre_code === genre.id.toString() &&
                      feedGenre.media_type === "movie",
                  ),
              )
              .map((genre) => (
                <button
                  onClick={() => addGenreToFeed(genre.id, "movie")}
                  key={genre.id}
                  className="flex flex-shrink-0 flex-row items-center gap-2 rounded-[4px] bg-foreground/5 px-3 py-1"
                >
                  <p>{genre.name}</p>
                  <p className="text-xl font-semibold">&#10003;</p>
                </button>
              ))}
          </div>

          {/* Excluded TV Genres */}
          <h3 className="mb-2 font-medium">TV</h3>
          <div className="mb-4 flex min-h-16 w-full flex-row flex-wrap gap-4">
            {tvGenres
              .filter(
                (genre) =>
                  !feedGenres.some(
                    (feedGenre) =>
                      feedGenre.genre_code === genre.id.toString() &&
                      feedGenre.media_type === "tv",
                  ),
              )
              .map((genre) => (
                <button
                  onClick={() => addGenreToFeed(genre.id, "tv")}
                  key={genre.id}
                  className="flex flex-shrink-0 flex-row items-center gap-2 rounded-[4px] bg-foreground/5 px-3 py-1"
                >
                  <p>{genre.name}</p>
                  <p className="text-xl font-semibold">&#10003;</p>
                </button>
              ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GenreSelector;
