const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY!;
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchFromApi = async (endpoint: string): Promise<any> => {
	const url = `${BASE_URL}/${endpoint}&api_key=${API_KEY}`;

	try {
		console.log("Request URL:", url); // Debugging log

		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Error: ${response.status} ${response.statusText}`);
		}
		const result = await response.json();
		return result;
	} catch (error) {
		console.error(`Failed to fetch from API: ${endpoint}`, error);
		throw error;
	}
};
