import HomePostCard from "@/components/HomePostCard";
import { IPost } from "@/types";
import { getCurrentUser } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";

const fetchPosts = async (): Promise<IPost[] | null> => {
	const supabaseServerClient = createClient();
	const user = await getCurrentUser();
	let { data: posts, error } = await supabaseServerClient
		.from("posts")
		.select("*")
		.not("creatorid", "eq", user?.user.id)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching posts:", error.message);
		return null;
	}

	return posts;
};

// Server component fetching and displaying posts
const PostsPage = async () => {
	const posts = await fetchPosts();

	if (!posts) {
		return <div className="container mx-auto p-4">No posts available.</div>;
	}

	return (
		<div className="max-w-6xl mx-auto">
			<h1 className="text-2xl font-bold my-4">Home</h1>
			{posts.length > 0 ? (
				<div className="flex flex-col md:flex-row gap-4 flex-wrap">
					{posts.map((post: IPost) => (
						<div>
							<HomePostCard post={post} />
						</div>
					))}
				</div>
			) : (
				<p>No posts available.</p>
			)}
		</div>
	);
};

export default PostsPage;
