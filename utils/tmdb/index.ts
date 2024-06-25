import { FilterProps } from "@/types";

// TRANSFORM THE NAMES OF ITEMS FROM THE LIST IN /CONSTANTS TO A STRING THAT THE API WILL UNDERSTAND
export const transformString = (input: string): string => {
	return input.replace(/\s*\|\s*/g, "_").replace(/\s+/g, "_");
};

// FETCH
export async function discoverMovies() {
	const url =
		"https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc";
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMDE4NDhhYTU5NTlhYjQzMGQ2NGZmZmNiMTg0YzRkMyIsInN1YiI6IjY1ZTEyYTBiNTFmOTlhMDE4NTU3ZTdkZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.sqsiazpQMK-1z-Vjn5IGu3qy4qbIvkituqVCL5vfMs4",
		},
	};
	try {
		const response = await fetch(url, options);
		const result = await response.json();
		return result;
	} catch (error) {
		console.error(error);
	}
}

export async function searchMovies(query: string) {
	const url = `https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=en-US&page=1`;
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMDE4NDhhYTU5NTlhYjQzMGQ2NGZmZmNiMTg0YzRkMyIsInN1YiI6IjY1ZTEyYTBiNTFmOTlhMDE4NTU3ZTdkZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.sqsiazpQMK-1z-Vjn5IGu3qy4qbIvkituqVCL5vfMs4",
		},
	};
	try {
		const response = await fetch(url, options);
		const result = await response.json();
		return result;
	} catch (error) {
		console.error(error);
	}
}

export async function getNowPlayingMovies() {
	const url =
		"https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1";
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMDE4NDhhYTU5NTlhYjQzMGQ2NGZmZmNiMTg0YzRkMyIsInN1YiI6IjY1ZTEyYTBiNTFmOTlhMDE4NTU3ZTdkZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.sqsiazpQMK-1z-Vjn5IGu3qy4qbIvkituqVCL5vfMs4",
		},
	};

	try {
		const response = await fetch(url, options);
		const result = await response.json();
		return result;
	} catch (error) {
		console.error(error);
	}
}

export async function getTrendingTV() {
	const url = "https://api.themoviedb.org/3/trending/tv/week?language=en-US";
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMDE4NDhhYTU5NTlhYjQzMGQ2NGZmZmNiMTg0YzRkMyIsInN1YiI6IjY1ZTEyYTBiNTFmOTlhMDE4NTU3ZTdkZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.sqsiazpQMK-1z-Vjn5IGu3qy4qbIvkituqVCL5vfMs4",
		},
	};

	try {
		const response = await fetch(url, options);
		const result = await response.json();
		return result;
	} catch (error) {
		console.error(error);
	}
}

export async function getPopular() {
	const url = "https://api.themoviedb.org/3/trending/all/week?language=en-US";
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMDE4NDhhYTU5NTlhYjQzMGQ2NGZmZmNiMTg0YzRkMyIsInN1YiI6IjY1ZTEyYTBiNTFmOTlhMDE4NTU3ZTdkZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.sqsiazpQMK-1z-Vjn5IGu3qy4qbIvkituqVCL5vfMs4",
		},
	};

	try {
		const response = await fetch(url, options);
		const result = await response.json();
		return result;
	} catch (error) {
		console.error(error);
	}
}
export async function getAiringToday() {
	const url =
		"https://api.themoviedb.org/3/tv/airing_today?language=en-US&page=1";
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMDE4NDhhYTU5NTlhYjQzMGQ2NGZmZmNiMTg0YzRkMyIsInN1YiI6IjY1ZTEyYTBiNTFmOTlhMDE4NTU3ZTdkZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.sqsiazpQMK-1z-Vjn5IGu3qy4qbIvkituqVCL5vfMs4",
		},
	};

	try {
		const response = await fetch(url, options);
		const result = await response.json();
		return result;
	} catch (error) {
		console.error(error);
	}
}

export async function getMovieDetails(movieId: number) {
	const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMDE4NDhhYTU5NTlhYjQzMGQ2NGZmZmNiMTg0YzRkMyIsInN1YiI6IjY1ZTEyYTBiNTFmOTlhMDE4NTU3ZTdkZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.sqsiazpQMK-1z-Vjn5IGu3qy4qbIvkituqVCL5vfMs4",
		},
	};
	try {
		const response = await fetch(url, options);
		const result = await response.json();
		return result;
	} catch (error) {
		console.error(error);
	}
}
export async function getTVDetails(tvId: number) {
	const url = `https://api.themoviedb.org/3/tv/${tvId}?language=en-US`;
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMDE4NDhhYTU5NTlhYjQzMGQ2NGZmZmNiMTg0YzRkMyIsInN1YiI6IjY1ZTEyYTBiNTFmOTlhMDE4NTU3ZTdkZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.sqsiazpQMK-1z-Vjn5IGu3qy4qbIvkituqVCL5vfMs4",
		},
	};
	try {
		const response = await fetch(url, options);
		const result = await response.json();
		return result;
	} catch (error) {
		console.error(error);
	}
}

export async function getVideos(media_type: string, media_id: number) {
	const url = `https://api.themoviedb.org/3/${media_type}/${media_id}}/videos?language=en-US`;
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMDE4NDhhYTU5NTlhYjQzMGQ2NGZmZmNiMTg0YzRkMyIsInN1YiI6IjY1ZTEyYTBiNTFmOTlhMDE4NTU3ZTdkZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.sqsiazpQMK-1z-Vjn5IGu3qy4qbIvkituqVCL5vfMs4",
		},
	};
	try {
		const response = await fetch(url, options);
		const result = await response.json();
		return result;
	} catch (error) {
		console.error(error);
	}
}

export async function getRecommendations(media_type: string, media_id: number) {
	const url = `https://api.themoviedb.org/3/${media_type}/${media_id}}/recommendations?language=en-US`;
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMDE4NDhhYTU5NTlhYjQzMGQ2NGZmZmNiMTg0YzRkMyIsInN1YiI6IjY1ZTEyYTBiNTFmOTlhMDE4NTU3ZTdkZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.sqsiazpQMK-1z-Vjn5IGu3qy4qbIvkituqVCL5vfMs4",
		},
	};
	try {
		const response = await fetch(url, options);
		const result = await response.json();
		return result;
	} catch (error) {
		console.error(error);
	}
}

export async function getReviews(media_type: string, media_id: number) {
	const url = `https://api.themoviedb.org/3/${media_type}/${media_id}}/reviews?language=en-US&page=1`;
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMDE4NDhhYTU5NTlhYjQzMGQ2NGZmZmNiMTg0YzRkMyIsInN1YiI6IjY1ZTEyYTBiNTFmOTlhMDE4NTU3ZTdkZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.sqsiazpQMK-1z-Vjn5IGu3qy4qbIvkituqVCL5vfMs4",
		},
	};
	try {
		const response = await fetch(url, options);
		const result = await response.json();
		return result;
	} catch (error) {
		console.error(error);
	}
}

export async function getCredits(media_type: string, media_id: number) {
	const url = `https://api.themoviedb.org/3/${media_type}/${media_id}}/reviews?language=en-US&page=1`;
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMDE4NDhhYTU5NTlhYjQzMGQ2NGZmZmNiMTg0YzRkMyIsInN1YiI6IjY1ZTEyYTBiNTFmOTlhMDE4NTU3ZTdkZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.sqsiazpQMK-1z-Vjn5IGu3qy4qbIvkituqVCL5vfMs4",
		},
	};
	try {
		const response = await fetch(url, options);
		const result = await response.json();
		return result;
	} catch (error) {
		console.error(error);
	}
}
