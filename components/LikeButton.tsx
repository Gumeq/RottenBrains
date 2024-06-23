"use client";

import fetchUserData from "@/utils/clientFunctions/fetchUserData";
import {
	getLikedStatus,
	likePost,
	removeLike,
} from "@/utils/clientFunctions/updatePostData";
import Image from "next/image";
// SaveButton.tsx
import { useEffect, useState } from "react";

interface SaveButtonProps {
	postId: string;
}

const LikeButton: React.FC<SaveButtonProps> = ({ postId }) => {
	const [liked, setLiked] = useState(false);

	const user = fetchUserData();
	let userId: string;
	if (user) {
		userId = user.id;
	}

	const handleSave = async () => {
		if (userId) {
			try {
				if (liked) {
					await removeLike(userId!, postId); // Assuming userId is defined when saved is true
				} else {
					await likePost(userId!, postId); // Assuming userId is defined when saved is false
				}
				setLiked(!liked); // Toggle saved state
			} catch (error) {
				console.error("Error saving or removing save:", error);
			}
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			if (user) {
				const isPostSaved = await getLikedStatus(user.id, postId); // Assuming getSavedStatus is asynchronous
				setLiked(isPostSaved);
			}
		};

		fetchData();
	}, [postId, handleSave]);

	if (userId! === null) {
		return null; // Return null or a loading indicator until user data is fetched
	}

	return (
		<button onClick={handleSave}>
			{liked ? (
				<Image
					src={"/assets/icons/heart-solid.svg"}
					alt=""
					width={30}
					height={30}
					className="invert-on-dark"
				></Image>
			) : (
				<Image
					src={"/assets/icons/heart-regular.svg"}
					alt=""
					width={30}
					height={30}
					className="invert-on-dark"
				></Image>
			)}
		</button>
	);
};

export default LikeButton;
