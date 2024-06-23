import { IMedia, IPost } from "@/types";
import { createClient } from "@supabase/supabase-js";
import { createClient as CreateClientServer } from "@/utils/supabase/server";

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function addToDB(movie: IMedia) {
	const {
		id,
		created_at,
		creator,
		rating,
		title,
		vote_average,
		poster_path,
		overview,
		release_date,
	} = movie;
	const { data, error } = await supabase
		.from("Posts")
		.insert([
			{
				creator: creator,
				rating: rating,
				title: title,
				poster_path: poster_path,
				overview: overview,
				release_date: release_date,
			},
		])
		.select();
	console.log("Created");
	return;
}

export async function addUserToDB(
	email: string,
	username: string,
	name: string
) {
	const { data, error } = await supabase
		.from("users")
		.insert([
			{
				username: username,
				name: name,
				email: email,
			},
		])
		.select();

	return;
}

export async function getUserFromDB(id: string) {
	let { data: user, error } = await supabase
		.from("users")
		.select()
		.eq("id", id)
		.single();

	if (error) {
		console.error("Error fetching user from DB:", error.message);
		return null; // or handle the error as needed
	}

	return { user };
}

export async function getCurrentUser() {
	try {
		const supabase = CreateClientServer();
		const {
			data: { user: supabaseUser },
		} = await supabase.auth.getUser();

		if (supabaseUser) {
			const dbUser = await getUserFromDB(supabaseUser.id);
			const currentAccount = dbUser;
			return currentAccount;
		}
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function addPostToDB(post: IPost) {
	const { data, error } = await supabase
		.from("Posts")
		.insert([
			{
				movieId: post.mediaId,
				vote_user: post.vote_user,
				review_user: post.review_user,
				creatorId: post.creatorId,
			},
		])
		.select();
	console.log("Created");
	return;
}

export const getSavedPosts = async (userId: string) => {
	const { data, error } = await supabase
		.from("saves")
		.select(`post_id(*)`) // Type assertion to any
		.eq("user_id", userId)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching saved posts:", error.message);
		return null;
	}

	return data;
};

export const getPostsOfMedia = async (mediaid: number, media_type: string) => {
	const { data, error } = await supabase
		.from("posts")
		.select("*") // Type assertion to any
		.eq("mediaid", mediaid)
		.eq("media_type", media_type)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching saved posts:", error.message);
		return null;
	}

	return data;
};
