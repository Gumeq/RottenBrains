"use client";

import { useUser } from "@/context/UserContext";
import {
	getLikedStatus,
	likePost,
	removeLike,
} from "@/utils/clientFunctions/updatePostData";
import { createClient } from "@/utils/supabase/client";
import { getPostComments } from "@/utils/supabase/queries";
import { useCallback, useEffect, useState } from "react";
import AddComment from "./AddComment";
import CommentCard from "./CommentCard";

const PostStats = ({ post, user }: any) => {
	const postId = post.id;
	const supabase = createClient();
	const [state, setState] = useState({
		liked: false,
		likes: 0,
		animate: false,
		isOpen: false,
		comments: [],
		commentCount: 0,
		loading: true,
	});
	const userId = user?.id.toString();

	const handleLike = useCallback(async () => {
		if (userId && user) {
			setState((prevState) => ({
				...prevState,
				liked: !prevState.liked,
				animate: true,
			}));

			try {
				if (state.liked) {
					await removeLike(userId, postId);
				} else {
					await likePost(userId, postId);
				}
			} catch (error) {
				setState((prevState) => ({
					...prevState,
					liked: !prevState.liked,
					animate: false,
				}));
				console.error("Error toggling like:", error);
			}
		}
	}, [userId, postId, state.liked]);

	useEffect(() => {
		if (userId) {
			const fetchData = async () => {
				const isPostLiked = await getLikedStatus(userId, postId);
				setState((prevState) => ({
					...prevState,
					liked: isPostLiked,
				}));
			};
			fetchData();
		}
	}, [userId, postId]);

	useEffect(() => {
		if (state.animate) {
			const timer = setTimeout(() => {
				setState((prevState) => ({ ...prevState, animate: false }));
			}, 300);
			return () => clearTimeout(timer);
		}
	}, [state.animate]);

	useEffect(() => {
		const fetchPostData = async () => {
			try {
				const [commentsRes, likesRes] = await Promise.all([
					supabase
						.from("posts")
						.select("total_comments")
						.eq("id", postId)
						.single(),
					supabase
						.from("posts")
						.select("total_likes")
						.eq("id", postId)
						.single(),
				]);

				setState((prevState) => ({
					...prevState,
					commentCount: commentsRes.data?.total_comments || 0,
					likes: likesRes.data?.total_likes || 0,
				}));
			} catch (error) {
				console.error("Error fetching post data:", error);
			}
		};

		fetchPostData();

		const channel = supabase
			.channel(`public:posts:id=eq.${postId}`)
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "posts",
					filter: `id=eq.${postId}`,
				},
				(payload) => {
					setState((prevState) => ({
						...prevState,
						likes: payload.new.total_likes,
						commentCount: payload.new.total_comments,
					}));
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [postId, supabase]);

	const fetchComments = async () => {
		try {
			const comments = await getPostComments(postId);
			setState((prevState) => ({
				...prevState,
				comments,
				loading: false,
			}));
		} catch (error) {
			console.error("Error fetching comments:", error);
			setState((prevState) => ({
				...prevState,
				loading: false,
			}));
		}
	};

	const togglePopup = async () => {
		setState((prevState) => ({ ...prevState, isOpen: !prevState.isOpen }));

		if (!state.isOpen) {
			setState((prevState) => ({ ...prevState, loading: true }));
			await fetchComments();
		}
	};

	if (!userId) {
		return null;
	}

	return (
		<div className="flex flex-row gap-4 items-center">
			<div className="flex flex-row items-center gap-2">
				<button
					onClick={handleLike}
					className={state.animate ? "pop" : ""}
				>
					{state.liked ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
							width="30"
							height="30"
							className={`heart-icon ${
								state.animate ? "pop" : ""
							} fill-accent`}
						>
							<path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
						</svg>
					) : (
						<img
							src={"/assets/icons/heart-regular.svg"}
							alt="Not Liked"
							width={30}
							height={30}
							className={`heart-icon invert-on-dark opacity-50 ${
								state.animate ? "pop" : ""
							}`}
						/>
					)}
				</button>
				<p className="opacity-50 font-bold text-xl">{state.likes}</p>
			</div>
			<div className="flex flex-row items-center gap-2">
				<div>
					<button
						onClick={togglePopup}
						className="text-foreground opacity-50"
					>
						<img
							src="/assets/icons/comment-regular.svg"
							alt="Comment"
							width={30}
							height={30}
							className="invert-on-dark min-h-[30px] min-w-[30px] max-h-[30px] max-w-[30px] -mb-2"
						/>
					</button>
					{state.isOpen && (
						<div className="fixed inset-0 flex justify-center bg-black bg-opacity-50 z-50">
							<div className="relative bg-background p-4 rounded-lg shadow-lg w-screen md:max-w-4xl md:h-auto md:max-h-[80%] max-h-[90%]">
								<button
									onClick={togglePopup}
									className="absolute top-2 right-2 bg-accent text-white px-4 py-2 rounded-md"
								>
									Close
								</button>
								<div className="flex flex-col overflow-y-auto h-3/4">
									{state.loading ? (
										<div className="flex justify-center items-center h-full">
											<span>Loading...</span>
										</div>
									) : state.comments?.length === 0 ? (
										<div className="flex justify-center items-center h-full">
											<span>No comments yet</span>
										</div>
									) : (
										<div className="w-full">
											{state.comments.map(
												(comment: any) => (
													<div
														key={comment.id}
														className="w-full"
													>
														<CommentCard
															comment={comment}
														/>
													</div>
												)
											)}
										</div>
									)}
								</div>
								<div className="absolute w-11/12 bottom-6">
									<AddComment
										post={post}
										user={user}
										fetchComments={fetchComments}
									/>
								</div>
							</div>
						</div>
					)}
				</div>
				<p className="opacity-50 font-bold text-xl">
					{state.commentCount}
				</p>
			</div>
		</div>
	);
};

export default PostStats;
