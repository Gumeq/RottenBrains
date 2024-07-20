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

	const [liked, setLiked] = useState(false);
	const [likes, setLikes] = useState<number>(0);
	const [animate, setAnimate] = useState(false); // State to handle animation class

	const [isOpen, setIsOpen] = useState(false);
	const [comments, setComments] = useState<any[]>([]);
	const [commentCount, setCommentCount] = useState<number>(0);

	const [loading, setLoading] = useState(true);

	const userId = user?.id.toString();

	const handleLike = useCallback(async () => {
		if (userId && user) {
			setLiked((prevLiked) => !prevLiked); // Optimistic update
			setAnimate(true); // Trigger the animation
			try {
				if (liked) {
					await removeLike(userId, postId);
				} else {
					await likePost(userId, postId);
				}
			} catch (error) {
				setLiked((prevLiked) => !prevLiked); // Revert if there's an error
				console.error("Error toggling like:", error);
			}
		}
	}, [userId, post, liked]);

	useEffect(() => {
		if (userId) {
			const fetchData = async () => {
				const isPostLiked = await getLikedStatus(userId, postId);
				setLiked(isPostLiked);
			};
			fetchData();
		}
	}, [userId, postId]);

	useEffect(() => {
		if (animate) {
			const timer = setTimeout(() => setAnimate(false), 300); // Remove the animation class after animation
			return () => clearTimeout(timer);
		}
	}, [animate]);

	useEffect(() => {
		// Fetch initial data
		const getComments = async () => {
			const { data, error } = await supabase
				.from("posts")
				.select("total_comments")
				.eq("id", postId)
				.single();

			if (error) {
				console.error("Error fetching post likes:", error);
			} else {
				setCommentCount(data.total_comments || 0);
			}
		};

		const getLikes = async () => {
			const { data, error } = await supabase
				.from("posts")
				.select("total_likes")
				.eq("id", postId)
				.single();

			if (error) {
				console.error("Error fetching post likes:", error);
			} else {
				setLikes(data.total_likes || 0);
			}
		};

		getComments();
		getLikes();

		// Subscribe to real-time updates
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
					console.log(payload);
					if (payload.new.total_likes !== likes) {
						setLikes(payload.new.total_likes);
					}
					if (payload.new.total_comments !== commentCount) {
						setCommentCount(payload.new.total_comments);
					}
					setComments(payload.new.total_comments);
				}
			)
			.subscribe();

		// Cleanup subscription on component unmount
		return () => {
			supabase.removeChannel(channel);
		};
	}, [post, comments, likes]);

	useEffect(() => {
		const fetchComments = async () => {
			const comments = await getPostComments(postId);
			setComments(comments);
			setLoading(false);
		};
		fetchComments();
		const channel = supabase
			.channel(`public:comments:post_id=eq.${postId}`)
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "comments",
					filter: `post_id=eq.${postId}`,
				},
				(payload) => {
					setComments((prevData) => [prevData, payload.new]);
				}
			)
			.subscribe();

		// Cleanup subscription on component unmount
		return () => {
			supabase.removeChannel(channel);
		};
	}, [isOpen, comments]);

	const togglePopup = () => {
		setIsOpen(!isOpen);
	};

	if (!userId) {
		return null; // Return null if user ID isn't available
	}

	return (
		<div className="flex flex-row gap-4 items-center">
			<div className="flex flex-row items-center gap-2">
				<button onClick={handleLike} className={animate ? "pop" : ""}>
					{liked ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
							width="30"
							height="30"
							className={`heart-icon ${
								animate ? "pop" : ""
							} fill-accent `}
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
								animate ? "pop" : ""
							}`}
						/>
					)}
				</button>
				<p className="opacity-50 font-bold text-xl">{likes}</p>
			</div>
			<div className="flex flex-row items-center gap-2">
				<div>
					<button
						onClick={togglePopup}
						className="text-foreground opacity-50 "
					>
						<img
							src="/assets/icons/comment-regular.svg"
							alt=""
							width={30}
							height={30}
							className="invert-on-dark min-h-[30px] min-w-[30px] max-h-[30px] max-w-[30px] -mb-2"
						/>
					</button>
					<div>
						{isOpen && (
							<div className="fixed inset-0 flex justify-center bg-black bg-opacity-50 z-50 ">
								<div className="relative bg-background p-4 rounded-lg shadow-lg w-screen md:max-w-4xl md:h-auto md:max-h-[80%] max-h-[90%]">
									<button
										onClick={togglePopup}
										className="absolute top-2 right-2 bg-accent text-white px-4 py-2 rounded-md"
									>
										Close
									</button>
									<div className="flex flex-col overflow-y-auto h-3/4">
										{loading ? (
											<div className="flex justify-center items-center h-full">
												<span>Loading...</span>
											</div>
										) : comments.length === 0 ? (
											<div className="flex justify-center items-center h-full">
												<span>No comments yet</span>
											</div>
										) : (
											<div className="w-full">
												{comments.map((comment) => (
													<div
														key={comment.id}
														className="w-full"
													>
														<CommentCard
															comment={comment}
														/>
													</div>
												))}
											</div>
										)}
									</div>
									<div className="absolute w-11/12 bottom-6 ">
										<AddComment post={post} user={user} />
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
				<p className="opacity-50 font-bold text-xl">{commentCount}</p>
			</div>
		</div>
	);
};

export default PostStats;
