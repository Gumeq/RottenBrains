import {
	getAiringToday,
	getNowPlayingMovies,
	getPopular,
	getTrendingTV,
} from "../tmdb";

export async function fetchExploreData(action: string) {
	const actionFunctionMapping: {
		[key: string]: () => Promise<any>;
	} = {
		Now_in_cinemas: getNowPlayingMovies,
		Trending_TV: getTrendingTV,
		Popular_Today: getPopular,
		Airing_Today: getAiringToday,
	};

	const fetchFunction = actionFunctionMapping[action];
	if (!fetchFunction) {
		throw new Error(`Invalid action type: ${action}`);
	}

	try {
		return await fetchFunction();
	} catch (err) {
		console.error("Failed to fetch data", err);
		throw err;
	}
}
