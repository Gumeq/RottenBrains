import {
	getCurrentUser,
	getPostsFromFollowedUsers,
} from "@/utils/supabase/serverQueries";
import LoadMore from "./LoadMore";

// Server component fetching and displaying posts
const PostsPage = async () => {
	return (
		<div className="max-w-6xl w-full mx-auto px-2">
			<h1 className="text-2xl font-bold my-4"></h1>
			<LoadMore></LoadMore>
		</div>
	);
};

export default PostsPage;
