"use client";
import { useUser } from "@/context/UserContext";
import fetchUserData from "@/utils/clientFunctions/fetchUserData";
import {
	getSavedStatus,
	removeSave,
	savePost,
} from "@/utils/clientFunctions/updatePostData";
import { useCallback, useEffect, useState } from "react";

const SaveButton: React.FC<any> = ({ post }: any) => {
	const [saved, setSaved] = useState<boolean>(post.has_saved);
	const { user } = useUser();
	const postId = post.post_id;
	const userId = user?.id.toString();

	const handleSave = useCallback(async () => {
		if (userId) {
			setSaved((prevSaved) => !prevSaved); // Optimistic update
			try {
				if (saved) {
					await removeSave(userId, postId);
				} else {
					await savePost(userId, postId);
				}
			} catch (error) {
				setSaved((prevSaved) => !prevSaved); // Revert if there's an error
				console.error("Error saving or removing save:", error);
			}
		}
	}, [userId, postId, saved]);

	if (!userId) {
		return null; // Return null if user ID isn't available
	}

	return (
		<button onClick={handleSave}>
			{saved ? (
				<img
					src={"/assets/icons/bookmark-solid.svg"}
					alt="Saved"
					width={20}
					height={20}
					className="invert-on-dark opacity-50"
				/>
			) : (
				<img
					src={"/assets/icons/bookmark-regular.svg"}
					alt="Not Saved"
					width={20}
					height={20}
					className="invert-on-dark opacity-50"
				/>
			)}
		</button>
	);
};

export default SaveButton;
