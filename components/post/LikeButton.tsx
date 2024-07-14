"use client";

import { useUser } from "@/context/UserContext";
import fetchUserData from "@/utils/clientFunctions/fetchUserData";
import {
	getLikedStatus,
	likePost,
	removeLike,
} from "@/utils/clientFunctions/updatePostData";
// import { addToFavorites } from "@/utils/tmdb/tmdbApi";
import { useCallback, useEffect, useState } from "react";

interface SaveButtonProps {
	postId: string;
}

const LikeButton: React.FC<any> = ({ post }) => {
	const postId = post.id;
	const [liked, setLiked] = useState(false);
	const [animate, setAnimate] = useState(false); // State to handle animation class
	const { user } = useUser();
	const userId = user?.id.toString();

	const handleLike = useCallback(async () => {
		if (userId && user) {
			setLiked((prevLiked) => !prevLiked); // Optimistic update
			setAnimate(true); // Trigger the animation
			// const accountId = user.tmdb_id;
			// console.log(accountId);
			// const sessionId = localStorage.getItem("session_id");
			// console.log(sessionId);
			// console.log(post.mediaid);
			// console.log(post.media_type);
			try {
				if (liked) {
					await removeLike(userId, postId);
					// if (sessionId) {
					// 	await addToFavorites(
					// 		accountId,
					// 		sessionId,
					// 		post.media_type,
					// 		post.mediaid,
					// 		false
					// 	);
					// }
				} else {
					await likePost(userId, postId);
					// if (sessionId) {
					// 	await addToFavorites(
					// 		accountId,
					// 		sessionId,
					// 		post.media_type,
					// 		post.mediaid,
					// 		true
					// 	);
					// }
				}
			} catch (error) {
				setLiked((prevLiked) => !prevLiked); // Revert if there's an error
				console.error("Error toggling like:", error);
			}
		}
	}, [userId, postId, liked]);

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

	if (!userId) {
		return null; // Return null if user ID isn't available
	}

	return (
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
	);
};

export default LikeButton;
