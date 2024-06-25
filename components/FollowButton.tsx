"use client";

import fetchUserData from "@/utils/clientFunctions/fetchUserData";
import {
	followUser,
	getFollowStatus,
	unFollowUser,
} from "@/utils/clientFunctions/updateFollowingData";
import {
	getLikedStatus,
	likePost,
	removeLike,
} from "@/utils/clientFunctions/updatePostData";
import Image from "next/image";
// SaveButton.tsx
import { useEffect, useState } from "react";

interface SaveButtonProps {
	user_to_follow_id: string;
}

const FollowButton: React.FC<SaveButtonProps> = ({ user_to_follow_id }) => {
	const [followed, setFollowed] = useState(false);

	const user = fetchUserData();
	let userId: string;
	if (user) {
		userId = user.id;
	}

	const handleFollow = async () => {
		if (userId) {
			try {
				if (followed) {
					await unFollowUser(userId!, user_to_follow_id);
				} else {
					await followUser(userId!, user_to_follow_id);
				}
				setFollowed(!followed);
			} catch (error) {
				console.error("Error following or unfollowing user:", error);
			}
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			if (user) {
				const isUserFollowed = await getFollowStatus(
					user.id,
					user_to_follow_id
				); // Assuming getSavedStatus is asynchronous
				setFollowed(isUserFollowed);
			}
		};

		fetchData();
	}, [user_to_follow_id, handleFollow]);

	if (userId! === null) {
		return null; // Return null or a loading indicator until user data is fetched
	}

	return (
		<button onClick={handleFollow}>
			{followed ? (
				<div className="px-8 py-2 bg-foreground/20 rounded-full">
					UnFollow
				</div>
			) : (
				<div className="px-8 py-2 bg-foreground/20 rounded-full">
					Follow
				</div>
			)}
		</button>
	);
};

export default FollowButton;
