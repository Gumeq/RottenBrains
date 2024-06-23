export type IMedia = {
	id: number;
	created_at: string;
	creator: string;
	rating: number;
	title: string;
	name: string;
	vote_average: number;
	poster_path: string;
	overview: string;
	release_date: string;
	media_type: "movie" | "tv" | string;
	first_air_date: string;
};

export interface FilterProps {
	name: string;
}

export type IUser = {
	id: number;
	name: string;
	username: string;
	email: string;
	imageURL: string;
	postsId: Array<number>;
	likes: Array<string>;
	saves: Array<string>;
};
export type IPost = {
	id: number;
	created_at: string;
	mediaId: number;
	media_type: string;
	vote_user: number;
	review_user: string;
	creatorId: number;
	comments: Array<string>;
	likes: Array<string>;
	saves: Array<string>;
};

export type INavLink = {
	imgURL: string;
	route: string;
	label: string;
};
export type ExploreTabProps = {
	action: "Now_in_cinemas" | "Trending_TV" | "Popular_Today" | "Airing_Today";
};
export type MediaPageProps = {
	media_type: "movie" | "tv" | string;
	media_id: number;
};
