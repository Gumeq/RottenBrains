"use client";
import Loader from "@/components/Loader";
import HomePostCard from "@/components/post/HomePostCard";
import { useUser } from "@/context/UserContext";
import { IPost } from "@/types";
import { getPostsFromFollowedUsers } from "@/utils/supabase/serverQueries";
import { fetchFromApi } from "@/utils/tmdb/tmdbApi";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import FollowUsers from "./FollowUsers";
import HomePostCardNew from "@/components/post/HomePostCardNew";

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
					const res = await getPostsFromFollowedUsers(
						user.id.toString(),
						page
					);
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
		<div className=" ">
			<div className="grid grid-cols-1 justify-items-center gap-4 px-2">
				{data.map((post: any, index: number) => (
					<div className="" key={index}>
						<HomePostCardNew post={post} />
					</div>
				))}
			</div>
			{loading && <Loader></Loader>}
			{!loading && hasMore && <div ref={ref}></div>}
			{!hasMore && (
				<div className="w-full flex flex-col items-center justify-center my-4 text-lg">
					<div>
						Follow more people to get more posts on the Home page!
					</div>
					<FollowUsers></FollowUsers>
				</div>
			)}
		</div>
	);
};

export default LoadMore;
