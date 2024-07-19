"use client";

import Loader from "@/components/Loader";
import HomePostCard from "@/components/post/HomePostCard";
import { IPost } from "@/types";
import {
	getSavedPosts,
	getUserLikedPosts,
	getUserPosts,
	getUserSavedPosts,
} from "@/utils/supabase/queries";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const Tabs: React.FC<any> = ({ user }) => {
	const [activeTab, setActiveTab] = useState("posts");

	const [userPosts, setUserPosts] = useState<any[]>([]);
	const [loadingPosts, setLoadingPosts] = useState<boolean>(false);
	const [hasMorePosts, setHasMorePosts] = useState<boolean>(true);
	const [postPage, setPostPage] = useState<number>(0); // Use state for likePage
	const { ref: refPosts, inView: inViewPosts } = useInView();

	const [userLikes, setUserLikes] = useState<any[]>([]);
	const [likesPage, setLikesPage] = useState<number>(0); // Use state for likePage
	const [hasMoreLikes, setHasMoreLikes] = useState<boolean>(true);
	const [loadingLikes, setLoadingLikes] = useState<boolean>(false);
	const { ref: refLikes, inView: inViewLikes } = useInView();

	const [userSaves, setUserSaves] = useState<any[]>([]);
	const [savesPage, setSavesPage] = useState<number>(0); // Use state for likePage
	const [hasMoreSaves, setHasMoreSaves] = useState<boolean>(true);
	const [loadingSaves, setLoadingSaves] = useState<boolean>(false);
	const { ref: refSaves, inView: inViewSaves } = useInView();

	user = user.user;

	useEffect(() => {
		const loadMore = async () => {
			if (inViewPosts && hasMorePosts && !loadingPosts && user) {
				setLoadingPosts(true);
				try {
					const res = await getUserPosts(
						user.id.toString(),
						postPage
					);
					if (res.length === 0) {
						setHasMorePosts(false); // No more posts to load
					} else {
						setUserPosts((prevData) => [...prevData, ...res]);
						setPostPage((prevPage) => prevPage + 1); // Increment page state
					}
				} catch (error) {
					console.error("Error fetching posts:", error);
				} finally {
					setLoadingPosts(false);
				}
			}
		};

		loadMore();
	}, [inViewPosts, hasMorePosts, loadingPosts, user, postPage]); // Include likePage in dependency array

	useEffect(() => {
		const loadMore = async () => {
			if (inViewLikes && hasMoreLikes && !loadingLikes && user) {
				setLoadingLikes(true);
				try {
					const res = await getUserLikedPosts(
						user.id.toString(),
						likesPage
					);
					if (res.length === 0) {
						setHasMoreLikes(false); // No more posts to load
					} else {
						setUserLikes((prevData) => [...prevData, ...res]);
						setLikesPage((prevPage) => prevPage + 1); // Increment page state
					}
				} catch (error) {
					console.error("Error fetching posts:", error);
				} finally {
					setLoadingLikes(false);
				}
			}
		};
		loadMore();
	}, [inViewLikes, hasMoreLikes, loadingLikes, user, likesPage]);

	useEffect(() => {
		const loadMore = async () => {
			if (inViewSaves && hasMoreSaves && !loadingSaves && user) {
				setLoadingSaves(true);
				try {
					const res = await getUserSavedPosts(
						user.id.toString(),
						savesPage
					);
					if (res.length === 0) {
						setHasMoreSaves(false); // No more posts to load
					} else {
						console.log(res);
						setUserSaves((prevData) => [...prevData, ...res]);
						setSavesPage((prevPage) => prevPage + 1); // Increment page state
					}
				} catch (error) {
					console.error("Error fetching posts:", error);
				} finally {
					setLoadingSaves(false);
				}
			}
		};
		loadMore();
	}, [inViewSaves, hasMoreSaves, loadingSaves, user, savesPage]);

	const renderContent = () => {
		switch (activeTab) {
			case "posts":
				return (
					<div className="w-full">
						{userPosts.length > 0 && (
							<div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 justify-items-center gap-4 px-2">
								{userPosts.map((post: IPost) => (
									<div key={post.id}>
										<HomePostCard post={post} />
									</div>
								))}
							</div>
						)}
						{loadingPosts && <Loader></Loader>}
						{!loadingPosts && hasMorePosts && (
							<div ref={refPosts}></div>
						)}
						{!hasMorePosts && <div>No more posts to load.</div>}
					</div>
				);
			case "likes":
				return (
					<div className="w-full">
						{userLikes.length > 0 && (
							<div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 justify-items-center gap-4 px-2">
								{userLikes.map((post: any) => (
									<div>
										<HomePostCard post={post.posts} />
									</div>
								))}
							</div>
						)}
						{loadingLikes && <Loader></Loader>}
						{!loadingLikes && hasMoreLikes && (
							<div ref={refLikes}></div>
						)}
						{!hasMoreLikes && <div>No more posts to load.</div>}
					</div>
				);
			case "saves":
				return (
					<div className="w-full">
						{userSaves.length > 0 && (
							<div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 justify-items-center gap-4 px-2">
								{userSaves.map((post: any) => (
									<div>
										<HomePostCard post={post.posts} />
									</div>
								))}
							</div>
						)}
						{loadingSaves && <Loader></Loader>}
						{!loadingSaves && hasMoreSaves && (
							<div ref={refSaves}></div>
						)}
						{!hasMoreSaves && <div>No more posts to load.</div>}
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
