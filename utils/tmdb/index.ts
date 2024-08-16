import { fetchFromApi } from "./tmdbApi";

export const discoverMovies = async () => {
  return fetchFromApi(
    "discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc",
  );
};

export const searchMovies = async (query: string) => {
  return fetchFromApi(
    `search/multi?query=${encodeURIComponent(
      query,
    )}&include_adult=false&language=en-US&page=1`,
  );
};

export const getNowPlayingMovies = async () => {
  return fetchFromApi("movie/now_playing?language=en-US&page=1");
};

export const getTrendingTV = async () => {
  return fetchFromApi("trending/tv/day?language=en-US");
};

export const getTrendingMovies = async () => {
  return fetchFromApi("trending/movie/day?language=en-US");
};

export const getPopular = async () => {
  return fetchFromApi("trending/all/day?language=en-US");
};

export const getAiringToday = async () => {
  return fetchFromApi("tv/airing_today?language=en-US&page=1");
};

export const getMovieDetails = async (movieId: number) => {
  return fetchFromApi(`movie/${movieId}?language=en`, "images");
};

export const getTVDetails = async (tvId: number) => {
  return fetchFromApi(`tv/${tvId}?language=en`, "images");
};

export const getMovieCredits = async (movieId: number) => {
  return fetchFromApi(`movie/${movieId}/credits?language=en-US`);
};
export const getTVCredits = async (tvId: number) => {
  return fetchFromApi(`tv/${tvId}/credits?language=en-US`);
};

export const getSeasonDetails = async (tvId: number, season_number: number) => {
  return fetchFromApi(`tv/${tvId}/season/${season_number}?language=en-US`);
};
export const getEpisodeDetails = async (
  tvId: number,
  season_number: number,
  episode_number: number,
) => {
  return fetchFromApi(
    `tv/${tvId}/season/${season_number}/episode/${episode_number}?language=en-US`,
  );
};

export const getMediaDetails = async (media_type: string, media_id: number) => {
  if (media_type === "movie") {
    return await getMovieDetails(media_id);
  } else {
    return await getTVDetails(media_id);
  }
};

export const fetchMediaDetails = async (mediaItems: any) => {
  try {
    const requests = mediaItems.map((item: any) =>
      fetchFromApi(`${item.type}/${item.tmdb_id}?language=en-US`)
        .then((response) => ({ status: "fulfilled", value: response }))
        .catch((error) => ({ status: "rejected", reason: error })),
    );

    const results = await Promise.all(requests);
    const mediaDetails = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

    return mediaDetails;
  } catch (error) {
    console.error("Error fetching media details:", error);
    return [];
  }
};

export const fetchHistoryMediaDetails = async (mediaItems: any) => {
  try {
    const requests = mediaItems.map((item: any) =>
      fetchFromApi(`${item.media_type}/${item.media_id}?language=en-US`),
    );
    const mediaDetails = await Promise.all(requests);
    return mediaDetails;
  } catch (error) {
    console.error("Error fetching media details:", error);
    return [];
  }
};

export const getMediaCredits = async (media_type: string, media_id: number) => {
  if (media_type === "movie") {
    return await getMovieCredits(media_id);
  } else {
    return await getTVCredits(media_id);
  }
};

export const getPersonDetails = async (person_id: number) => {
  return fetchFromApi(`person/${person_id}?language=en-US`);
};
export const getPersonImages = async (person_id: number) => {
  return fetchFromApi(`person/${person_id}/tagged_images?page=1`);
};
export const getPersonCredits = async (person_id: number) => {
  return fetchFromApi(`person/${person_id}/combined_credits?language=en-US`);
};

export const getVideos = async (media_type: string, media_id: number) => {
  return fetchFromApi(`${media_type}/${media_id}/videos?language=en-US`);
};

export const getRecommendations = async (
  media_type: string,
  media_id: number,
) => {
  return fetchFromApi(
    `${media_type}/${media_id}/recommendations?language=en-US`,
    "images",
  );
};

export const getSimilar = async (media_type: string, media_id: number) => {
  return fetchFromApi(
    `${media_type}/${media_id}/similar?language=en-US&page=1`,
  );
};

export const getReviews = async (media_type: string, media_id: number) => {
  return fetchFromApi(
    `${media_type}/${media_id}/reviews?language=en-US&page=1`,
  );
};

export const getCredits = async (media_type: string, media_id: number) => {
  return fetchFromApi(`${media_type}/${media_id}/credits?language=en-US`);
};

export const getFromGenres = async (
  media_type: string,
  page: number,
  genre: string,
) => {
  return fetchFromApi(
    `discover/${media_type}?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=${genre}`,
  );
};
