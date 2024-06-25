import HomePostCard from "@/components/HomePostCard";
import { IPost } from "@/types";
import fetchUserData from "@/utils/clientFunctions/fetchUserData";
import {
	getCurrentUser,
	getPostsFromFollowedUsers,
} from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";

// Server component fetching and displaying posts
const PostsPage = async () => {
	const user = await getCurrentUser();
	let posts;
	if (user) {
		posts = await getPostsFromFollowedUsers(user?.user.id);
	}
	if (posts && posts?.length <= 0) {
		return <div className="container mx-auto p-4">No posts available.</div>;
	}

	return (
		<div className="max-w-6xl w-screen mx-auto">
			<h1 className="text-2xl font-bold my-4"></h1>
			{posts && posts.length > 0 ? (
				<div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 justify-items-center ">
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
