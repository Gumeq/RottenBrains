"use client";
import Loader from "@/components/Loader";
import HomePostCard from "@/components/post/HomePostCard";
import { IPost } from "@/types";
import { getPostsFromFollowedUsers } from "@/utils/supabase/serverQueries";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

let page = 1;

const LoadMore = ({ user }: any) => {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const { ref, inView } = useInView();

	useEffect(() => {
		const loadMore = async () => {
			if (inView && hasMore && !loading) {
				setLoading(true);
				try {
					console.log("loadMore");
					const res = await getPostsFromFollowedUsers(
						user?.user.id,
						page
					);
					console.log(res);
					if (res.length === 0) {
						setHasMore(false); // No more posts to load
					} else {
						setData((prevData) => [...prevData, ...res]);
						page++;
					}
				} catch (error) {
					console.error("Error fetching posts:", error);
				} finally {
					setLoading(false);
				}
			}
		};

		loadMore();
	}, [inView, hasMore, loading, user?.user.id]);

	return (
		<div className="">
			<div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 justify-items-center gap-4 px-2">
				{data.map((post: IPost, index: number) => (
					<div className="" key={post.id}>
						<HomePostCard post={post} index={index} />
					</div>
				))}
			</div>
			{loading && <Loader></Loader>}
			{!loading && hasMore && <div ref={ref}>Load More</div>}
			{!hasMore && <div>No more posts to load.</div>}
		</div>
	);
};

export default LoadMore;
