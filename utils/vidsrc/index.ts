export async function fetchVidsrc(type: string, page: number) {
	const urlMovies = `https://vidsrc.to/vapi/movie/${type}/${page}`;
	const urlTv = `https://vidsrc.to/vapi/tv/${type}/${page}`;

	try {
		const responseMovies = await fetch(urlMovies);
		const responseTv = await fetch(urlTv);

		if (!responseMovies.ok || !responseTv.ok) {
			throw new Error(
				`HTTP error! status: ${responseMovies.status}, ${responseTv.status}`
			);
		}

		const dataMovies = await responseMovies.json();
		const dataTv = await responseTv.json();
		return { dataMovies, dataTv };
	} catch (error) {
		console.error("Error fetching movie or TV info:", error);
		return { dataMovies: null, dataTv: null };
	}
}
