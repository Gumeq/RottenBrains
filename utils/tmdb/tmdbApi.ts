const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY!;
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchFromApi = async (
	endpoint: string,
	append_to_response?: string
): Promise<any> => {
	let url = `${BASE_URL}/${endpoint}&api_key=${API_KEY}`;

	if (append_to_response) {
		url = `${BASE_URL}/${endpoint}&api_key=${API_KEY}&append_to_response=${append_to_response}`;
	}

	try {
		const response = await fetch(url, {
			headers: {
				"Cache-Control": "max-age=60, must-revalidate",
			},
		});

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
