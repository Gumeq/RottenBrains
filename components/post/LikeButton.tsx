"use client";

import fetchUserData from "@/utils/clientFunctions/fetchUserData";
import {
	getLikedStatus,
	likePost,
	removeLike,
} from "@/utils/clientFunctions/updatePostData";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface SaveButtonProps {
	postId: string;
}

const LikeButton: React.FC<SaveButtonProps> = ({ postId }) => {
	const [liked, setLiked] = useState(false);
	const [animate, setAnimate] = useState(false); // State to handle animation class
	const user = fetchUserData();
	const userId = user?.id;

	const handleLike = useCallback(async () => {
		if (userId) {
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
				<Image
					src={"/assets/icons/heart-solid.svg"}
					alt="Liked"
					width={30}
					height={30}
					className={`heart-icon ${animate ? "pop" : ""}`}
				/>
			) : (
				<Image
					src={"/assets/icons/heart-regular.svg"}
					alt="Not Liked"
					width={30}
					height={30}
					className={`heart-icon ${animate ? "pop" : ""}`}
				/>
			)}
		</button>
	);
};

export default LikeButton;
