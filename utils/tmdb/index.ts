import { fetchFromApi } from "./tmdbApi";

export const discoverMovies = async () => {
	return fetchFromApi(
		"discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc"
	);
};

export const searchMovies = async (query: string) => {
	return fetchFromApi(
		`search/multi?query=${encodeURIComponent(
			query
		)}&include_adult=false&language=en-US&page=1`
	);
};

export const getNowPlayingMovies = async () => {
	return fetchFromApi("movie/now_playing?language=en-US&page=1");
};

export const getTrendingTV = async () => {
	return fetchFromApi("trending/tv/week?language=en-US");
};

export const getPopular = async () => {
	return fetchFromApi("trending/all/week?language=en-US");
};

export const getAiringToday = async () => {
	return fetchFromApi("tv/airing_today?language=en-US&page=1");
};

export const getMovieDetails = async (movieId: number) => {
	return fetchFromApi(`movie/${movieId}?language=en-US`);
};

export const getTVDetails = async (tvId: number) => {
	return fetchFromApi(`tv/${tvId}?language=en-US`);
};

export const getVideos = async (media_type: string, media_id: number) => {
	return fetchFromApi(`${media_type}/${media_id}/videos?language=en-US`);
};

export const getRecommendations = async (
	media_type: string,
	media_id: number
) => {
	return fetchFromApi(
		`${media_type}/${media_id}/recommendations?language=en-US`
	);
};

export const getReviews = async (media_type: string, media_id: number) => {
	return fetchFromApi(
		`${media_type}/${media_id}/reviews?language=en-US&page=1`
	);
};

export const getCredits = async (media_type: string, media_id: number) => {
	return fetchFromApi(`${media_type}/${media_id}/credits?language=en-US`);
};
