"use client";
import Loader from "@/components/Loader";
import HomePostCard from "@/components/post/HomePostCard";
import { useUser } from "@/context/UserContext";
import { IPost } from "@/types";
import { getPostsFromFollowedUsers } from "@/utils/supabase/serverQueries";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const LoadMore = () => {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [page, setPage] = useState<number>(0);
	const { ref, inView } = useInView();
	const { user } = useUser();

	useEffect(() => {
		const loadMore = async () => {
			if (inView && hasMore && !loading && user?.id) {
				setLoading(true);
				try {
					console.log("loadMore");
					const res = await getPostsFromFollowedUsers(
						user.id.toString(),
						page
					);
					console.log(res);
					if (res.length === 0) {
						setHasMore(false); // No more posts to load
					} else {
						setData((prevData) => [...prevData, ...res]);
						setPage((prevPage) => prevPage + 1);
					}
				} catch (error) {
					console.error("Error fetching posts:", error);
				} finally {
					setLoading(false);
				}
			}
		};

		loadMore();
	}, [inView, hasMore, loading, user?.id, page]);

	return (
		<div className="">
			<div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 justify-items-center gap-4 px-2">
				{data.map((post: IPost, index: number) => (
					<div className="" key={post.id}>
						<HomePostCard post={post} />
					</div>
				))}
			</div>
			{loading && <Loader></Loader>}
			{!loading && hasMore && <div ref={ref}></div>}
			{!hasMore && <div>No more posts to load.</div>}
		</div>
	);
};

export default LoadMore;
