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
	const postId = post.post_id;
	const supabase = createClient();
	const [state, setState] = useState({
		liked: post.has_liked,
		likes: post.total_likes,
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
							height="30px"
							viewBox="0 -960 960 960"
							width="30px"
							fill="0000000"
							className={`heart-icon ${
								state.animate ? "pop" : ""
							} fill-accent`}
						>
							<path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z" />
						</svg>
					) : (
						<img
							src={"/assets/icons/heart-outline.svg"}
							alt="Not Liked"
							width={30}
							height={30}
							className={`heart-icon invert-on-dark ${
								state.animate ? "pop" : ""
							}`}
						/>
					)}
				</button>
				<p className="font-bold text-xl">{state.likes}</p>
			</div>
			<div className="flex flex-row items-center gap-2">
				<div>
					<button onClick={togglePopup} className="text-foreground">
						<img
							src="/assets/icons/comment-outline.svg"
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
				<p className="font-bold text-xl">{state.commentCount}</p>
			</div>
		</div>
	);
};

export default PostStats;
