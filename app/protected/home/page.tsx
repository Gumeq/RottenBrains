import HomePostCard from "@/components/post/HomePostCard";
import { IPost } from "@/types";
import fetchUserData from "@/utils/clientFunctions/fetchUserData";
import {} from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";
import {
	getCurrentUser,
	getPostsFromFollowedUsers,
} from "@/utils/supabase/serverQueries";
import LoadMore from "./LoadMore";
import Loader from "@/components/Loader";

// Server component fetching and displaying posts
const PostsPage = async () => {
	const user = await getCurrentUser();
	let posts;
	if (user) {
		posts = await getPostsFromFollowedUsers(user?.user.id, 0);
	}
	if (posts && posts?.length <= 0) {
		return <div className="container mx-auto p-4">No posts available.</div>;
	}

	return (
		<div className="max-w-6xl w-full mx-auto px-2">
			<h1 className="text-2xl font-bold my-4"></h1>
			{/* {posts && posts.length > 0 ? (
				<div>
					<div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 justify-items-center gap-4 px-2">
						{posts.map((post: IPost, index: number) => (
							<div className="">
								<HomePostCard post={post} index={index} />
							</div>
						))}
					</div>
					<br />
					<LoadMore user={user}></LoadMore>
				</div>
			) : (
				<div>
					<p>
						Start Following more people to get more Posts in the
						Home Page
					</p>
				</div>
			)} */}
			<LoadMore user={user}></LoadMore>
		</div>
	);
};

export default PostsPage;
