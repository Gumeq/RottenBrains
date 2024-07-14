"use client";

import Loader from "@/components/Loader";
import HomePostCard from "@/components/post/HomePostCard";
import { IPost } from "@/types";
import { getSavedPosts, getUserPosts } from "@/utils/supabase/queries";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const Tabs: React.FC<any> = ({ user }) => {
	const [activeTab, setActiveTab] = useState("posts");
	const [userPosts, setUserPosts] = useState<any[]>([]);
	const [savedUserPosts, setSavedUserPosts] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [likePage, setLikePage] = useState<number>(0); // Use state for likePage

	const { ref, inView } = useInView();
	user = user.user;

	useEffect(() => {
		const loadMore = async () => {
			if (inView && hasMore && !loading) {
				setLoading(true);
				try {
					console.log("loadMore");
					const res = await getUserPosts(user.id, likePage);
					console.log(res);
					if (res.length === 0) {
						setHasMore(false); // No more posts to load
					} else {
						setUserPosts((prevData) => [...prevData, ...res]);
						setLikePage((prevPage) => prevPage + 1); // Increment page state
					}
				} catch (error) {
					console.error("Error fetching posts:", error);
				} finally {
					setLoading(false);
				}
			}
		};

		loadMore();
	}, [inView, hasMore, loading, user.id, activeTab]); // Include likePage in dependency array

	const renderContent = () => {
		switch (activeTab) {
			case "posts":
				return (
					<div className="w-full">
						{userPosts.length > 0 && (
							<div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 justify-items-center gap-4 px-2">
								{userPosts.map((post: IPost) => (
									<div key={post.id} className="">
										<HomePostCard post={post} />
									</div>
								))}
							</div>
						)}
						{loading && <Loader></Loader>}
						{!loading && hasMore && <div ref={ref}></div>}
						{!hasMore && <div>No more posts to load.</div>}
					</div>
				);
			case "likes":
				return <div>likes</div>;
			case "saves":
				return (
					<div className="w-full bg-blue-500">
						{/* <div className="w-full bg-green-500">
							{savedUserPosts.length > 0 && (
								<div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 justify-items-center gap-4 px-2">
									{savedUserPosts.map((post: IPost) => (
										<div key={post.id} className="">
											<HomePostCard post={post} />
										</div>
									))}
								</div>
							)}
						</div> */}
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className="w-screen max-w-7xl">
			<div className="flex justify-around border-b">
				<button
					className={`py-2 px-4 w-full ${
						activeTab === "posts" ? "border-b-2 border-accent " : ""
					}`}
					onClick={() => setActiveTab("posts")}
				>
					Posts
				</button>
				<button
					className={`py-2 px-4 w-full ${
						activeTab === "likes" ? "border-b-2 border-accent" : ""
					}`}
					onClick={() => setActiveTab("likes")}
				>
					Likes
				</button>
				<button
					className={`py-2 px-4 w-full ${
						activeTab === "saves" ? "border-b-2 border-accent" : ""
					}`}
					onClick={() => setActiveTab("saves")}
				>
					Saves
				</button>
			</div>
			<div className="mt-4">{renderContent()}</div>
		</div>
	);
};

export default Tabs;
